/* =========================================================
   FURKAN KAYA - SAFE MOBILE LAYOUT OVERRIDE
   =========================================================
   IMPORTANT:
   - This file DOES NOT connect to Supabase.
   - This file DOES NOT change page text/content.
   - This file DOES NOT change desktop styles.
   - It only adds CSS for screens <= 800px.
   - It waits for design-runtime's generated style and then
     places this override AFTER it, so mobile settings win.
   ========================================================= */

(function () {
    "use strict";

    var STYLE_ID = "fkSafeMobileFix";
    var MOBILE_QUERY = "(max-width: 800px)";

    function css() {
        return `
/* =========================================================
   MOBILE ONLY
   ========================================================= */

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

    /* ---------------- HEADER ---------------- */

    .site-header {
        height: 72px !important;
    }

    .header-container {
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
    }

    .site-logo {
        max-width: calc(100% - 58px) !important;
        min-width: 0 !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        font-size: clamp(14px, 4.5vw, 19px) !important;
        letter-spacing: 1px !important;
        gap: 5px !important;
    }

    .mobile-menu-button {
        display: flex !important;
        flex: 0 0 44px !important;
        width: 44px !important;
        height: 44px !important;
    }

    .mobile-menu {
        top: 72px !important;
        max-height: calc(100dvh - 72px) !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding: 8px 18px 18px !important;
    }

    .mobile-nav-link {
        width: 100% !important;
        max-width: 100% !important;
        padding: 15px 4px !important;
        overflow-wrap: anywhere !important;
    }

    /* ---------------- CONTAINERS ---------------- */

    .section-container,
    .hero-container,
    .footer-container {
        width: calc(100% - 36px) !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
    }

    /* ---------------- HERO ---------------- */

    .hero-section {
        min-height: auto !important;
        height: auto !important;
        overflow: hidden !important;
    }

    .hero-container {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 0 !important;
        min-height: auto !important;
    }

    .hero-content {
        width: 100% !important;
        max-width: 100% !important;
        padding: 64px 0 18px !important;
        text-align: center !important;
        overflow: visible !important;
    }

    .hero-small-text {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 20px !important;
        font-size: clamp(8px, 2.5vw, 10px) !important;
        letter-spacing: min(2.5px, 0.55vw) !important;
        line-height: 1.6 !important;
        white-space: normal !important;
        overflow-wrap: anywhere !important;
    }

    /*
       HERO TITLE:
       Use viewport-relative sizing instead of the saved desktop
       title value. This prevents "dönüştürüyorum" etc. from
       being clipped on narrow phones.
    */
    .hero-title {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        margin-bottom: 24px !important;

        font-size: clamp(30px, 9vw, 40px) !important;
        line-height: 0.99 !important;
        letter-spacing: clamp(-2.5px, -0.55vw, -1.6px) !important;

        overflow: visible !important;
        white-space: normal !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
        hyphens: none !important;
    }

    .hero-title span,
    .hero-title strong {
        display: block !important;
        max-width: 100% !important;
    }

    .hero-description {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        margin-bottom: 28px !important;
        font-size: 14px !important;
        line-height: 1.65 !important;
        overflow-wrap: break-word !important;
    }

    .hero-buttons {
        width: 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 12px !important;
    }

    .primary-button,
    .secondary-button {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: 54px !important;
        min-height: 54px !important;
        padding-left: 16px !important;
        padding-right: 16px !important;
        gap: 12px !important;
        overflow: hidden !important;
    }

    .primary-button span,
    .secondary-button span {
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    /* ---------------- HERO BRAND ---------------- */

    .hero-visual {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        min-height: 230px !important;
        height: 230px !important;
        overflow: hidden !important;
    }

    .hero-brand {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .hero-brand-main {
        width: 100% !important;
        max-width: 100% !important;
        font-size: min(150px, 34vw) !important;
        letter-spacing: -14px !important;
        gap: 4px !important;
    }

    .hero-brand-name {
        max-width: 100% !important;
        margin-top: 20px !important;
        padding-left: 0 !important;
        font-size: min(30px, 7vw) !important;
        letter-spacing: 3px !important;
        white-space: nowrap !important;
    }

    .brand-line {
        max-width: 80% !important;
        width: 70% !important;
    }

    .hero-gold-glow,
    .brand-glow {
        max-width: 90vw !important;
        max-height: 90vw !important;
    }

    .scroll-down {
        display: none !important;
    }

    /* ---------------- HERO BRAND STRIP ---------------- */

    .hero-brands {
        position: relative !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        margin-top: 0 !important;
        padding: 14px 0 16px !important;
        overflow: hidden !important;
    }

    .brands-container {
        width: calc(100% - 36px) !important;
        height: auto !important;
        min-height: 0 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 8px 14px !important;
        padding: 0 !important;
        overflow: hidden !important;
    }

    .brands-container span {
        max-width: calc(50% - 10px) !important;
        font-size: 8px !important;
        letter-spacing: 1px !important;
        line-height: 1.3 !important;
        white-space: normal !important;
        text-align: center !important;
        overflow-wrap: anywhere !important;
    }

    /* ---------------- SECTIONS ---------------- */

    .portfolio-section,
    .about-section,
    .services-section {
        padding-top: 64px !important;
        padding-bottom: 64px !important;
    }

    .section-heading {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 32px !important;
    }

    .section-heading h2,
    .about-heading h2 {
        max-width: 100% !important;
        font-size: clamp(30px, 8.5vw, 38px) !important;
        line-height: 1.05 !important;
        letter-spacing: -1.5px !important;
    }

    .section-heading > p {
        width: 100% !important;
        max-width: 100% !important;
        margin-top: 14px !important;
        font-size: 14px !important;
        line-height: 1.65 !important;
        overflow-wrap: break-word !important;
    }

    /* ---------------- PORTFOLIO ---------------- */

    .portfolio-slider {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 16px !important;
    }

    .portfolio-card {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
    }

    .portfolio-image {
        width: 100% !important;
        height: 220px !important;
    }

    .portfolio-info {
        padding: 16px !important;
    }

    .portfolio-info h3 {
        font-size: 17px !important;
        line-height: 1.25 !important;
    }

    .portfolio-info p {
        font-size: 12px !important;
        line-height: 1.55 !important;
    }

    .slider-arrow {
        width: 40px !important;
        height: 40px !important;
        top: 110px !important;
        font-size: 17px !important;
    }

    .slider-prev {
        left: 6px !important;
    }

    .slider-next {
        right: 6px !important;
    }

    /* ---------------- ABOUT ---------------- */

    .about-grid {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 28px !important;
    }

    .about-content {
        width: 100% !important;
        max-width: 100% !important;
        padding-top: 0 !important;
    }

    .about-content p {
        font-size: 14px !important;
        line-height: 1.75 !important;
        overflow-wrap: break-word !important;
    }

    .about-stats {
        width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 24px !important;
    }

    .about-stat {
        width: 100% !important;
        min-width: 0 !important;
        padding: 0 0 24px !important;
        border-right: none !important;
        border-bottom: 1px solid var(--line) !important;
    }

    .about-stat:last-child {
        border-bottom: none !important;
    }

    /* ---------------- SERVICES ---------------- */

    .services-grid {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 16px !important;
    }

    .service-card {
        width: 100% !important;
        min-width: 0 !important;
        min-height: 0 !important;
        padding: 22px 18px !important;
        gap: 16px !important;
    }

    .service-card h3 {
        font-size: 17px !important;
        line-height: 1.25 !important;
    }

    .service-card p {
        font-size: 13px !important;
        line-height: 1.6 !important;
        overflow-wrap: break-word !important;
    }

    /* ---------------- CONTACT ---------------- */

    .contact-box {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 24px !important;
        padding: 24px 18px !important;
        overflow: hidden !important;
    }

    .contact-content {
        width: 100% !important;
        max-width: 100% !important;
    }

    .contact-content h2 {
        max-width: 100% !important;
        font-size: clamp(30px, 8.5vw, 38px) !important;
        line-height: 1.05 !important;
    }

    .contact-content p {
        max-width: 100% !important;
        font-size: 14px !important;
        line-height: 1.7 !important;
        overflow-wrap: break-word !important;
    }

    .contact-links {
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: minmax(0, 1fr) !important;
    }

    .contact-link {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        min-height: 82px !important;
        padding: 16px 4px !important;
        border-left: none !important;
        border-top: 1px solid var(--line) !important;
        overflow: hidden !important;
    }

    .contact-link:first-child {
        border-top: none !important;
    }

    .contact-link > div:last-child {
        min-width: 0 !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .contact-link strong,
    .contact-link-label {
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
    }

    /* ---------------- LIGHTBOX ---------------- */

    .lightbox {
        padding: 16px !important;
    }

    .lightbox-content {
        width: 100% !important;
        max-width: 100% !important;
    }

    .lightbox-content img {
        max-width: 100% !important;
        max-height: 70vh !important;
        object-fit: contain !important;
    }

    .lightbox-close {
        top: 12px !important;
        right: 12px !important;
    }

    /* ---------------- FOOTER ---------------- */

    .footer-container {
        width: calc(100% - 36px) !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 16px !important;
    }
}

/* Narrow phones */
@media (max-width: 500px) {

    .hero-content {
        padding-top: 58px !important;
    }

    .hero-title {
        font-size: clamp(28px, 8.7vw, 36px) !important;
        letter-spacing: clamp(-2.3px, -0.5vw, -1.5px) !important;
    }

    .hero-description {
        font-size: 14px !important;
    }

    .hero-visual {
        min-height: 210px !important;
        height: 210px !important;
    }

    .hero-brand-main {
        font-size: min(135px, 33vw) !important;
        letter-spacing: -12px !important;
    }

    .hero-brand-name {
        font-size: min(28px, 7vw) !important;
        letter-spacing: 2px !important;
    }

    .portfolio-image {
        height: 200px !important;
    }

    .slider-arrow {
        top: 100px !important;
    }

    .contact-box {
        padding: 22px 16px !important;
    }
}
`;
    }

    function install() {
        if (!window.matchMedia(MOBILE_QUERY).matches) {
            return;
        }

        var old = document.getElementById(STYLE_ID);

        if (old) {
            old.textContent = css();
            return;
        }

        var style = document.createElement("style");
        style.id = STYLE_ID;
        style.type = "text/css";
        style.textContent = css();

        document.head.appendChild(style);
    }

    function start() {
        install();

        var observer = new MutationObserver(function () {
            var runtime = document.getElementById("fkDesignRuntimeStyle");

            if (runtime) {
                /*
                 * Move our style to the end of <head> so it wins over
                 * design-runtime's !important mobile declarations.
                 */
                var ours = document.getElementById(STYLE_ID);

                if (ours && ours.parentNode === document.head) {
                    document.head.appendChild(ours);
                } else {
                    install();
                }
            }
        });

        observer.observe(document.head, {
            childList: true,
            subtree: true
        });

        var mq = window.matchMedia(MOBILE_QUERY);

        if (mq.addEventListener) {
            mq.addEventListener("change", function () {
                if (mq.matches) {
                    install();
                } else {
                    var style = document.getElementById(STYLE_ID);
                    if (style) {
                        style.remove();
                    }
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
