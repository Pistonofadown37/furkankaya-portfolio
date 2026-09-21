/* FURKAN KAYA - MOBILE STRUCTURE FIX
   Mobile layout only. Visual values are controlled by design-runtime.js
   and mobile-settings.js so the Design > Mobil panel remains authoritative.
*/
(function () {
    "use strict";

    var STYLE_ID = "fkSafeMobileFix";

    function css() {
        return `
@media (max-width: 800px) {
    html,
    body {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow-x: hidden !important;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box !important;
        min-width: 0;
    }

    img,
    svg,
    video,
    canvas {
        max-width: 100% !important;
    }

    .header-container {
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    .site-logo {
        min-width: 0 !important;
        max-width: calc(100% - 54px) !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
    }

    .mobile-menu-button {
        flex: 0 0 auto !important;
    }

    .mobile-menu {
        max-width: 100vw !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }

    .mobile-nav-link {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
    }

    .section-container,
    .hero-container,
    .footer-container {
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    .hero-section {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .hero-container {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
        gap: 0 !important;
    }

    .hero-content,
    .hero-visual {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .hero-content {
        text-align: center !important;
        overflow: visible !important;
    }

    .hero-small-text,
    .hero-title,
    .hero-description {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
        word-break: normal !important;
    }

    .hero-title {
        overflow: visible !important;
    }

    .hero-title span,
    .hero-title strong {
        max-width: 100% !important;
    }

    .hero-description {
        overflow-wrap: break-word !important;
    }

    .hero-buttons {
        width: 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
    }

    .primary-button,
    .secondary-button {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .hero-visual {
        overflow: hidden !important;
    }

    .hero-brand,
    .hero-brand-main,
    .hero-brand-name {
        max-width: 100% !important;
    }

    .hero-brand-main {
        overflow: visible !important;
    }

    .hero-brand-name {
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }

    .hero-brands {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .brands-container {
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        align-items: center !important;
        max-height: none !important;
        overflow: hidden !important;
    }

    .brands-container span {
        max-width: 100% !important;
        white-space: normal !important;
        text-align: center !important;
        overflow-wrap: anywhere !important;
    }

    .section-heading,
    .about-heading,
    .services-heading {
        width: 100% !important;
        max-width: 100% !important;
    }

    .section-heading h2,
    .about-heading h2,
    .services-heading h2,
    .section-heading > p {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
    }

    .portfolio-slider-wrapper,
    .portfolio-slider-viewport,
    .portfolio-slider {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .portfolio-slider-viewport {
        overflow: hidden !important;
    }

    .portfolio-slider {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        grid-auto-flow: row !important;
        align-items: stretch !important;
    }

    .portfolio-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .portfolio-image {
        width: 100% !important;
        max-width: 100% !important;
    }

    .portfolio-info,
    .portfolio-info h3,
    .portfolio-info p {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
    }

    .slider-arrow {
        z-index: 5 !important;
        transform: translateY(-50%) !important;
    }

    .about-grid {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .about-content {
        width: 100% !important;
        max-width: 100% !important;
    }

    .about-stats {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .about-stat {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .services-grid {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        grid-auto-rows: auto !important;
    }

    .service-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: auto !important;
    }

    .service-card h3,
    .service-card p {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
    }

    .contact-box {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        overflow: hidden !important;
    }

    .contact-content,
    .contact-links,
    .contact-link {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .contact-content h2,
    .contact-content p,
    .contact-link strong,
    .contact-link-label {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
    }

    .footer-container {
        min-width: 0 !important;
        overflow: hidden !important;
    }
}

@media (max-width: 500px) {
    .section-container,
    .hero-container,
    .footer-container,
    .brands-container,
    .header-container {
        width: calc(100% - 32px) !important;
    }

    .site-logo {
        max-width: calc(100% - 50px) !important;
    }
}
`;
    }

    function install() {
        var style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }
        style.textContent = css();
    }


    /* FURKAN KAYA - MOBILE FINAL BRAND ICON FIX */
    function fixBrandAndServiceIcons() {
        var letter2 = document.querySelector(".brand-k");
        if (
            letter2 &&
            (
                !letter2.textContent.trim() ||
                letter2.textContent.trim().toUpperCase() === "C" ||
                letter2.textContent.trim().toUpperCase() === "K"
            )
        ) {
            letter2.textContent = "G";
        }

        var icons = document.querySelectorAll(".service-icon");
        var svgs = [
            '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 45l7-7 25-25a5 5 0 017 7L26 45l-14 4zM39 10l15 15" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M10 54h44" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
            '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 7l5.5 11.2L50 20l-9 8.8 2.1 12.5L32 35.4 20.9 41.3 23 28.8 14 20l12.5-1.8L32 7z" fill="currentColor"/><path d="M14 48h36" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
            '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="12" width="48" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="5"/><path d="M22 54h20M32 46v8" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>'
        ];

        icons.forEach(function(icon, index) {
            if (svgs[index]) {
                icon.innerHTML = svgs[index];
                icon.style.display = "grid";
                icon.style.placeItems = "center";
            }
        });

        if (!document.getElementById("fkMobileFinalIconStyle")) {
            var style = document.createElement("style");
            style.id = "fkMobileFinalIconStyle";
            style.textContent = [
                ".service-icon svg{width:42px;height:42px;display:block;max-width:100%;}",
                "@media(max-width:800px){.service-icon{flex:0 0 116px;min-width:116px;}.service-icon svg{width:40px;height:40px;}}",
                "@media(max-width:500px){.service-icon{flex-basis:100px;min-width:100px;}.service-icon svg{width:36px;height:36px;}}"
            ].join("");
            document.head.appendChild(style);
        }
    }

    function runFinalBrandIconFix() {
        fixBrandAndServiceIcons();
        setTimeout(fixBrandAndServiceIcons, 150);
        setTimeout(fixBrandAndServiceIcons, 700);
    }

    runFinalBrandIconFix();

    /* Keep the hero brand synchronized if design-runtime applies the saved value later. */
    (function watchHeroBrand() {
        var tries = 0;
        var timer = setInterval(function () {
            var el = document.querySelector(".brand-k");
            if (el) {
                var value = el.textContent.trim().toUpperCase();
                if (!value || value === "C" || value === "K") {
                    el.textContent = "G";
                }
            }

            tries++;
            if (tries >= 20) {
                clearInterval(timer);
            }
        }, 500);

        var brand = document.querySelector(".hero-brand-main");
        if (brand && window.MutationObserver) {
            var observer = new MutationObserver(function () {
                var el = document.querySelector(".brand-k");
                if (!el) return;
                var value = el.textContent.trim().toUpperCase();
                if (!value || value === "C" || value === "K") {
                    el.textContent = "G";
                }
            });
            observer.observe(brand, { childList: true, subtree: true, characterData: true });
            setTimeout(function () {
                observer.disconnect();
            }, 12000);
        }
    })();

    install();

    if (!document.getElementById("fkMobileSettingsScript")) {
        var script = document.createElement("script");
        script.id = "fkMobileSettingsScript";
        script.src = "mobile-settings.js?v=4";
        script.defer = true;
        document.head.appendChild(script);
    }
})();
