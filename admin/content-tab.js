/* =========================================
   FURKAN KAYA
   YÖNETİM PANELİ - İÇERİK SEKME ENJEKSİYONU
========================================= */

(function () {
    "use strict";

    function addContentTab() {
        const navigation = document.querySelector(".admin-navigation");

        if (!navigation || navigation.querySelector(".admin-content-link")) {
            return;
        }

        const link = document.createElement("a");
        link.href = "content.html";
        link.className = "admin-nav-button admin-content-link";
        link.textContent = "✎ İçerik";

        const designLink = navigation.querySelector(".admin-design-link");

        if (designLink) {
            navigation.insertBefore(link, designLink);
        } else {
            navigation.appendChild(link);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addContentTab);
    } else {
        addContentTab();
    }
})();
