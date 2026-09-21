import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const PERMISSIONS = [
    "dashboard",
    "portfolio",
    "settings",
    "design",
    "contact",
    "shopier",
    "admins"
];

function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
        }
    });
}

function cleanPermissions(value: unknown) {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(function (item) {
        return typeof item === "string" && PERMISSIONS.includes(item);
    });
}

function getBearerToken(req: Request) {
    const header = req.headers.get("Authorization") || "";

    if (!header.toLowerCase().startsWith("bearer ")) {
        return "";
    }

    return header.slice(7).trim();
}

function getServiceKey() {
    return Deno.env.get("ADMIN_SERVICE_ROLE_KEY") || "";
}

Deno.serve(async function (req) {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return json({ error: "Sadece POST destekleniyor." }, 405);
    }

    const token = getBearerToken(req);

    if (!token) {
        return json({ error: "Oturum doğrulanamadı." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = getServiceKey();

    if (!supabaseUrl || !serviceKey) {
        return json({
            error:
                "Supabase Edge Function için secret key bulunamadı. " +
                "Function Secrets bölümünü kontrol edin."
        }, 500);
    }

    const adminClient = createClient(
        supabaseUrl,
        serviceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const userClient = createClient(
        supabaseUrl,
        serviceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const userResult = await userClient.auth.getUser(token);

    if (userResult.error || !userResult.data.user) {
        return json({ error: "Oturum geçersiz veya süresi dolmuş." }, 401);
    }

    const caller = userResult.data.user;

    const tableResult = await adminClient
        .from("admin_users")
        .select("*")
        .eq("id", caller.id)
        .maybeSingle();

    if (tableResult.error) {
        return json({
            error:
                "admin_users tablosu hazır değil. Önce supabase/admin-users.sql dosyasını Supabase SQL Editor'da çalıştırın."
        }, 500);
    }

    let callerAdmin = tableResult.data;

    /*
     * İlk kurulum: admin_users tablosu boşsa mevcut ve zaten
     * oturum açmış olan ilk yönetici otomatik olarak Süper Admin olur.
     */
    if (!callerAdmin) {
        const countResult = await adminClient
            .from("admin_users")
            .select("id", { count: "exact", head: true });

        if (countResult.error) {
            return json({ error: countResult.error.message }, 500);
        }

        if ((countResult.count || 0) === 0) {
            const bootstrap = await adminClient
                .from("admin_users")
                .insert({
                    id: caller.id,
                    email: caller.email || "",
                    full_name:
                        caller.user_metadata?.full_name ||
                        caller.email?.split("@")[0] ||
                        "Ana Yönetici",
                    is_super_admin: true,
                    active: true,
                    permissions: PERMISSIONS
                })
                .select("*")
                .single();

            if (bootstrap.error) {
                return json({ error: bootstrap.error.message }, 500);
            }

            callerAdmin = bootstrap.data;
        }
    }

    if (!callerAdmin || callerAdmin.active === false) {
        return json({ error: "Bu hesabın yönetim erişimi yok." }, 403);
    }

    const body = await req.json().catch(function () {
        return {};
    });

    const action = body.action || "me";

    if (action === "me") {
        return json({
            admin: callerAdmin.is_super_admin
                ? {
                    ...callerAdmin,
                    permissions: PERMISSIONS
                }
                : callerAdmin
        });
    }

    if (!callerAdmin.is_super_admin) {
        return json({
            error: "Bu işlem için Süper Admin yetkisi gerekiyor."
        }, 403);
    }

    if (action === "list") {
        const result = await adminClient
            .from("admin_users")
            .select("*")
            .order("created_at", { ascending: true });

        if (result.error) {
            return json({ error: result.error.message }, 500);
        }

        const admins = (result.data || []).map(function (item) {
            if (item.is_super_admin) {
                return {
                    ...item,
                    permissions: PERMISSIONS
                };
            }

            return {
                ...item,
                permissions: cleanPermissions(item.permissions)
            };
        });

        return json({ admins: admins });
    }

    if (action === "create") {
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        const fullName = String(body.full_name || "").trim();
        const isSuperAdmin = body.is_super_admin === true;
        const active = body.active !== false;
        const permissions = isSuperAdmin
            ? PERMISSIONS
            : cleanPermissions(body.permissions);

        if (!email) {
            return json({ error: "E-posta adresi zorunludur." }, 400);
        }

        if (password.length < 8) {
            return json({
                error: "Şifre en az 8 karakter olmalıdır."
            }, 400);
        }

        const created = await adminClient.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName
            }
        });

        if (created.error || !created.data.user) {
            return json({
                error:
                    created.error?.message ||
                    "Auth kullanıcısı oluşturulamadı."
            }, 400);
        }

        const authUser = created.data.user;

        const inserted = await adminClient
            .from("admin_users")
            .insert({
                id: authUser.id,
                email: email,
                full_name: fullName || email.split("@")[0],
                is_super_admin: isSuperAdmin,
                active: active,
                permissions: permissions
            })
            .select("*")
            .single();

        if (inserted.error) {
            await adminClient.auth.admin.deleteUser(authUser.id);
            return json({
                error:
                    "Admin kaydı oluşturulamadı: " +
                    inserted.error.message
            }, 500);
        }

        return json({ admin: inserted.data });
    }

    if (action === "update") {
        const id = String(body.id || "");

        if (!id) {
            return json({ error: "Admin ID bulunamadı." }, 400);
        }

        const existing = await adminClient
            .from("admin_users")
            .select("*")
            .eq("id", id)
            .single();

        if (existing.error || !existing.data) {
            return json({ error: "Admin bulunamadı." }, 404);
        }

        const target = existing.data;
        const isSelf = target.id === caller.id;
        const wantsSuper = body.is_super_admin === true;
        const wantsActive = body.active !== false;

        if (isSelf && (!wantsSuper || !wantsActive)) {
            return json({
                error:
                    "Kendi Süper Admin yetkinizi veya aktif durumunuzu bu ekrandan kaldıramazsınız."
            }, 400);
        }

        if (
            target.is_super_admin &&
            !wantsSuper
        ) {
            const count = await adminClient
                .from("admin_users")
                .select("id", { count: "exact", head: true })
                .eq("is_super_admin", true)
                .eq("active", true);

            if (!count.error && (count.count || 0) <= 1) {
                return json({
                    error:
                        "Aktif son Süper Admin düşürülemez. Önce başka bir Süper Admin oluşturun."
                }, 400);
            }
        }

        const updateData = {
            full_name: String(body.full_name || "").trim(),
            is_super_admin: wantsSuper,
            active: wantsActive,
            permissions: wantsSuper
                ? PERMISSIONS
                : cleanPermissions(body.permissions)
        };

        const updated = await adminClient
            .from("admin_users")
            .update(updateData)
            .eq("id", id)
            .select("*")
            .single();

        if (updated.error) {
            return json({ error: updated.error.message }, 500);
        }

        const newPassword = body.password
            ? String(body.password)
            : "";

        if (newPassword) {
            if (newPassword.length < 8) {
                return json({
                    error: "Yeni şifre en az 8 karakter olmalıdır."
                }, 400);
            }

            const passwordResult =
                await adminClient.auth.admin.updateUserById(
                    id,
                    { password: newPassword }
                );

            if (passwordResult.error) {
                return json({
                    error:
                        "Admin bilgileri güncellendi ancak şifre değiştirilemedi: " +
                        passwordResult.error.message
                }, 500);
            }
        }

        return json({ admin: updated.data });
    }

    if (action === "deactivate") {
        const id = String(body.id || "");

        if (!id) {
            return json({ error: "Admin ID bulunamadı." }, 400);
        }

        if (id === caller.id) {
            return json({
                error: "Kendi hesabınızı pasifleştiremezsiniz."
            }, 400);
        }

        const target = await adminClient
            .from("admin_users")
            .select("*")
            .eq("id", id)
            .single();

        if (target.error || !target.data) {
            return json({ error: "Admin bulunamadı." }, 404);
        }

        if (target.data.is_super_admin) {
            const count = await adminClient
                .from("admin_users")
                .select("id", { count: "exact", head: true })
                .eq("is_super_admin", true)
                .eq("active", true);

            if (!count.error && (count.count || 0) <= 1) {
                return json({
                    error:
                        "Aktif son Süper Admin pasifleştirilemez."
                }, 400);
            }
        }

        const updated = await adminClient
            .from("admin_users")
            .update({ active: false })
            .eq("id", id);

        if (updated.error) {
            return json({ error: updated.error.message }, 500);
        }

        return json({ success: true });
    }

    return json({ error: "Bilinmeyen işlem." }, 400);
});