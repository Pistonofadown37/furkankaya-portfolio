/* =========================================
   FURKAN KAYA
   TÜM SİTE İÇERİKLERİ YÖNETİMİ
========================================= */

(function () {
    "use strict";

    const defaults = {
        page_title: "Furkan Kaya | Grafik Tasarım",
        meta_description: "Furkan Kaya - Grafik Tasarım ve Dijital Çözümler Portföyü",
        logo_first: "FURKAN", logo_second: "KAYA.",
        nav_home: "Ana Sayfa", nav_portfolio: "Portföy", nav_about: "Hakkımda", nav_contact: "İletişim", header_contact: "İletişime Geç",
        hero_small: "GRAFİK TASARIM & DİJİTAL ÇÖZÜMLER", hero_title_1: "Fikirleri", hero_title_highlight: "etkileyici", hero_title_2: "tasarımlara", hero_title_strong: "dönüştürüyorum.", hero_description: "Markalar, işletmeler ve projeler için modern, dikkat çekici ve özgün görsel çözümler üretiyorum.", hero_button_1: "Çalışmalarımı İncele", hero_button_2: "Benimle İletişime Geç", brand_letter_1: "F", brand_letter_2: "K", brand_name: "REKLAM",
        brand_item_1: "DESIGN", brand_item_2: "BRANDING", brand_item_3: "GRAPHIC", brand_item_4: "CREATIVE", brand_item_5: "DIGITAL", brand_item_6: "ADVERTISING", scroll_down_symbol: "↓",
        portfolio_small: "PORTFÖY", portfolio_title: "Seçili Çalışmalar", portfolio_description: "Farklı sektörler ve markalar için hazırladığım tasarım çalışmalarından bazıları.", portfolio_loading: "Çalışmalar yükleniyor...",
        about_small: "HAKKIMDA", about_title_1: "Tasarım sadece", about_title_2: "güzel görünmek değildir.", about_text: "Her projenin kendine ait bir hikayesi olduğuna inanıyorum. Bu nedenle tasarım sürecinde sadece estetik değil, markanın karakterini, hedef kitlesini ve vermek istediği mesajı da ön planda tutuyorum.",
        stat_1_number: "01", stat_1_title: "Özgün Tasarım", stat_1_text: "Her projeye özel yaratıcı çözümler sunuyorum.", stat_2_number: "02", stat_2_title: "Modern Yaklaşım", stat_2_text: "Güncel trendleri takip ederek modern tasarımlar üretiyorum.", stat_3_number: "03", stat_3_title: "Dijital Çözümler", stat_3_text: "Dijital platformlar için etkili tasarımlar hazırlıyorum.",
        services_small: "NELER YAPIYORUM?", services_title: "Tasarım Hizmetleri", service_1_title: "Grafik Tasarım", service_1_text: "Sosyal medya, reklam, broşür, afiş ve kurumsal tasarım çözümleri.", service_2_title: "Marka Tasarımı", service_2_text: "Logo, kurumsal kimlik ve markanızın görsel dünyasının oluşturulması.", service_3_title: "Dijital Tasarım", service_3_text: "Dijital platformlar için modern ve dikkat çekici tasarım çözümleri.",
        contact_small: "BİRLİKTE ÇALIŞALIM", contact_title: "Yeni bir proje mi düşünüyorsunuz?", contact_text: "Projeniz, markanız veya tasarım ihtiyacınız hakkında benimle iletişime geçebilirsiniz.", contact_email_label: "E-POSTA", contact_whatsapp_label: "WHATSAPP", contact_instagram_label: "INSTAGRAM", footer_text: "Furkan Kaya. Tüm hakları saklıdır."
    };

    const fields = Object.keys(defaults);

    function get(id) { const el = document.getElementById(id); return el ? el.value : ""; }
    function set(id, value) { const el = document.getElementById(id); if (el) el.value = value == null ? "" : value; }
    function message(text, type) {
        const box = document.getElementById("contentMessage");
        if (!box) return;
        box.textContent = text;
        box.className = "admin-message " + (type || "success");
        setTimeout(function () { box.textContent = ""; box.className = "admin-message"; }, 5000);
    }

    async function load() {
        fields.forEach(function (key) { set(key, defaults[key]); });
        const client = window.supabaseClient;
        if (!client) return;

        try {
            const result = await client.from("site_settings").select("setting_key, setting_value").like("setting_key", "content_%");
            if (result.error) throw result.error;
            (result.data || []).forEach(function (item) {
                if (!item.setting_key) return;
                const key = item.setting_key.replace(/^content_/, "");
                if (Object.prototype.hasOwnProperty.call(defaults, key)) set(key, item.setting_value || "");
            });
        } catch (error) {
            console.error(error);
            message("İçerikler yüklenemedi: " + error.message, "error");
        }
    }

    async function save(event) {
        event.preventDefault();
        const client = window.supabaseClient;
        const button = document.getElementById("saveContentButton");
        if (!client) { message("Supabase bağlantısı bulunamadı.", "error"); return; }

        const old = button ? button.textContent : "";
        if (button) { button.disabled = true; button.textContent = "Kaydediliyor..."; }

        try {
            const rows = fields.map(function (key) {
                return { setting_key: "content_" + key, setting_value: get(key), updated_at: new Date().toISOString() };
            });

            const result = await client.from("site_settings").upsert(rows, { onConflict: "setting_key" });
            if (result.error) throw result.error;

            message("✓ Tüm site içerikleri başarıyla kaydedildi.", "success");
            if (button) button.textContent = "✓ Kaydedildi";
        } catch (error) {
            console.error(error);
            message("İçerikler kaydedilemedi: " + error.message, "error");
            if (button) button.textContent = "Tekrar Dene";
        } finally {
            setTimeout(function () {
                if (button) { button.disabled = false; button.textContent = old || "Tüm İçerikleri Kaydet"; }
            }, 1800);
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        load();
        const form = document.getElementById("contentForm");
        if (form) form.addEventListener("submit", save);

        const logout = document.getElementById("logoutButton");
        if (logout) logout.addEventListener("click", async function () {
            const client = window.supabaseClient;
            if (client) await client.auth.signOut();
            window.location.replace("login.html");
        });
    });
})();
