/* FURKAN KAYA - MOBILE DESIGN VALUES
   Makes Yonetim Paneli > Tasarim > Mobil values authoritative on phones.
*/
(function () {
    "use strict";

    var STYLE_ID = "fkMobileSettingsStyle";
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

    function number(value, fallback) {
        var n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function px(value) {
        return number(value, 0) + "px";
    }

    function installStyle() {
        var style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        var s = settings;
        var portfolioColumns = Math.max(1, Math.round(number(s.mobile_portfolio_columns, 1)));
        var serviceColumns = Math.max(1, Math.round(number(s.mobile_service_columns, 1)));

        style.textContent = `
/* Mobile design values - generated from Design > Mobil */
@media (max-width: 800px) {
    .site-header {
        height: ${px(s.mobile_header_height)} !important;
    }

    .header-container,
    .section-container,
    .hero-container,
    .footer-container,
    .brands-container {
        width: calc(100% - ${px(s.mobile_side_padding * 2)}) !important;
        max-width: 100% !important;
    }

    .site-logo {
        font-size: ${px(s.mobile_logo_font_size)} !important;
        gap: ${px(s.mobile_logo_gap)} !important;
        max-width: calc(100% - 50px) !important;
    }

    .mobile-menu {
        top: ${px(s.mobile_header_height)} !important;
        max-height: calc(100dvh - ${px(s.mobile_header_height)}) !important;
    }

    .hero-content {
        padding-top: ${px(s.mobile_hero_padding_top)} !important;
        padding-bottom: ${px(s.mobile_hero_padding_bottom)} !important;
    }

    .hero-title {
        font-size: ${px(s.mobile_hero_title_size)} !important;
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
        word-break: normal !important;
        line-height: 0.98 !important;
    }

    .hero-description {
        font-size: ${px(s.mobile_hero_description_size)} !important;
        max-width: 100% !important;
        overflow-wrap: break-word !important;
    }

    .hero-buttons {
        gap: ${px(s.mobile_button_gap)} !important;
    }

    .primary-button,
    .secondary-button {
        height: ${px(s.mobile_button_height)} !important;
        min-height: ${px(s.mobile_button_height)} !important;
    }

    .hero-visual {
        min-height: ${px(s.mobile_hero_visual_height)} !important;
        height: ${px(s.mobile_hero_visual_height)} !important;
    }

    .hero-brand-main {
        font-size: ${px(s.mobile_brand_size)} !important;
        letter-spacing: ${px(s.mobile_brand_spacing)} !important;
    }

    .hero-brand-name {
        font-size: ${px(s.mobile_brand_name_size)} !important;
        letter-spacing: ${px(s.mobile_brand_name_spacing)} !important;
    }

    .portfolio-section,
    .about-section,
    .services-section {
        padding-top: ${px(s.mobile_section_padding)} !important;
        padding-bottom: ${px(s.mobile_section_padding)} !important;
    }

    .section-heading h2,
    .about-heading h2,
    .services-heading h2 {
        font-size: ${px(s.mobile_section_title_size)} !important;
        max-width: 100% !important;
    }

    .portfolio-slider {
        grid-template-columns: repeat(${portfolioColumns}, minmax(0, 1fr)) !important;
        gap: ${px(s.mobile_portfolio_gap)} !important;
    }

    .portfolio-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
    }

    .portfolio-image {
        height: ${px(s.mobile_portfolio_image_height)} !important;
        width: 100% !important;
    }

    .slider-arrow {
        z-index: 10 !important;
    }

    .services-grid {
        grid-template-columns: repeat(${serviceColumns}, minmax(0, 1fr)) !important;
        gap: ${px(s.mobile_service_gap)} !important;
    }

    .service-card {
        min-height: ${px(s.mobile_service_card_min_height)} !important;
        height: auto !important;
        padding: ${px(s.mobile_service_card_padding)} !important;
        gap: ${px(s.mobile_service_card_gap)} !important;
    }

    .service-icon {
        width: ${px(s.mobile_service_icon_size)} !important;
        height: ${px(s.mobile_service_icon_size)} !important;
    }

    .contact-box {
        padding: ${px(s.mobile_contact_padding)} !important;
        gap: ${px(s.mobile_contact_gap)} !important;
    }

    .contact-link {
        min-height: ${px(s.mobile_contact_link_height)} !important;
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
}
`;
    }

    async function loadSettings(attempt) {
        attempt = attempt || 0;

        var client = window.supabaseClient;
        if (!client) {
            if (attempt < 30) {
                setTimeout(function () {
                    loadSettings(attempt + 1);
                }, 250);
            } else {
                installStyle();
            }
            return;
        }

        try {
            var result = await client
                .from("site_settings")
                .select("setting_key,setting_value")
                .like("setting_key", "design_%");

            if (result.error) throw result.error;

            (result.data || []).forEach(function (row) {
                if (!row.setting_key) return;
                var key = row.setting_key.replace(/^design_/, "");
                if (Object.prototype.hasOwnProperty.call(settings, key)) {
                    settings[key] = number(row.setting_value, settings[key]);
                }
            });

            installStyle();

            // Runtime stilini geç: Mobil paneli nihai otorite olsun.
            if (document.head && document.getElementById(STYLE_ID)) {
                document.head.appendChild(document.getElementById(STYLE_ID));
            }

            // Supabase/runtime sonradan yeniden stil yazarsa tekrar öne al.
            setTimeout(function () {
                var style = document.getElementById(STYLE_ID);
                if (style && document.head) document.head.appendChild(style);
            }, 700);
        } catch (error) {
            console.warn("Mobil tasarım ayarları yüklenemedi:", error);
            installStyle();
            if (document.head && document.getElementById(STYLE_ID)) {
                document.head.appendChild(document.getElementById(STYLE_ID));
            }
        }
    }

    function start() {
        installStyle();
        loadSettings();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
