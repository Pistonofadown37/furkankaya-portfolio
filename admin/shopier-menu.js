/* Shopier menü bağlantısı - mevcut admin panelini değiştirmeden ekler. */
(function () {
    "use strict";

    function addShopierMenu() {
        const nav = document.querySelector(".admin-navigation");
        if (!nav || nav.querySelector('[data-shopier-menu="true"]')) return;

        const link = document.createElement("a");
        link.href = "shopier.html";
        link.className = "admin-nav-button admin-shopier-link";
        link.dataset.shopierMenu = "true";
        link.textContent = "🛍️ Online Ürünler";

        nav.appendChild(link);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addShopierMenu, { once: true });
    } else {
        addShopierMenu();
    }
})();
