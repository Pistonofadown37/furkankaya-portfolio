/* =========================================
   FURKAN KAYA
   ADMIN ERİŞİM / YETKİ SİSTEMİ
========================================= */
(function () {
    "use strict";

    const PERMISSIONS = {
        dashboard: "Genel Bakış",
        portfolio: "Portföy",
        settings: "Site Ayarları",
        design: "Tasarım",
        contact: "İletişim",
        shopier: "Online Ürünler",
        admins: "Admin Yönetimi"
    };

    const ALL_PERMISSIONS = Object.keys(PERMISSIONS);
    const client = window.supabaseClient;

    let state = null;
    let initialized = false;

    async function invoke(action, payload) {
        if (!client) {
            throw new Error("Supabase bağlantısı bulunamadı.");
        }

        const body = Object.assign({ action: action }, payload || {});
        const result = await client.functions.invoke("admin-users", {
            body: body
        });

        if (result.error) {
            throw result.error;
        }

        if (result.data && result.data.error) {
            throw new Error(result.data.error);
        }

        return result.data || {};
    }

    async function load() {
        if (initialized) {
            return state;
        }

        if (!client) {
            throw new Error("Supabase bağlantısı bulunamadı.");
        }

        const sessionResult = await client.auth.getSession();

        if (
            sessionResult.error ||
            !sessionResult.data ||
            !sessionResult.data.session
        ) {
            window.location.replace("login.html");
            throw new Error("Oturum bulunamadı.");
        }

        try {
            const data = await invoke("me");

            state = data.admin || null;

            if (!state || state.active === false) {
                await client.auth.signOut();
                window.location.replace("login.html");
                throw new Error("Bu yönetim hesabı aktif değil.");
            }

            if (state.is_super_admin) {
                state.permissions = ALL_PERMISSIONS.slice();
            } else {
                state.permissions = Array.isArray(state.permissions)
                    ? state.permissions.filter(function (key) {
                        return ALL_PERMISSIONS.includes(key);
                    })
                    : [];
            }

            initialized = true;
            return state;

        } catch (error) {
            /*
             * Yetki sistemi henüz Supabase'e kurulmadıysa mevcut
             * admin panelini bozmamak için eski davranışa geç.
             * SQL + Edge Function kurulunca gerçek RBAC devreye girer.
             */
            const message = String(error && error.message || "").toLowerCase();

            if (
                message.includes("function") ||
                message.includes("not found") ||
                message.includes("404") ||
                message.includes("admin_users") ||
                message.includes("failed to send")
            ) {
                state = {
                    id: null,
                    email: null,
                    full_name: "Mevcut Yönetici",
                    is_super_admin: true,
                    active: true,
                    permissions: ALL_PERMISSIONS.slice(),
                    legacyFallback: true
                };

                initialized = true;
                return state;
            }

            throw error;
        }
    }

    async function requirePermission(permission) {
        const admin = await load();

        if (
            admin.is_super_admin ||
            admin.permissions.includes(permission)
        ) {
            return admin;
        }

        showAccessDenied();
        return null;
    }

    function hasPermission(permission) {
        if (!state) {
            return false;
        }

        return (
            state.is_super_admin ||
            state.permissions.includes(permission)
        );
    }

    function showAccessDenied() {
        document.body.innerHTML = `
            <main style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                padding:30px;
                background:#090a0d;
                color:#f4f4f5;
                font-family:Arial,Helvetica,sans-serif;
            ">
                <section style="
                    width:min(520px,100%);
                    padding:38px;
                    border:1px solid rgba(212,168,83,.35);
                    border-radius:20px;
                    background:#121419;
                    text-align:center;
                ">
                    <div style="font-size:44px;margin-bottom:15px;">🔒</div>
                    <h1 style="margin:0 0 12px;">Erişim Yetkiniz Yok</h1>
                    <p style="color:#9a9ca4;line-height:1.7;margin:0 0 24px;">
                        Bu yönetim paneline erişim hesabınıza tanımlanmamış.
                    </p>
                    <a href="admin.html" style="
                        display:inline-flex;
                        min-height:46px;
                        align-items:center;
                        justify-content:center;
                        padding:0 20px;
                        border-radius:10px;
                        background:#d4a853;
                        color:#17120a;
                        text-decoration:none;
                        font-weight:800;
                    ">Yönetim Paneline Dön</a>
                </section>
            </main>
        `;
    }

    window.AdminAccess = {
        PERMISSIONS: PERMISSIONS,
        ALL_PERMISSIONS: ALL_PERMISSIONS,
        load: load,
        invoke: invoke,
        requirePermission: requirePermission,
        hasPermission: hasPermission,
        getState: function () {
            return state;
        }
    };
})();