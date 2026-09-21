/* FURKAN KAYA - MOBILE DESIGN CONTROLLER
   Mobile settings are authoritative on screens <= 800px.
   This file only controls responsive/mobile presentation.
*/
(function () {
    "use strict";

    var STYLE_ID = "fkMobileSettingsStyle";
    var MOBILE_QUERY = "(max-width:800px)";

    var defaults = {
        mobile_header_height: 72,
        mobile_side_padding: 18,
        mobile_logo_font_size: 17,
        mobile_logo_gap: 4,

        mobile_hero_title_size: 52,
        mobile_hero_title_size_small: 46,
        mobile_hero_description_size: 14,
        mobile_hero_description_size_small: 14,
        mobile_hero_visual_height: 260,
        mobile_hero_padding_top: 64,
        mobile_hero_padding_bottom: 18,

        mobile_brand_size: 150,
        mobile_brand_spacing: -14,
        mobile_brand_name_size: 30,
        mobile_brand_name_spacing: 6,

        mobile_section_padding: 64,
        mobile_section_title_size: 34,
        mobile_section_title_size_small: 30,

        mobile_portfolio_columns: 1,
        mobile_portfolio_gap: 16,
        mobile_portfolio_image_height: 260,
        mobile_portfolio_image_height_small: 220,

        mobile_service_columns: 1,
        mobile_service_gap: 16,
        mobile_service_card_padding: 22,
        mobile_service_card_gap: 16,
        mobile_service_card_min_height: 0,
        mobile_service_icon_size: 50,

        mobile_contact_padding: 22,
        mobile_contact_gap: 24,
        mobile_contact_link_height: 82,

        mobile_button_height: 56,
        mobile_button_gap: 12
    };

    var settings = Object.assign({}, defaults);

    function num(value, fallback) {
        var n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function px(value) {
        return num(value, 0) + "px";
    }

    function mobile() {
        return window.matchMedia(MOBILE_QUERY).matches;
    }

    function setImportant(selector, property, value) {
        document.querySelectorAll(selector).forEach(function (el) {
            el.style.setProperty(property, value, "important");
        });
    }

    function installStyle() {
        var style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        var s = settings;

        var portfolioColumns = Math.max(
            1,
            Math.round(num(s.mobile_portfolio_columns, 1))
        );

        var serviceColumns = Math.max(
            1,
            Math.round(num(s.mobile_service_columns, 1))
        );

        style.textContent = `
@media (max-width: 800px) {

    html,
    body {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden !important;
    }

    .site-header {
        height: ${px(s.mobile_header_height)} !important;
    }

    .header-container,
    .section-container,
    .hero-container,
    .footer-container {
        width: calc(100% - ${px(s.mobile_side_padding * 2)}) !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .site-logo {
        width: auto !important;
        max-width: calc(100% - 58px) !important;
        min-width: 0 !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        font-size: ${px(s.mobile_logo_font_size)} !important;
        gap: ${px(s.mobile_logo_gap)} !important;
        letter-spacing: 1.5px !important;
    }

    .mobile-menu {
        top: ${px(s.mobile_header_height)} !important;
        max-height: calc(100dvh - ${px(s.mobile_header_height)}) !important;
    }

    .hero-section {
        width: 100% !important;
        min-height: auto !important;
        overflow: hidden !important;
    }

    .hero-container {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 0 !important;
    }

    .hero-content,
    .hero-visual {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
    }

    .hero-content {
        padding-top: ${px(s.mobile_hero_padding_top)} !important;
        padding-bottom: ${px(s.mobile_hero_padding_bottom)} !important;
        text-align: center !important;
    }

    .hero-small-text {
        width: 100% !important;
        max-width: 100% !important;
        white-space: normal !important;
        overflow-wrap: normal !important;
        word-break: normal !important;
    }

    .hero-title {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        font-size: ${px(s.mobile_hero_title_size)} !important;
        line-height: .98 !important;
        letter-spacing: -2.5px !important;
        overflow-wrap: normal !important;
        word-break: normal !important;
    }

    .hero-description {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: auto !important;
        margin-right: auto !important;
        font-size: ${px(s.mobile_hero_description_size)} !important;
        line-height: 1.65 !important;
        overflow-wrap: normal !important;
        word-break: normal !important;
    }

    .hero-buttons {
        width: 100% !important;
        max-width: 100% !important;
        flex-direction: column !important;
        align-items: stretch !important;
        gap: ${px(s.mobile_button_gap)} !important;
    }

    .primary-button,
    .secondary-button {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: ${px(s.mobile_button_height)} !important;
        min-height: ${px(s.mobile_button_height)} !important;
        box-sizing: border-box !important;
    }

    .hero-visual {
        height: ${px(s.mobile_hero_visual_height)} !important;
        min-height: ${px(s.mobile_hero_visual_height)} !important;
        max-height: ${px(s.mobile_hero_visual_height)} !important;
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
        font-size: ${px(s.mobile_brand_size)} !important;
        letter-spacing: ${px(s.mobile_brand_spacing)} !important;
        line-height: .75 !important;
        overflow: visible !important;
    }

    .hero-brand-name {
        max-width: 100% !important;
        font-size: ${px(s.mobile_brand_name_size)} !important;
        letter-spacing: ${px(s.mobile_brand_name_spacing)} !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: clip !important;
    }

    .brand-line {
        max-width: 80% !important;
    }

    .scroll-down {
        display: none !important;
    }

    /*
       Mobile brand strip:
       The old fixed 100px height clipped DIGITAL / ADVERTISING.
       It is now content-driven and can safely use two rows.
    */
    .hero-brands {
        height: auto !important;
        min-height: 0 !important;
        padding: 14px 0 18px !important;
        overflow: visible !important;
    }

    .brands-container {
        width: calc(100% - ${px(s.mobile_side_padding * 2)}) !important;
        height: auto !important;
        min-height: 0 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px 20px !important;
        padding: 0 !important;
        overflow: visible !important;
    }

    .brands-container span {
        flex: 0 0 auto !important;
        white-space: nowrap !important;
        font-size: 14px !important;
        letter-spacing: 1.2px !important;
        line-height: 1.2 !important;
    }

    .portfolio-section,
    .about-section,
    .services-section {
        padding-top: ${px(s.mobile_section_padding)} !important;
        padding-bottom: ${px(s.mobile_section_padding)} !important;
    }

    .section-heading {
        display: block !important;
        width: 100% !important;
        margin-bottom: 35px !important;
        gap: 0 !important;
    }

    .section-heading h2,
    .about-heading h2,
    .services-heading h2 {
        width: 100% !important;
        max-width: 100% !important;
        font-size: ${px(s.mobile_section_title_size)} !important;
        line-height: 1.05 !important;
        overflow-wrap: normal !important;
        word-break: normal !important;
    }

    .section-heading > p {
        width: 100% !important;
        max-width: 100% !important;
        margin-top: 18px !important;
    }

    /*
       Portfolio is always one real card per mobile page.
       No desktop/tablet column rule can squeeze it.
    */
    .portfolio-slider {
        display: grid !important;
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: repeat(${portfolioColumns}, minmax(0, 1fr)) !important;
        gap: ${px(s.mobile_portfolio_gap)} !important;
    }

    .portfolio-card {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
    }

    .portfolio-image {
        width: 100% !important;
        max-width: 100% !important;
        height: ${px(s.mobile_portfolio_image_height)} !important;
        overflow: hidden !important;
    }

    .portfolio-image img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        object-fit: cover !important;
    }

    .portfolio-info {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
        padding: 20px !important;
    }

    .portfolio-info h3,
    .portfolio-info p,
    .portfolio-category {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    .slider-arrow {
        z-index: 10 !important;
    }

    /*
       Services:
       force the icon to remain a true circle.
       flex-basis/min-width previously allowed it to stretch into an oval.
    */
    .services-grid {
        display: grid !important;
        width: 100% !important;
        max-width: 100% !important;
        grid-template-columns: repeat(${serviceColumns}, minmax(0, 1fr)) !important;
        gap: ${px(s.mobile_service_gap)} !important;
    }

    .service-card {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        min-height: ${px(s.mobile_service_card_min_height)} !important;
        height: auto !important;
        padding: ${px(s.mobile_service_card_padding)} !important;
        gap: ${px(s.mobile_service_card_gap)} !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
    }

    .service-icon {
        flex: 0 0 ${px(s.mobile_service_icon_size)} !important;
        width: ${px(s.mobile_service_icon_size)} !important;
        min-width: ${px(s.mobile_service_icon_size)} !important;
        max-width: ${px(s.mobile_service_icon_size)} !important;
        height: ${px(s.mobile_service_icon_size)} !important;
        min-height: ${px(s.mobile_service_icon_size)} !important;
        max-height: ${px(s.mobile_service_icon_size)} !important;
        aspect-ratio: 1 / 1 !important;
        border-radius: 50% !important;
        box-sizing: border-box !important;
    }

    .service-card > div:last-child {
        flex: 1 1 auto !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }

    .service-card h3,
    .service-card p {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    .contact-box {
        width: 100% !important;
        max-width: 100% !important;
        padding: ${px(s.mobile_contact_padding)} !important;
        gap: ${px(s.mobile_contact_gap)} !important;
        box-sizing: border-box !important;
    }

    .contact-link {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        min-height: ${px(s.mobile_contact_link_height)} !important;
        box-sizing: border-box !important;
    }

    .site-footer {
        width: 100% !important;
        overflow: hidden !important;
    }
}

@media (max-width: 500px) {

    .hero-title {
        font-size: ${px(s.mobile_hero_title_size_small)} !important;
    }

    .hero-description {
        font-size: ${px(s.mobile_hero_description_size_small)} !important;
    }

    .portfolio-image {
        height: ${px(s.mobile_portfolio_image_height_small)} !important;
    }

    .section-heading h2,
    .about-heading h2,
    .services-heading h2 {
        font-size: ${px(s.mobile_section_title_size_small)} !important;
    }

    .service-card {
        padding: ${px(Math.min(num(s.mobile_service_card_padding, 22), 18))} !important;
        gap: ${px(Math.min(num(s.mobile_service_card_gap, 16), 14))} !important;
    }

    .service-icon {
        flex-basis: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        width: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        min-width: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        max-width: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        height: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        min-height: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
        max-height: ${px(Math.min(num(s.mobile_service_icon_size, 50), 46))} !important;
    }

    .brands-container {
        gap: 10px 16px !important;
    }

    .brands-container span {
        font-size: 13px !important;
    }
}
`;
    }

    function applyInline() {
        if (!mobile()) return;

        var s = settings;
        var small = window.innerWidth <= 500;

        setImportant(".site-header", "height", px(s.mobile_header_height));
        setImportant(
            ".header-container,.section-container,.hero-container,.footer-container",
            "width",
            "calc(100% - " + px(s.mobile_side_padding * 2) + ")"
        );

        setImportant(".site-logo", "font-size", px(s.mobile_logo_font_size));
        setImportant(".site-logo", "gap", px(s.mobile_logo_gap));

        setImportant(".hero-content", "padding-top", px(s.mobile_hero_padding_top));
        setImportant(".hero-content", "padding-bottom", px(s.mobile_hero_padding_bottom));

        setImportant(
            ".hero-title",
            "font-size",
            px(small ? s.mobile_hero_title_size_small : s.mobile_hero_title_size)
        );

        setImportant(
            ".hero-description",
            "font-size",
            px(small ? s.mobile_hero_description_size_small : s.mobile_hero_description_size)
        );

        setImportant(".hero-buttons", "gap", px(s.mobile_button_gap));
        setImportant(
            ".primary-button,.secondary-button",
            "height",
            px(s.mobile_button_height)
        );

        setImportant(".hero-visual", "height", px(s.mobile_hero_visual_height));
        setImportant(".hero-visual", "min-height", px(s.mobile_hero_visual_height));
        setImportant(".hero-visual", "max-height", px(s.mobile_hero_visual_height));

        setImportant(".hero-brand-main", "font-size", px(s.mobile_brand_size));
        setImportant(".hero-brand-main", "letter-spacing", px(s.mobile_brand_spacing));

        setImportant(".hero-brand-name", "font-size", px(s.mobile_brand_name_size));
        setImportant(".hero-brand-name", "letter-spacing", px(s.mobile_brand_name_spacing));

        setImportant(
            ".portfolio-section,.about-section,.services-section",
            "padding-top",
            px(s.mobile_section_padding)
        );
        setImportant(
            ".portfolio-section,.about-section,.services-section",
            "padding-bottom",
            px(s.mobile_section_padding)
        );

        setImportant(
            ".section-heading h2,.about-heading h2,.services-heading h2",
            "font-size",
            px(small ? s.mobile_section_title_size_small : s.mobile_section_title_size)
        );

        setImportant(
            ".portfolio-slider",
            "grid-template-columns",
            "repeat(" + Math.max(1, Math.round(num(s.mobile_portfolio_columns, 1))) + ",minmax(0,1fr))"
        );

        setImportant(".portfolio-slider", "gap", px(s.mobile_portfolio_gap));
        setImportant(".portfolio-card", "width", "100%");
        setImportant(".portfolio-card", "max-width", "100%");

        setImportant(
            ".portfolio-image",
            "height",
            px(small ? s.mobile_portfolio_image_height_small : s.mobile_portfolio_image_height)
        );

        setImportant(
            ".services-grid",
            "grid-template-columns",
            "repeat(" + Math.max(1, Math.round(num(s.mobile_service_columns, 1))) + ",minmax(0,1fr))"
        );

        setImportant(".services-grid", "gap", px(s.mobile_service_gap));

        setImportant(".service-card", "min-height", px(s.mobile_service_card_min_height));
        setImportant(".service-card", "height", "auto");
        setImportant(".service-card", "padding", px(s.mobile_service_card_padding));
        setImportant(".service-card", "gap", px(s.mobile_service_card_gap));
        setImportant(".service-card", "display", "flex");
        setImportant(".service-card", "flex-direction", "row");

        var iconSize = small
            ? Math.min(num(s.mobile_service_icon_size, 50), 46)
            : num(s.mobile_service_icon_size, 50);

        setImportant(".service-icon", "flex", "0 0 " + px(iconSize));
        setImportant(".service-icon", "width", px(iconSize));
        setImportant(".service-icon", "min-width", px(iconSize));
        setImportant(".service-icon", "max-width", px(iconSize));
        setImportant(".service-icon", "height", px(iconSize));
        setImportant(".service-icon", "min-height", px(iconSize));
        setImportant(".service-icon", "max-height", px(iconSize));

        setImportant(".service-card > div:last-child", "flex", "1 1 auto");
        setImportant(".service-card > div:last-child", "min-width", "0");

        setImportant(".contact-box", "padding", px(s.mobile_contact_padding));
        setImportant(".contact-box", "gap", px(s.mobile_contact_gap));
        setImportant(".contact-link", "min-height", px(s.mobile_contact_link_height));
    }

    function keepLast() {
        var style = document.getElementById(STYLE_ID);

        if (style) {
            document.head.appendChild(style);
        }

        applyInline();
    }

    async function load() {
        var tries = 0;

        while (!window.supabaseClient && tries < 40) {
            await new Promise(function (resolve) {
                setTimeout(resolve, 200);
            });

            tries++;
        }

        try {
            if (window.supabaseClient) {
                var result = await window.supabaseClient
                    .from("site_settings")
                    .select("setting_key,setting_value")
                    .like("setting_key", "design_%");

                if (result.error) {
                    throw result.error;
                }

                (result.data || []).forEach(function (row) {
                    var key =
                        row.setting_key &&
                        row.setting_key.replace(/^design_/, "");

                    if (
                        key &&
                        Object.prototype.hasOwnProperty.call(settings, key)
                    ) {
                        settings[key] = num(
                            row.setting_value,
                            settings[key]
                        );
                    }
                });
            }
        } catch (error) {
            console.warn(
                "Mobil tasarım ayarları yüklenemedi:",
                error
            );
        }

        installStyle();
        keepLast();

        var count = 0;

        var timer = setInterval(function () {
            count++;

            if (!mobile() || count > 80) {
                clearInterval(timer);
                return;
            }

            keepLast();
        }, 250);
    }

    function start() {
        installStyle();
        applyInline();
        load();

        window.addEventListener("resize", function () {
            installStyle();
            applyInline();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
