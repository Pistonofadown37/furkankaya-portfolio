/* Shopier menü bağlantısı - yetki sistemine uyumlu. */
(function () {
    "use strict";

    async function addShopierMenu() {
        const nav = document.querySelector(".admin-navigation");
        if (!nav || nav.querySelector('[data-shopier-menu="true"]')) return;

        if (window.AdminAccess) {
            try {
                const admin = await window.AdminAccess.load();

                if (
                    !admin ||
                    (!admin.is_super_admin &&
                    !(admin.permissions || []).includes("shopier"))
                ) {
                    return;
                }
            } catch (error) {
                console.error("Shopier yetki kontrolü:", error);
                return;
            }
        }

        const link = document.createElement("a");
        link.href = "shopier.html";
        link.className = "admin-nav-button admin-shopier-link";
        link.dataset.shopierMenu = "true";
        link.dataset.permission = "shopier";
        link.textContent = "🛍️ Online Ürünler";

        nav.appendChild(link);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addShopierMenu, { once: true });
    } else {
        addShopierMenu();
    }
})();