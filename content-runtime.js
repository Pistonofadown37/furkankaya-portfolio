/* =========================================
   FURKAN KAYA PORTFOLIO
   PUBLIC SITE CONTENT RUNTIME
========================================= */

(function () {
    "use strict";

    const defaults = {
        page_title: "Furkan Kaya | Grafik Tasarım",
        meta_description: "Furkan Kaya - Grafik Tasarım ve Dijital Çözümler Portföyü",
        logo_first: "FURKAN",
        logo_second: "KAYA.",
        nav_home: "Ana Sayfa",
        nav_portfolio: "Portföy",
        nav_about: "Hakkımda",
        nav_contact: "İletişim",
        header_contact: "İletişime Geç",
        hero_small: "GRAFİK TASARIM & DİJİTAL ÇÖZÜMLER",
        hero_title_1: "Fikirleri",
        hero_title_highlight: "etkileyici",
        hero_title_2: "tasarımlara",
        hero_title_strong: "dönüştürüyorum.",
        hero_description: "Markalar, işletmeler ve projeler için modern, dikkat çekici ve özgün görsel çözümler üretiyorum.",
        hero_button_1: "Çalışmalarımı İncele",
        hero_button_2: "Benimle İletişime Geç",
        brand_letter_1: "F",
        brand_letter_2: "K",
        brand_name: "REKLAM",
        brand_item_1: "DESIGN",
        brand_item_2: "BRANDING",
        brand_item_3: "GRAPHIC",
        brand_item_4: "CREATIVE",
        brand_item_5: "DIGITAL",
        brand_item_6: "ADVERTISING",
        scroll_down_symbol: "↓",
        portfolio_small: "PORTFÖY",
        portfolio_title: "Seçili Çalışmalar",
        portfolio_description: "Farklı sektörler ve markalar için hazırladığım tasarım çalışmalarından bazıları.",
        portfolio_loading: "Çalışmalar yükleniyor...",
        about_small: "HAKKIMDA",
        about_title_1: "Tasarım sadece",
        about_title_2: "güzel görünmek değildir.",
        about_text: "Her projenin kendine ait bir hikayesi olduğuna inanıyorum. Bu nedenle tasarım sürecinde sadece estetik değil, markanın karakterini, hedef kitlesini ve vermek istediği mesajı da ön planda tutuyorum.",
        stat_1_number: "01",
        stat_1_title: "Özgün Tasarım",
        stat_1_text: "Her projeye özel yaratıcı çözümler sunuyorum.",
        stat_2_number: "02",
        stat_2_title: "Modern Yaklaşım",
        stat_2_text: "Güncel trendleri takip ederek modern tasarımlar üretiyorum.",
        stat_3_number: "03",
        stat_3_title: "Dijital Çözümler",
        stat_3_text: "Dijital platformlar için etkili tasarımlar hazırlıyorum.",
        services_small: "NELER YAPIYORUM?",
        services_title: "Tasarım Hizmetleri",
        service_1_title: "Grafik Tasarım",
        service_1_text: "Sosyal medya, reklam, broşür, afiş ve kurumsal tasarım çözümleri.",
        service_2_title: "Marka Tasarımı",
        service_2_text: "Logo, kurumsal kimlik ve markanızın görsel dünyasının oluşturulması.",
        service_3_title: "Dijital Tasarım",
        service_3_text: "Dijital platformlar için modern ve dikkat çekici tasarım çözümleri.",
        contact_small: "BİRLİKTE ÇALIŞALIM",
        contact_title: "Yeni bir proje mi düşünüyorsunuz?",
        contact_text: "Projeniz, markanız veya tasarım ihtiyacınız hakkında benimle iletişime geçebilirsiniz.",
        contact_email_label: "E-POSTA",
        contact_whatsapp_label: "WHATSAPP",
        contact_instagram_label: "INSTAGRAM",
        footer_text: "Furkan Kaya. Tüm hakları saklıdır."
    };

    const map = {
        ".hero-small-text": "hero_small",
        ".hero-description": "hero_description",
        ".portfolio-section .section-small-title": "portfolio_small",
        ".portfolio-section .section-heading h2": "portfolio_title",
        ".portfolio-section .section-heading p": "portfolio_description",
        ".portfolio-loading": "portfolio_loading",
        ".about-heading .section-small-title": "about_small",
        "#aboutText": "about_text",
        ".services-heading .section-small-title": "services_small",
        ".services-heading h2": "services_title",
        ".contact-small-title": "contact_small",
        ".contact-content h2": "contact_title",
        ".contact-content p": "contact_text",
        ".contact-link-label:nth-of-type(1)": "contact_email_label",
        ".site-footer p": "footer_text"
    };

    function setText(selector, value) {
        document.querySelectorAll(selector).forEach(function (element) {
            element.textContent = value;
        });
    }

    function applyContent(settings) {
        const data = Object.assign({}, defaults, settings || {});

        if (data.page_title) {
            document.title = data.page_title;
        }

        const meta = document.querySelector('meta[name="description"]');
        if (meta && data.meta_description) {
            meta.setAttribute("content", data.meta_description);
        }

        document.querySelectorAll(".site-logo strong").forEach(function (el) {
            el.textContent = data.logo_first;
        });
        document.querySelectorAll(".site-logo span").forEach(function (el) {
            el.textContent = data.logo_second;
        });

        const navValues = [data.nav_home, data.nav_portfolio, data.nav_about, data.nav_contact];
        document.querySelectorAll(".nav-link").forEach(function (el, i) {
            if (navValues[i]) el.textContent = navValues[i];
        });
        document.querySelectorAll(".mobile-nav-link").forEach(function (el, i) {
            if (navValues[i]) el.textContent = navValues[i];
        });

        setText(".header-contact-button", data.header_contact);
        setText(".hero-small-text", data.hero_small);

        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle) {
            heroTitle.childNodes.forEach(function (node) {
                if (node.nodeType === 3) node.textContent = " ";
            });
            const spans = heroTitle.querySelectorAll("span, strong");
            if (spans[0]) spans[0].textContent = data.hero_title_highlight;
            if (spans[1]) spans[1].textContent = data.hero_title_strong;
            const firstText = Array.from(heroTitle.childNodes).find(function (n) {
                return n.nodeType === 3;
            });
            if (firstText) firstText.textContent = "\n                        " + data.hero_title_1 + "\n                        ";
            const strong = heroTitle.querySelector("strong");
            if (strong) {
                const beforeStrong = strong.previousSibling;
                if (beforeStrong && beforeStrong.nodeType === 3) {
                    beforeStrong.textContent = "\n                        " + data.hero_title_2 + "\n                        ";
                }
            }
        }

        setText(".hero-description", data.hero_description);
        setText(".primary-button span", data.hero_button_1);
        setText(".secondary-button span", data.hero_button_2);
        setText(".brand-f", data.brand_letter_1);
        setText(".brand-k", data.brand_letter_2);
        setText(".hero-brand-name", data.brand_name);

        const brandItems = [1,2,3,4,5,6].map(function (n) { return data["brand_item_" + n]; });
        document.querySelectorAll(".brands-container span").forEach(function (el, i) {
            if (brandItems[i]) el.textContent = brandItems[i];
        });
        setText(".scroll-down", data.scroll_down_symbol);

        setText(".about-heading h2", data.about_title_1 + "\n" + data.about_title_2);
        const aboutHeading = document.querySelector(".about-heading h2");
        if (aboutHeading) {
            aboutHeading.innerHTML = escapeHtml(data.about_title_1) + "<br>" + escapeHtml(data.about_title_2);
        }

        const stats = [1,2,3];
        stats.forEach(function (n) {
            const stat = document.querySelectorAll(".about-stat")[n - 1];
            if (!stat) return;
            const strong = stat.querySelector("strong");
            const title = stat.querySelector("h3");
            const text = stat.querySelector("p");
            if (strong) strong.textContent = data["stat_" + n + "_number"];
            if (title) title.textContent = data["stat_" + n + "_title"];
            if (text) text.textContent = data["stat_" + n + "_text"];
        });

        document.querySelectorAll(".service-card").forEach(function (card, i) {
            const n = i + 1;
            const title = card.querySelector("h3");
            const text = card.querySelector("p");
            if (title) title.textContent = data["service_" + n + "_title"];
            if (text) text.textContent = data["service_" + n + "_text"];
        });

        const labels = document.querySelectorAll(".contact-link-label");
        if (labels[0]) labels[0].textContent = data.contact_email_label;
        if (labels[1]) labels[1].textContent = data.contact_whatsapp_label;
        if (labels[2]) labels[2].textContent = data.contact_instagram_label;

        const footer = document.querySelector(".site-footer p");
        if (footer) {
            const year = footer.querySelector("#currentYear");
            footer.textContent = "© ";
            if (year) {
                footer.appendChild(year);
            }
            footer.appendChild(document.createTextNode(" " + data.footer_text));
        }
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function load() {
        const client = window.supabaseClient;
        if (!client) return;

        try {
            const result = await client
                .from("site_settings")
                .select("setting_key, setting_value")
                .like("setting_key", "content_%");

            if (result.error) throw result.error;

            const settings = {};
            (result.data || []).forEach(function (item) {
                if (item.setting_key) {
                    settings[item.setting_key.replace(/^content_/, "")] = item.setting_value || "";
                }
            });

            applyContent(settings);
        } catch (error) {
            console.error("İçerik ayarları yüklenemedi:", error);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", load);
    } else {
        load();
    }
})();
