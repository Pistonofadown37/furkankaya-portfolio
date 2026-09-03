/* =========================================================
   FURKAN KAYA - MOBILE LAYOUT FIX V4
   =========================================================
   This file is STRUCTURAL ONLY.
   It does not hard-code mobile typography or spacing values.
   Those values are controlled by admin/design.html -> Mobil
   through design-runtime.js.
   ========================================================= */
(function () {
    "use strict";

    var STYLE_ID = "fkSafeMobileFix";
    var MOBILE_QUERY = "(max-width: 800px)";

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

    /* Header: layout only; size comes from design-runtime */
    .header-container {
        max-width: 100% !important;
    }

    .site-logo {
        min-width: 0 !important;
        max-width: calc(100% - 58px) !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
    }

    .mobile-menu-button {
        flex: 0 0 auto !important;
        max-width: 44px !important;
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

    /* Containers */
    .section-container,
    .hero-container,
    .footer-container {
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /* Hero layout only */
    .hero-section {
        min-height: auto !important;
        height: auto !important;
        overflow: hidden !important;
    }

    .hero-container {
        grid-template-columns: minmax(0, 1fr) !important;
        min-height: auto !important;
    }

    .hero-content,
    .hero-visual {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .hero-content {
        overflow: visible !important;
        text-align: center !important;
    }

    .hero-title,
    .hero-description,
    .hero-small-text {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    .hero-buttons {
        width: 100% !important;
        max-width: 100% !important;
        flex-direction: column !important;
        align-items: stretch !important;
    }

    .primary-button,
    .secondary-button {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .hero-brand {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .hero-brand-main,
    .hero-brand-name {
        max-width: 100% !important;
    }

    .hero-gold-glow,
    .brand-glow {
        max-width: 90vw !important;
        max-height: 90vw !important;
    }

    /* Brand strip layout only */
    .hero-brands {
        position: relative !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: hidden !important;
    }

    .brands-container {
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        overflow: hidden !important;
    }

    .brands-container span {
        max-width: 100% !important;
        white-space: normal !important;
        text-align: center !important;
        overflow-wrap: anywhere !important;
    }

    /* Sections */
    .section-heading,
    .section-heading h2,
    .section-heading > p,
    .about-heading h2 {
        max-width: 100% !important;
    }

    /* Portfolio */
    .portfolio-slider {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .portfolio-card,
    .portfolio-image {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    /* About */
    .about-grid,
    .about-content,
    .about-stats,
    .about-stat {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .about-grid {
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .about-stats {
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .about-stat {
        border-right: none !important;
    }

    /* Services: mobile must be one readable column.
       Card dimensions remain controlled by desktop settings until
       dedicated mobile service controls are added. */
    .services-grid {
        display: grid !important;
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        grid-auto-rows: auto !important;
        align-items: stretch !important;
    }

    .service-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: auto !important;
        min-height: 0 !important;
    }

    .service-card p,
    .service-card h3 {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    /* Contact */
    .contact-box,
    .contact-content,
    .contact-links,
    .contact-link {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .contact-box {
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .contact-links {
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .contact-content h2,
    .contact-content p,
    .contact-link strong,
    .contact-link-label {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
    }

    /* Footer */
    .footer-container {
        max-width: 100% !important;
        flex-direction: column !important;
        align-items: flex-start !important;
    }
}
`;
    }

    function install() {
        if (!window.matchMedia(MOBILE_QUERY).matches) return;

        var style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            style.type = "text/css";
            document.head.appendChild(style);
        }

        style.textContent = css();

        /*
         * design-runtime.js creates its own style element after Supabase
         * loads. Put this structural stylesheet after it once, without an
         * observer loop.
         */
        var attempts = 0;
        var timer = setInterval(function () {
            attempts++;

            var runtime = document.getElementById("fkDesignRuntimeStyle");
            var ours = document.getElementById(STYLE_ID);

            if (runtime && ours && ours.parentNode === document.head) {
                document.head.appendChild(ours);
                clearInterval(timer);
            } else if (attempts >= 100) {
                clearInterval(timer);
            }
        }, 50);
    }

    function remove() {
        var style = document.getElementById(STYLE_ID);
        if (style) style.remove();
    }

    function start() {
        install();

        var mq = window.matchMedia(MOBILE_QUERY);

        if (mq.addEventListener) {
            mq.addEventListener("change", function () {
                if (mq.matches) install();
                else remove();
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
