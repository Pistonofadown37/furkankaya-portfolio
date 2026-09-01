/* =========================================================
   FURKAN KAYA - MOBILE COMPLETE FIX
   ---------------------------------------------------------
   This file ONLY changes the mobile layout (<= 800px).
   Desktop styles/settings are restored automatically above
   800px, so the desktop version is not modified.
   ========================================================= */

(function () {
    "use strict";

    if (!document.querySelector(".site-header")) {
        return;
    }

    const mobileQuery = window.matchMedia("(max-width: 800px)");
    const original = new WeakMap();
    let runtimeReady = false;

    function remember(element, property) {
        if (!element) {
            return;
        }

        let map = original.get(element);

        if (!map) {
            map = new Map();
            original.set(element, map);
        }

        if (!map.has(property)) {
            map.set(property, {
                value: element.style.getPropertyValue(property),
                priority: element.style.getPropertyPriority(property)
            });
        }
    }

    function set(element, property, value) {
        if (!element) {
            return;
        }

        remember(element, property);
        element.style.setProperty(property, value, "important");
    }

    function setAll(selector, property, value) {
        document.querySelectorAll(selector).forEach(function (element) {
            set(element, property, value);
        });
    }

    function restoreAll() {
        document.querySelectorAll("*").forEach(function (element) {
            const map = original.get(element);

            if (!map) {
                return;
            }

            map.forEach(function (state, property) {
                if (state.value) {
                    element.style.setProperty(
                        property,
                        state.value,
                        state.priority
                    );
                } else {
                    element.style.removeProperty(property);
                }
            });
        });
    }

    function applyMobile() {
        if (!mobileQuery.matches) {
            restoreAll();
            return;
        }

        /* -----------------------------------------------------
           GLOBAL / WIDTH SAFETY
        ----------------------------------------------------- */

        set(document.documentElement, "width", "100%");
        set(document.documentElement, "max-width", "100%");
        set(document.documentElement, "overflow-x", "hidden");

        set(document.body, "width", "100%");
        set(document.body, "max-width", "100%");
        set(document.body, "overflow-x", "hidden");

        /* -----------------------------------------------------
           HEADER
        ----------------------------------------------------- */

        setAll(".site-header", "height", "72px");

        setAll(
            ".header-container",
            "width",
            "calc(100% - 36px)"
        );

        setAll(
            ".header-container",
            "max-width",
            "1280px"
        );

        setAll(
            ".site-logo",
            "font-size",
            "clamp(14px, 4.6vw, 18px)"
        );

        setAll(".site-logo", "gap", "5px");
        setAll(".site-logo", "letter-spacing", "1px");
        setAll(".site-logo", "max-width", "calc(100% - 58px)");
        setAll(".site-logo", "overflow", "hidden");
        setAll(".site-logo", "white-space", "nowrap");
        setAll(".site-logo", "text-overflow", "ellipsis");

        setAll(
            ".mobile-menu-button",
            "width",
            "44px"
        );

        setAll(
            ".mobile-menu-button",
            "height",
            "44px"
        );

        setAll(
            ".mobile-menu",
            "top",
            "72px"
        );

        setAll(
            ".mobile-menu",
            "max-height",
            "calc(100dvh - 72px)"
        );

        setAll(
            ".mobile-menu",
            "overflow-y",
            "auto"
        );

        setAll(
            ".mobile-menu",
            "padding",
            "8px 18px 18px"
        );

        setAll(
            ".mobile-nav-link",
            "padding",
            "15px 4px"
        );

        /* -----------------------------------------------------
           HERO - COMPLETE MOBILE LAYOUT
        ----------------------------------------------------- */

        setAll(".hero-section", "min-height", "auto");
        setAll(".hero-section", "overflow", "hidden");

        setAll(
            ".hero-container",
            "width",
            "calc(100% - 36px)"
        );

        setAll(
            ".hero-container",
            "max-width",
            "1280px"
        );

        setAll(
            ".hero-container",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(".hero-container", "gap", "0");
        setAll(".hero-container", "min-height", "auto");

        setAll(".hero-content", "width", "100%");
        setAll(".hero-content", "max-width", "100%");
        setAll(
            ".hero-content",
            "padding",
            "64px 0 18px"
        );
        setAll(".hero-content", "text-align", "center");

        setAll(".hero-small-text", "width", "100%");
        setAll(".hero-small-text", "max-width", "100%");
        setAll(
            ".hero-small-text",
            "font-size",
            "clamp(8px, 2.4vw, 10px)"
        );
        setAll(
            ".hero-small-text",
            "letter-spacing",
            "min(2.5px, 0.55vw)"
        );
        setAll(".hero-small-text", "line-height", "1.6");
        setAll(".hero-small-text", "white-space", "normal");
        setAll(".hero-small-text", "overflow-wrap", "anywhere");

        /*
         * The title is intentionally capped by viewport width.
         * This prevents the long Turkish words from being clipped
         * while still allowing the design slider to work.
         */
        setAll(
            ".hero-title",
            "width",
            "calc(100% - 4px)"
        );

        setAll(
            ".hero-title",
            "max-width",
            "100%"
        );

        setAll(
            ".hero-title",
            "font-size",
            "clamp(31px, 9.6vw, 40px)"
        );

        setAll(
            ".hero-title",
            "line-height",
            "0.98"
        );

        setAll(
            ".hero-title",
            "letter-spacing",
            "-2.4px"
        );

        setAll(
            ".hero-title",
            "overflow-wrap",
            "break-word"
        );

        setAll(
            ".hero-title",
            "word-break",
            "normal"
        );

        setAll(
            ".hero-title",
            "text-wrap",
            "balance"
        );

        setAll(".hero-title span", "display", "block");
        setAll(".hero-title strong", "display", "block");

        setAll(".hero-description", "width", "100%");
        setAll(".hero-description", "max-width", "100%");
        setAll(
            ".hero-description",
            "font-size",
            "14px"
        );
        setAll(
            ".hero-description",
            "line-height",
            "1.65"
        );
        setAll(
            ".hero-description",
            "margin-left",
            "auto"
        );
        setAll(
            ".hero-description",
            "margin-right",
            "auto"
        );
        setAll(
            ".hero-description",
            "overflow-wrap",
            "break-word"
        );

        /* HERO BUTTONS */

        setAll(".hero-buttons", "width", "100%");
        setAll(".hero-buttons", "display", "flex");
        setAll(".hero-buttons", "flex-direction", "column");
        setAll(".hero-buttons", "align-items", "stretch");
        setAll(".hero-buttons", "gap", "12px");

        setAll(
            ".primary-button,.secondary-button",
            "width",
            "100%"
        );

        setAll(
            ".primary-button,.secondary-button",
            "max-width",
            "100%"
        );

        setAll(
            ".primary-button,.secondary-button",
            "min-width",
            "0"
        );

        setAll(
            ".primary-button,.secondary-button",
            "height",
            "54px"
        );

        setAll(
            ".primary-button,.secondary-button",
            "min-height",
            "54px"
        );

        setAll(
            ".primary-button,.secondary-button",
            "padding-left",
            "16px"
        );

        setAll(
            ".primary-button,.secondary-button",
            "padding-right",
            "16px"
        );

        setAll(
            ".primary-button,.secondary-button",
            "gap",
            "12px"
        );

        setAll(
            ".primary-button,.secondary-button",
            "font-size",
            "13px"
        );

        /* HERO VISUAL / BRAND */

        setAll(".hero-visual", "width", "100%");
        setAll(".hero-visual", "min-width", "0");
        setAll(".hero-visual", "min-height", "230px");
        setAll(".hero-visual", "height", "230px");

        setAll(
            ".hero-brand-main",
            "font-size",
            "min(150px, 34vw)"
        );

        setAll(
            ".hero-brand-main",
            "letter-spacing",
            "-14px"
        );

        setAll(
            ".hero-brand-main",
            "gap",
            "4px"
        );

        setAll(
            ".hero-brand-name",
            "font-size",
            "min(30px, 7vw)"
        );

        setAll(
            ".hero-brand-name",
            "letter-spacing",
            "3px"
        );

        setAll(
            ".hero-brand-name",
            "padding-left",
            "0"
        );

        setAll(
            ".brand-line",
            "width",
            "70%"
        );

        setAll(
            ".brand-glow,.hero-gold-glow",
            "max-width",
            "90vw"
        );

        setAll(
            ".brand-glow,.hero-gold-glow",
            "max-height",
            "90vw"
        );

        /* Hide the decorative scroll arrow on mobile.
           It can overlap the brand strip on short screens. */
        setAll(".scroll-down", "display", "none");

        /* HERO BRAND STRIP */

        setAll(".hero-brands", "position", "relative");
        setAll(".hero-brands", "left", "auto");
        setAll(".hero-brands", "bottom", "auto");
        setAll(".hero-brands", "height", "auto");
        setAll(".hero-brands", "min-height", "0");
        setAll(".hero-brands", "margin-top", "8px");
        setAll(".hero-brands", "padding", "14px 0 16px");

        setAll(".brands-container", "width", "calc(100% - 36px)");
        setAll(".brands-container", "height", "auto");
        setAll(".brands-container", "padding", "0");
        setAll(".brands-container", "display", "flex");
        setAll(".brands-container", "flex-wrap", "wrap");
        setAll(".brands-container", "justify-content", "center");
        setAll(".brands-container", "align-items", "center");
        setAll(".brands-container", "gap", "9px 14px");
        setAll(".brands-container", "overflow", "hidden");

        setAll(
            ".brands-container span",
            "font-size",
            "9px"
        );

        setAll(
            ".brands-container span",
            "letter-spacing",
            "1px"
        );

        setAll(
            ".brands-container span",
            "white-space",
            "normal"
        );

        setAll(
            ".brands-container span",
            "text-align",
            "center"
        );

        /* -----------------------------------------------------
           SECTION HEADINGS
        ----------------------------------------------------- */

        setAll(
            ".portfolio-section,.about-section,.services-section",
            "padding-top",
            "60px"
        );

        setAll(
            ".portfolio-section,.about-section,.services-section",
            "padding-bottom",
            "60px"
        );

        setAll(".section-heading", "display", "block");
        setAll(".section-heading", "margin-bottom", "32px");
        setAll(".section-heading", "text-align", "left");

        setAll(
            ".section-heading h2,.about-heading h2",
            "font-size",
            "clamp(30px, 8.5vw, 38px)"
        );

        setAll(
            ".section-heading h2,.about-heading h2",
            "line-height",
            "1.05"
        );

        setAll(
            ".section-heading h2,.about-heading h2",
            "letter-spacing",
            "-1.5px"
        );

        setAll(
            ".section-heading > p",
            "max-width",
            "100%"
        );

        setAll(
            ".section-heading > p",
            "margin-top",
            "14px"
        );

        setAll(
            ".section-heading > p",
            "font-size",
            "14px"
        );

        setAll(
            ".section-heading > p",
            "line-height",
            "1.65"
        );

        /* -----------------------------------------------------
           PORTFOLIO
        ----------------------------------------------------- */

        setAll(
            ".portfolio-slider",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(
            ".portfolio-slider",
            "gap",
            "16px"
        );

        setAll(
            ".portfolio-card",
            "width",
            "100%"
        );

        setAll(
            ".portfolio-image",
            "height",
            "220px"
        );

        setAll(
            ".portfolio-info",
            "padding",
            "16px"
        );

        setAll(
            ".portfolio-info h3",
            "font-size",
            "17px"
        );

        setAll(
            ".portfolio-info p",
            "font-size",
            "12px"
        );

        setAll(
            ".slider-arrow",
            "width",
            "40px"
        );

        setAll(
            ".slider-arrow",
            "height",
            "40px"
        );

        setAll(
            ".slider-arrow",
            "font-size",
            "17px"
        );

        setAll(
            ".slider-prev",
            "left",
            "6px"
        );

        setAll(
            ".slider-next",
            "right",
            "6px"
        );

        setAll(
            ".slider-arrow",
            "top",
            "110px"
        );

        setAll(
            ".portfolio-dots",
            "margin-top",
            "22px"
        );

        /* -----------------------------------------------------
           ABOUT
        ----------------------------------------------------- */

        setAll(
            ".about-grid",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(".about-grid", "gap", "28px");

        setAll(
            ".about-content",
            "padding-top",
            "0"
        );

        setAll(
            ".about-content p",
            "font-size",
            "14px"
        );

        setAll(
            ".about-content p",
            "line-height",
            "1.75"
        );

        setAll(
            ".about-stats",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(".about-stats", "gap", "20px");
        setAll(".about-stats", "margin-top", "48px");

        setAll(".about-stat", "min-height", "0");
        setAll(".about-stat", "padding", "0 0 22px");
        setAll(".about-stat", "gap", "16px");
        setAll(".about-stat", "border-right", "none");
        setAll(
            ".about-stat",
            "border-bottom",
            "1px solid var(--line)"
        );

        setAll(
            ".about-stat:last-child",
            "border-bottom",
            "none"
        );

        setAll(".stat-icon", "min-width", "52px");
        setAll(".stat-icon", "width", "52px");
        setAll(".stat-icon", "height", "52px");
        setAll(".stat-icon", "font-size", "19px");

        /* -----------------------------------------------------
           SERVICES
        ----------------------------------------------------- */

        setAll(
            ".services-grid",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(".services-grid", "gap", "16px");

        setAll(
            ".service-card",
            "min-height",
            "0"
        );

        setAll(
            ".service-card",
            "padding",
            "22px 18px"
        );

        setAll(
            ".service-card",
            "gap",
            "16px"
        );

        setAll(
            ".service-icon",
            "min-width",
            "56px"
        );

        setAll(
            ".service-icon",
            "width",
            "56px"
        );

        setAll(
            ".service-icon",
            "height",
            "56px"
        );

        setAll(
            ".service-icon",
            "font-size",
            "22px"
        );

        setAll(
            ".service-card h3",
            "font-size",
            "17px"
        );

        setAll(
            ".service-card p",
            "font-size",
            "13px"
        );

        /* -----------------------------------------------------
           CONTACT
        ----------------------------------------------------- */

        setAll(
            ".contact-section",
            "padding-top",
            "64px"
        );

        setAll(
            ".contact-section",
            "padding-bottom",
            "64px"
        );

        setAll(
            ".contact-box",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(
            ".contact-box",
            "gap",
            "24px"
        );

        setAll(
            ".contact-box",
            "padding",
            "24px 18px"
        );

        setAll(
            ".contact-content h2",
            "font-size",
            "clamp(30px, 8.5vw, 38px)"
        );

        setAll(
            ".contact-content h2",
            "line-height",
            "1.05"
        );

        setAll(
            ".contact-content p",
            "font-size",
            "14px"
        );

        setAll(
            ".contact-content p",
            "line-height",
            "1.7"
        );

        setAll(
            ".contact-links",
            "grid-template-columns",
            "minmax(0, 1fr)"
        );

        setAll(
            ".contact-link",
            "min-height",
            "86px"
        );

        setAll(
            ".contact-link",
            "padding",
            "16px 4px"
        );

        setAll(
            ".contact-link",
            "gap",
            "12px"
        );

        setAll(
            ".contact-link",
            "border-left",
            "none"
        );

        setAll(
            ".contact-link",
            "border-top",
            "1px solid var(--line)"
        );

        setAll(
            ".contact-link:first-child",
            "border-top",
            "none"
        );

        setAll(
            ".contact-icon",
            "min-width",
            "40px"
        );

        setAll(
            ".contact-icon",
            "width",
            "40px"
        );

        setAll(
            ".contact-icon",
            "height",
            "40px"
        );

        setAll(
            ".contact-icon",
            "font-size",
            "23px"
        );

        setAll(
            ".contact-link strong",
            "font-size",
            "12px"
        );

        setAll(
            ".contact-link strong",
            "max-width",
            "100%"
        );

        setAll(
            ".contact-link strong",
            "overflow-wrap",
            "anywhere"
        );

        /* -----------------------------------------------------
           LIGHTBOX
        ----------------------------------------------------- */

        setAll(
            ".lightbox",
            "padding",
            "16px"
        );

        setAll(
            ".lightbox-content",
            "width",
            "100%"
        );

        setAll(
            ".lightbox-content",
            "max-width",
            "100%"
        );

        setAll(
            ".lightbox-content",
            "max-height",
            "88vh"
        );

        setAll(
            ".lightbox-content img",
            "max-height",
            "62vh"
        );

        setAll(
            ".lightbox-close",
            "top",
            "14px"
        );

        setAll(
            ".lightbox-close",
            "right",
            "14px"
        );

        setAll(
            ".lightbox-close",
            "width",
            "44px"
        );

        setAll(
            ".lightbox-close",
            "height",
            "44px"
        );

        setAll(
            ".lightbox-close",
            "font-size",
            "26px"
        );

        /* -----------------------------------------------------
           FOOTER
        ----------------------------------------------------- */

        setAll(
            ".footer-container",
            "width",
            "calc(100% - 36px)"
        );

        setAll(
            ".footer-container",
            "flex-direction",
            "column"
        );

        setAll(
            ".footer-container",
            "align-items",
            "flex-start"
        );

        setAll(
            ".footer-container",
            "gap",
            "16px"
        );

        setAll(
            ".site-footer",
            "padding-top",
            "26px"
        );

        setAll(
            ".site-footer",
            "padding-bottom",
            "26px"
        );

        setAll(
            ".footer-top",
            "right",
            "18px"
        );
    }

    function waitForRuntime() {
        if (runtimeReady) {
            applyMobile();
            return;
        }

        const runtimeStyle =
            document.getElementById("fkDesignRuntimeStyle");

        if (runtimeStyle) {
            runtimeReady = true;
            applyMobile();
            return;
        }

        window.setTimeout(waitForRuntime, 50);
    }

    function handleViewportChange() {
        if (mobileQuery.matches) {
            applyMobile();
        } else {
            restoreAll();
        }
    }

    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener(
            "change",
            handleViewportChange
        );
    } else {
        mobileQuery.addListener(handleViewportChange);
    }

    window.addEventListener(
        "resize",
        function () {
            if (mobileQuery.matches) {
                applyMobile();
            }
        },
        { passive: true }
    );

    /*
     * The design runtime loads Supabase settings asynchronously.
     * Wait until its generated stylesheet exists so our mobile
     * values are applied AFTER the desktop !important values.
     */
    waitForRuntime();
})();
