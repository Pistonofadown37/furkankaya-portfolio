/* =========================================
   TASARIM EDITORU JS
========================================= */

(function () {
    "use strict";

    const client =
        window.supabaseClient;

    const DEFAULTS =
        {
    "color_gold": "#f2ad16",
    "color_gold_light": "#ffd35a",
    "color_gold_dark": "#9a6307",
    "color_black": "#030405",
    "color_dark": "#07090b",
    "color_dark_card": "#0d1013",
    "color_dark_card_2": "#12161a",
    "color_white": "#f4f4f4",
    "color_text": "#e8e8e8",
    "color_muted": "#8b9198",
    "container_width": 1280,
    "side_padding": 40,
    "header_height": 82,
    "logo_font_size": 21,
    "logo_gap": 7,
    "nav_gap": 40,
    "nav_font_size": 14,
    "nav_padding_y": 30,
    "header_button_width": 132,
    "header_button_height": 48,
    "header_button_radius": 6,
    "header_button_font_size": 13,
    "hero_gap": 80,
    "hero_content_max_width": 700,
    "hero_content_padding_top": 70,
    "hero_content_padding_bottom": 110,
    "hero_small_font_size": 11,
    "hero_small_letter_spacing": 6,
    "hero_title_font_size": 100,
    "hero_title_line_height": 0.98,
    "hero_title_letter_spacing": -5,
    "hero_description_font_size": 17,
    "hero_description_max_width": 560,
    "hero_description_line_height": 1.8,
    "hero_buttons_gap": 16,
    "hero_button_height": 58,
    "hero_button_padding": 25,
    "hero_button_gap": 25,
    "hero_button_radius": 6,
    "hero_button_font_size": 13,
    "brand_letter_1": "F",
    "brand_letter_2": "K",
    "brand_name": "REKLAM",
    "brand_font_size": 330,
    "brand_gap": 10,
    "brand_letter_spacing": -30,
    "brand_name_font_size": 70,
    "brand_name_letter_spacing": 18,
    "brand_name_margin_top": 30,
    "brand_line_width": 70,
    "brand_line_height": 2,
    "brand_line_margin_top": 38,
    "brand_glow_size": 480,
    "brand_glow_blur": 15,
    "hero_gold_glow_size": 500,
    "section_padding": 115,
    "section_heading_gap": 60,
    "section_heading_margin_bottom": 55,
    "section_title_font_size": 64,
    "section_title_letter_spacing": -2,
    "portfolio_columns": 4,
    "portfolio_columns_tablet": 2,
    "portfolio_gap": 20,
    "portfolio_radius": 10,
    "portfolio_image_height": 245,
    "portfolio_info_padding": 20,
    "slider_arrow_size": 48,
    "about_gap": 100,
    "about_text_font_size": 16,
    "about_text_line_height": 1.9,
    "services_gap": 20,
    "service_card_padding": 35,
    "service_card_radius": 12,
    "service_icon_size": 70,
    "service_card_min_height": 200,
    "service_card_gap": 25,
    "service_columns": 3,
    "contact_padding": 60,
    "contact_gap": 60,
    "contact_radius": 14,
    "contact_link_height": 140,
    "contact_link_padding": 28,
    "contact_section_padding": 120,
    "contact_title_font_size": 58,
    "contact_text_font_size": 14,
    "footer_padding": 32,
    "brands_height": 100,
    "brands_gap": 30,
    "brands_font_size": 16,
    "brands_letter_spacing": 2,
    "mobile_hero_gap": 0,
    "mobile_header_height": 82,
    "mobile_side_padding": 20,
    "mobile_hero_title_size": 52,
    "mobile_hero_title_size_small": 52,
    "mobile_hero_description_size": 14,
    "mobile_hero_description_size_small": 14,
    "mobile_hero_visual_height": 330,
    "mobile_hero_padding_top": 100,
    "mobile_hero_padding_bottom": 20,
    "mobile_brand_size": 180,
    "mobile_brand_spacing": -18,
    "mobile_brand_name_size": 35,
    "mobile_brand_name_spacing": 9,
    "mobile_section_padding": 80,
    "mobile_portfolio_image_height": 300,
    "mobile_portfolio_image_height_small": 240,
    "mobile_contact_padding": 25,
    "mobile_button_height": 58,
    "mobile_button_gap": 16
};

    let settings = {
        ...DEFAULTS
    };

    const iframe =
        document.getElementById(
            "sitePreview"
        );

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

    async function initialize() {
        if (!client) {
            showMessage(
                "Supabase bağlantısı bulunamadı.",
                "error"
            );
            return;
        }

        const sessionResult =
            await client.auth.getSession();

        if (
            sessionResult.error ||
            !sessionResult.data ||
            !sessionResult.data.session
        ) {
            window.location.href =
                "login.html";
            return;
        }

        initializeTabs();
        initializeControls();
        initializePreviewSizes();
        initializeLogout();

        await loadDesignSettings();

        if (iframe) {
            iframe.addEventListener(
                "load",
                sendPreview
            );
        }

        sendPreview();
    }


    function initializeTabs() {
        const tabs =
            document.querySelectorAll(
                ".design-tab"
            );

        const panels =
            document.querySelectorAll(
                ".design-panel"
            );

        tabs.forEach(function (tab) {
            tab.addEventListener(
                "click",
                function () {
                    const target =
                        tab.dataset.panel;

                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    panels.forEach(
                        panel =>
                            panel.classList.remove(
                                "active"
                            )
                    );

                    tab.classList.add(
                        "active"
                    );

                    const panel =
                        document.querySelector(
                            '[data-panel-content="' +
                            target +
                            '"]'
                        );

                    if (panel) {
                        panel.classList.add(
                            "active"
                        );
                    }
                }
            );
        });
    }


    function initializeControls() {
        document
            .querySelectorAll(
                "[data-key]"
            )
            .forEach(function (input) {
                const key =
                    input.dataset.key;

                input.addEventListener(
                    "input",
                    function () {
                        settings[key] =
                            input.type === "range"
                                ? Number(input.value)
                                : input.value;

                        updateOutput(
                            input
                        );

                        sendPreview();
                    }
                );
            });
    }


    function updateOutput(input) {
        const key =
            input.dataset.key;

        const output =
            document.querySelector(
                '[data-output="' +
                key +
                '"]'
            );

        if (!output) {
            return;
        }

        let value =
            input.value;

        if (
            input.type === "range"
        ) {
            value =
                Number(value);
        }

        output.textContent =
            formatValue(
                key,
                value
            );
    }


    function formatValue(
        key,
        value
    ) {
        if (
            key.includes("line_height")
        ) {
            return Number(value).toFixed(2);
        }

        if (
            key.includes("width") ||
            key.includes("height") ||
            key.includes("size") ||
            key.includes("padding") ||
            key.includes("gap") ||
            key.includes("radius") ||
            key.includes("spacing") ||
            key.includes("margin") ||
            key.includes("font")
        ) {
            return value + " px";
        }

        if (
            key.includes("letter_spacing")
        ) {
            return value + " px";
        }

        if (
            key === "brand_line_width"
        ) {
            return value + " %";
        }

        return value;
    }


    async function loadDesignSettings() {
        try {
            const result =
                await client
                    .from("site_settings")
                    .select(
                        "setting_key, setting_value"
                    );

            if (result.error) {
                throw result.error;
            }

            const loaded = {};

            (result.data || []).forEach(
                function (row) {
                    if (
                        row.setting_key &&
                        row.setting_key.startsWith(
                            "design_"
                        )
                    ) {
                        loaded[
                            row.setting_key.replace(
                                "design_",
                                ""
                            )
                        ] =
                            parseValue(
                                row.setting_value
                            );
                    }
                }
            );

            settings = {
                ...DEFAULTS,
                ...loaded
            };

            populateControls();

        } catch (error) {
            console.error(
                "Tasarım ayarları yüklenemedi:",
                error
            );

            showMessage(
                "Tasarım ayarları yüklenemedi: " +
                (
                    error.message ||
                    "Bilinmeyen hata"
                ),
                "error"
            );
        }
    }


    function populateControls() {
        document
            .querySelectorAll(
                "[data-key]"
            )
            .forEach(function (input) {
                const key =
                    input.dataset.key;

                if (
                    settings[key] === undefined
                ) {
                    return;
                }

                input.value =
                    settings[key];

                updateOutput(
                    input
                );
            });
    }


    function parseValue(value) {
        if (
            typeof value !== "string"
        ) {
            return value;
        }

        const trimmed =
            value.trim();

        if (
            /^-?\\d+(\\.\\d+)?$/.test(
                trimmed
            )
        ) {
            return Number(
                trimmed
            );
        }

        return value;
    }


    async function saveDesignSettings() {
        const saveButton =
            document.getElementById(
                "saveButton"
            );

        const original =
            saveButton.textContent;

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Kaydediliyor...";

        try {
            const rows =
                Object.entries(
                    settings
                ).map(
                    function ([
                        key,
                        value
                    ]) {
                        return {
                            setting_key:
                                "design_" +
                                key,

                            setting_value:
                                String(value)
                        };
                    }
                );

            const result =
                await client
                    .from("site_settings")
                    .upsert(
                        rows,
                        {
                            onConflict:
                                "setting_key"
                        }
                    )
                    .select(
                        "setting_key, setting_value"
                    );

            if (result.error) {
                throw result.error;
            }

            showMessage(
                "Tasarım ayarları başarıyla kaydedildi.",
                "success"
            );

        } catch (error) {
            console.error(
                "Tasarım kaydetme hatası:",
                error
            );

            showMessage(
                "Kaydetme hatası: " +
                (
                    error.message ||
                    error.code ||
                    "Bilinmeyen hata"
                ),
                "error"
            );

        } finally {
            saveButton.disabled =
                false;

            saveButton.textContent =
                original;
        }
    }


    async function resetDesign() {
        settings = {
            ...DEFAULTS
        };

        populateControls();
        sendPreview();

        showMessage(
            "Varsayılan tasarım önizlemeye uygulandı. Kalıcı hale getirmek için Kaydet'e bas.",
            "success"
        );
    }


    function sendPreview() {
        if (
            !iframe ||
            !iframe.contentWindow
        ) {
            return;
        }

        iframe.contentWindow.postMessage(
            {
                type:
                    "fk-design-preview",

                settings:
                    settings
            },
            "*"
        );
    }


    function initializePreviewSizes() {
        document
            .querySelectorAll(
                ".preview-size"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        document
                            .querySelectorAll(
                                ".preview-size"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );

                        button.classList.add(
                            "active"
                        );

                        if (iframe) {
                            iframe.style.width =
                                button.dataset.width;
                        }
                    }
                );
            });
    }


    function initializeLogout() {
        const button =
            document.getElementById(
                "logoutButton"
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            async function () {
                button.disabled =
                    true;

                try {
                    await client.auth.signOut();
                    window.location.href =
                        "login.html";
                } catch (error) {
                    console.error(error);
                    button.disabled =
                        false;
                }
            }
        );
    }


    function showMessage(
        message,
        type
    ) {
        const element =
            document.getElementById(
                "designMessage"
            );

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.className =
            "design-message " +
            type +
            " show";

        clearTimeout(
            showMessage.timer
        );

        showMessage.timer =
            setTimeout(
                function () {
                    element.classList.remove(
                        "show"
                    );
                },
                5000
            );
    }


    document
        .getElementById("saveButton")
        .addEventListener(
            "click",
            saveDesignSettings
        );

    document
        .getElementById("resetButton")
        .addEventListener(
            "click",
            resetDesign
        );
})();
