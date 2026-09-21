/* =========================================
   FURKAN KAYA
   ADMIN KULLANICI YÖNETİMİ
========================================= */
(function () {
    "use strict";

    const form = document.getElementById("adminUserForm");
    const list = document.getElementById("adminUsersList");
    const message = document.getElementById("adminUsersMessage");
    const cancelButton = document.getElementById("cancelAdminUserButton");
    const formTitle = document.getElementById("adminUserFormTitle");

    let editingId = null;
    let currentAdmin = null;

    document.addEventListener("DOMContentLoaded", initialize);

    async function initialize() {
        if (!form || !window.AdminAccess) {
            return;
        }

        try {
            currentAdmin = await window.AdminAccess.requirePermission("admins");

            if (!currentAdmin) {
                return;
            }

            bindEvents();
            await loadUsers();

        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Admin yönetimi başlatılamadı.",
                "error"
            );
        }
    }

    function bindEvents() {
        form.addEventListener("submit", saveUser);

        if (cancelButton) {
            cancelButton.addEventListener("click", resetForm);
        }

        list.addEventListener("click", async function (event) {
            const edit = event.target.closest("[data-action='edit']");
            const deactivate = event.target.closest("[data-action='deactivate']");

            if (edit) {
                await editUser(edit.dataset.id);
            }

            if (deactivate) {
                await deactivateUser(deactivate.dataset.id);
            }
        });
    }

    async function loadUsers() {
        list.innerHTML = '<div class="admin-loading">Adminler yükleniyor...</div>';

        try {
            const result = await window.AdminAccess.invoke("list");

            renderUsers(Array.isArray(result.admins) ? result.admins : []);

        } catch (error) {
            console.error(error);
            list.innerHTML = "";
            showMessage(
                error.message || "Adminler yüklenemedi.",
                "error"
            );
        }
    }

    function renderUsers(users) {
        if (!users.length) {
            list.innerHTML =
                '<div class="admin-empty-state">Henüz eklenmiş admin bulunmuyor.</div>';
            return;
        }

        list.innerHTML = users.map(function (user) {
            const permissions = user.is_super_admin
                ? "Tüm paneller"
                : (Array.isArray(user.permissions) && user.permissions.length
                    ? user.permissions.map(function (key) {
                        return window.AdminAccess.PERMISSIONS[key] || key;
                    }).join(", ")
                    : "Panel erişimi yok");

            const status = user.active
                ? '<span class="admin-user-status active">Aktif</span>'
                : '<span class="admin-user-status inactive">Pasif</span>';

            const role = user.is_super_admin
                ? "Süper Admin"
                : "Admin";

            const isSelf = currentAdmin && currentAdmin.id === user.id;

            return `
                <article class="admin-user-item">
                    <div class="admin-user-main">
                        <div class="admin-user-avatar">
                            ${escapeHtml((user.full_name || user.email || "A").charAt(0).toUpperCase())}
                        </div>
                        <div>
                            <h3>${escapeHtml(user.full_name || "İsimsiz Admin")}</h3>
                            <p>${escapeHtml(user.email || "")}</p>
                            <div class="admin-user-meta">
                                <span>${escapeHtml(role)}</span>
                                ${status}
                            </div>
                            <small>${escapeHtml(permissions)}</small>
                        </div>
                    </div>

                    <div class="admin-user-actions">
                        <button
                            type="button"
                            class="admin-secondary-button"
                            data-action="edit"
                            data-id="${escapeAttribute(user.id)}"
                        >Düzenle</button>

                        <button
                            type="button"
                            class="admin-danger-button"
                            data-action="deactivate"
                            data-id="${escapeAttribute(user.id)}"
                            ${(!user.active || isSelf) ? "disabled" : ""}
                        >Pasifleştir</button>
                    </div>
                </article>
            `;
        }).join("");
    }

    async function saveUser(event) {
        event.preventDefault();

        const button = form.querySelector('button[type="submit"]');

        const payload = {
            email: getValue("adminUserEmail"),
            full_name: getValue("adminUserName"),
            password: getValue("adminUserPassword"),
            is_super_admin: document.getElementById("adminUserSuper").checked,
            active: document.getElementById("adminUserActive").checked,
            permissions: getSelectedPermissions()
        };

        if (!payload.email) {
            showMessage("E-posta adresi zorunludur.", "error");
            return;
        }

        if (!editingId && payload.password.length < 8) {
            showMessage("Yeni admin şifresi en az 8 karakter olmalıdır.", "error");
            return;
        }

        try {
            button.disabled = true;
            button.textContent = "Kaydediliyor...";

            if (editingId) {
                await window.AdminAccess.invoke("update", {
                    id: editingId,
                    full_name: payload.full_name,
                    password: payload.password || null,
                    is_super_admin: payload.is_super_admin,
                    active: payload.active,
                    permissions: payload.permissions
                });

                showMessage("Admin bilgileri güncellendi.", "success");

            } else {
                await window.AdminAccess.invoke("create", payload);
                showMessage("Yeni admin oluşturuldu.", "success");
            }

            resetForm();
            await loadUsers();

        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Admin kaydedilemedi.",
                "error"
            );
        } finally {
            button.disabled = false;
            button.textContent = editingId ? "Değişiklikleri Kaydet" : "Admin Oluştur";
        }
    }

    async function editUser(id) {
        try {
            const result = await window.AdminAccess.invoke("list");
            const user = (result.admins || []).find(function (item) {
                return item.id === id;
            });

            if (!user) {
                throw new Error("Admin bulunamadı.");
            }

            editingId = user.id;
            formTitle.textContent = "Admini Düzenle";

            setValue("adminUserName", user.full_name || "");
            setValue("adminUserEmail", user.email || "");
            setValue("adminUserPassword", "");
            document.getElementById("adminUserSuper").checked = !!user.is_super_admin;
            document.getElementById("adminUserActive").checked = user.active !== false;

            document.querySelectorAll("[data-admin-permission]").forEach(function (checkbox) {
                checkbox.checked =
                    user.is_super_admin ||
                    (Array.isArray(user.permissions) && user.permissions.includes(checkbox.value));
            });

            document.getElementById("adminUserEmail").disabled = true;

            const submit = form.querySelector('button[type="submit"]');
            if (submit) {
                submit.textContent = "Değişiklikleri Kaydet";
            }

            cancelButton.style.display = "inline-flex";
            form.scrollIntoView({ behavior: "smooth", block: "start" });

        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Admin bilgileri alınamadı.",
                "error"
            );
        }
    }

    async function deactivateUser(id) {
        if (!window.confirm("Bu admin hesabını pasifleştirmek istediğinize emin misiniz?")) {
            return;
        }

        try {
            await window.AdminAccess.invoke("deactivate", { id: id });
            showMessage("Admin hesabı pasifleştirildi.", "success");
            await loadUsers();
        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Admin pasifleştirilemedi.",
                "error"
            );
        }
    }

    function resetForm() {
        editingId = null;
        form.reset();
        document.getElementById("adminUserEmail").disabled = false;
        document.getElementById("adminUserActive").checked = true;
        document.getElementById("adminUserSuper").checked = false;

        document.querySelectorAll("[data-admin-permission]").forEach(function (checkbox) {
            checkbox.checked = false;
        });

        formTitle.textContent = "Yeni Admin Ekle";

        const submit = form.querySelector('button[type="submit"]');
        if (submit) {
            submit.textContent = "Admin Oluştur";
        }

        cancelButton.style.display = "none";
    }

    function getSelectedPermissions() {
        if (document.getElementById("adminUserSuper").checked) {
            return window.AdminAccess.ALL_PERMISSIONS.slice();
        }

        return Array.from(
            document.querySelectorAll("[data-admin-permission]:checked")
        ).map(function (checkbox) {
            return checkbox.value;
        });
    }

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function setValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value ?? "";
        }
    }

    function showMessage(text, type) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.className = "admin-users-message show " + type;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }
})();