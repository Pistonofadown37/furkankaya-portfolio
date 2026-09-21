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



    /*
     * HERO BRAND SAFETY
     * Do not rewrite the saved F/G letters here.
     * The Design panel controls the letters through design-runtime.js.
     * This layer only prevents the two-letter mark from being clipped.
     */
    function keepHeroBrandVisible() {
        var brand = document.querySelector(".hero-brand-main");
        var visual = document.querySelector(".hero-visual");
        var wrapper = document.querySelector(".hero-brand");

        if (!brand) return;

        if (visual) {
            visual.style.setProperty("overflow", "visible", "important");
        }

        if (wrapper) {
            wrapper.style.setProperty("overflow", "visible", "important");
            wrapper.style.setProperty("width", "100%", "important");
            wrapper.style.setProperty("max-width", "100%", "important");
        }

        brand.style.setProperty("display", "flex", "important");
        brand.style.setProperty("flex-wrap", "nowrap", "important");
        brand.style.setProperty("white-space", "nowrap", "important");
        brand.style.setProperty("width", "max-content", "important");
        brand.style.setProperty("max-width", "none", "important");
        brand.style.setProperty("margin-left", "auto", "important");
        brand.style.setProperty("margin-right", "auto", "important");
        brand.style.setProperty("overflow", "visible", "important");
        brand.style.setProperty("justify-content", "center", "important");
    }

    function startBrandSafety() {
        keepHeroBrandVisible();
        setTimeout(keepHeroBrandVisible, 150);
        setTimeout(keepHeroBrandVisible, 700);
    }

    startBrandSafety();

    /*
     * Load the mobile settings controller after the structure fix.
     * It reads the values saved from Yönetim Paneli > Tasarım > Mobil.
     */
    install();

    if (!document.getElementById("fkMobileSettingsScript")) {
        var script = document.createElement("script");
        script.id = "fkMobileSettingsScript";
        script.src = "mobile-settings.js?v=5";
        script.defer = true;
        document.head.appendChild(script);
    }
})();
