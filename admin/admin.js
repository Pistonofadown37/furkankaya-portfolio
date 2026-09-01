/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL
========================================= */

(function () {
    "use strict";

    const PORTFOLIO_TABLE = "portfolios";
    const SETTINGS_TABLE = "site_settings";
    const PORTFOLIO_BUCKET = "portfolio-images";

    let currentEditingPortfolioId = null;
    let selectedPortfolioImage = null;
    let currentPortfolioImageUrl = "";

    document.addEventListener("DOMContentLoaded", initializeAdmin);

    async function initializeAdmin() {
        const client = window.supabaseClient;

        if (!client) {
            showMessage(
                "Supabase bağlantısı bulunamadı.",
                "error"
            );
            return;
        }

        try {
            const {
                data,
                error
            } = await client.auth.getSession();

            if (error || !data.session) {
                window.location.replace("login.html");
                return;
            }

            initializeNavigation();
            initializeLogout(client);

            initializePortfolioForm(client);
            initializePortfolioImageInput();
            initializePortfolioActions(client);

            initializeSettingsForm(client);
            initializeContactForm(client);

            await Promise.all([
                loadPortfolios(client),
                loadSettings(client)
            ]);

        } catch (error) {
            console.error(error);

            showMessage(
                "Yönetim paneli başlatılırken hata oluştu.",
                "error"
            );
        }
    }

    /* =========================================
       NAVIGATION
    ========================================= */

    function initializeNavigation() {
        const buttons =
            document.querySelectorAll(".admin-nav-button");

        const sections =
            document.querySelectorAll(".admin-section");

        buttons.forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    const targetId =
                        button.dataset.target;

                    const target =
                        document.getElementById(targetId);

                    if (!target) {
                        return;
                    }

                    buttons.forEach(function (item) {
                        item.classList.remove("active");
                    });

                    sections.forEach(function (section) {
                        section.classList.remove("active");
                    });

                    button.classList.add("active");
                    target.classList.add("active");
                }
            );
        });
    }

    /* =========================================
       LOGOUT
    ========================================= */

    function initializeLogout(client) {
        const button =
            document.getElementById("logoutButton");

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            async function () {
                button.disabled = true;

                try {
                    await client.auth.signOut();

                    window.location.replace(
                        "login.html"
                    );

                } catch (error) {
                    console.error(error);

                    button.disabled = false;

                    showMessage(
                        "Çıkış yapılırken hata oluştu.",
                        "error"
                    );
                }
            }
        );
    }

    /* =========================================
       PORTFOLIOS LOAD
    ========================================= */

    async function loadPortfolios(client) {
        const list =
            document.getElementById("portfolioList");

        const emptyState =
            document.getElementById(
                "portfolioEmptyState"
            );

        if (!list) {
            return;
        }

        list.innerHTML =
            "<div class=\"admin-loading\">Portföyler yükleniyor...</div>";

        try {
            let result =
                await client
                    .from(PORTFOLIO_TABLE)
                    .select("*")
                    .order(
                        "created_at",
                        { ascending: false }
                    );

            if (result.error) {
                result =
                    await client
                        .from(PORTFOLIO_TABLE)
                        .select("*");
            }

            if (result.error) {
                throw result.error;
            }

            const portfolios =
                Array.isArray(result.data)
                    ? result.data
                    : [];

            updatePortfolioStatistics(portfolios);

            list.innerHTML = "";

            if (!portfolios.length) {
                if (emptyState) {
                    emptyState.style.display = "block";
                }

                return;
            }

            if (emptyState) {
                emptyState.style.display = "none";
            }

            portfolios.forEach(function (portfolio) {
                list.appendChild(
                    createPortfolioItem(portfolio)
                );
            });

        } catch (error) {
            console.error(error);

            list.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "block";
                emptyState.textContent =
                    "Portföyler yüklenemedi.";
            }

            showMessage(
                error.message ||
                "Portföyler yüklenemedi.",
                "error"
            );
        }
    }

    function updatePortfolioStatistics(portfolios) {
        const total =
            document.getElementById("totalPortfolio");

        const active =
            document.getElementById("activePortfolio");

        if (total) {
            total.value = portfolios.length;
        }

        if (active) {
            const count =
                portfolios.filter(function (item) {
                    return (
                        !item.status ||
                        item.status === "active" ||
                        item.status === "aktif"
                    );
                }).length;

            active.value = count;
        }
    }

    function createPortfolioItem(portfolio) {
        const item =
            document.createElement("div");

        item.className =
            "portfolio-admin-item";

        const title =
            portfolio.title || "İsimsiz çalışma";

        const category =
            portfolio.category || "";

        const description =
            portfolio.description || "";

        const imageUrl =
            portfolio.image_url || "";

        item.innerHTML = `
            <div class="portfolio-admin-image">
                ${
                    imageUrl
                        ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(title)}">`
                        : `<div class="portfolio-admin-no-image">GÖRSEL YOK</div>`
                }
            </div>

            <div class="portfolio-admin-content">
                <h3>${escapeHtml(title)}</h3>

                ${
                    category
                        ? `<p class="portfolio-admin-category">${escapeHtml(category)}</p>`
                        : ""
                }

                ${
                    description
                        ? `<p class="portfolio-admin-description">${escapeHtml(description)}</p>`
                        : ""
                }
            </div>

            <div class="portfolio-admin-actions">
                <button
                    type="button"
                    class="admin-secondary-button edit-portfolio"
                    data-id="${escapeAttribute(portfolio.id)}"
                >
                    Düzenle
                </button>

                <button
                    type="button"
                    class="admin-danger-button delete-portfolio"
                    data-id="${escapeAttribute(portfolio.id)}"
                >
                    Sil
                </button>
            </div>
        `;

        return item;
    }

    /* =========================================
       PORTFOLIO FORM
    ========================================= */

    function initializePortfolioForm(client) {
        const newButton =
            document.getElementById(
                "newPortfolioButton"
            );

        const cancelButton =
            document.getElementById(
                "cancelPortfolioButton"
            );

        const form =
            document.getElementById("portfolioForm");

        if (newButton) {
            newButton.addEventListener(
                "click",
                openNewPortfolioForm
            );
        }

        if (cancelButton) {
            cancelButton.addEventListener(
                "click",
                closePortfolioForm
            );
        }

        if (form) {
            form.addEventListener(
                "submit",
                async function (event) {
                    event.preventDefault();

                    await savePortfolio(client);
                }
            );
        }
    }

    function openNewPortfolioForm() {
        currentEditingPortfolioId = null;
        currentPortfolioImageUrl = "";
        selectedPortfolioImage = null;

        const form =
            document.getElementById("portfolioForm");

        const card =
            document.getElementById(
                "portfolioFormCard"
            );

        const title =
            document.getElementById(
                "portfolioFormTitle"
            );

        if (form) {
            form.reset();
        }

        resetImagePreview();

        if (title) {
            title.textContent =
                "Yeni Portföy Çalışması";
        }

        if (card) {
            card.style.display = "block";

            card.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    function closePortfolioForm() {
        const card =
            document.getElementById(
                "portfolioFormCard"
            );

        const form =
            document.getElementById("portfolioForm");

        if (card) {
            card.style.display = "none";
        }

        if (form) {
            form.reset();
        }

        currentEditingPortfolioId = null;
        currentPortfolioImageUrl = "";
        selectedPortfolioImage = null;

        resetImagePreview();
    }

    /* =========================================
       IMAGE INPUT
    ========================================= */

    function initializePortfolioImageInput() {
        const input =
            document.getElementById(
                "portfolioImageInput"
            );

        if (!input) {
            return;
        }

        input.addEventListener(
            "change",
            function () {
                const file = input.files[0];

                if (!file) {
                    return;
                }

                if (
                    !file.type.startsWith("image/")
                ) {
                    showMessage(
                        "Lütfen geçerli bir görsel seçin.",
                        "error"
                    );

                    input.value = "";
                    return;
                }

                selectedPortfolioImage = file;

                const preview =
                    document.getElementById(
                        "portfolioImagePreview"
                    );

                const content =
                    document.getElementById(
                        "imageUploadContent"
                    );

                if (preview) {
                    preview.src =
                        URL.createObjectURL(file);

                    preview.classList.add("show");
                }

                if (content) {
                    content.style.display = "none";
                }
            }
        );
    }

    function resetImagePreview() {
        const preview =
            document.getElementById(
                "portfolioImagePreview"
            );

        const content =
            document.getElementById(
                "imageUploadContent"
            );

        const input =
            document.getElementById(
                "portfolioImageInput"
            );

        if (preview) {
            preview.src = "";
            preview.classList.remove("show");
        }

        if (content) {
            content.style.display = "";
        }

        if (input) {
            input.value = "";
        }
    }

    async function uploadPortfolioImage(
        client,
        file
    ) {
        if (!file) {
            return "";
        }

        const extension =
            file.name.includes(".")
                ? file.name.split(".").pop()
                : "jpg";

        const fileName =
            `portfolio/${Date.now()}-${Math.random()
                .toString(36)
                .substring(2)}.${extension}`;

        const {
            error
        } =
            await client
                .storage
                .from(PORTFOLIO_BUCKET)
                .upload(
                    fileName,
                    file,
                    {
                        upsert: false,
                        contentType: file.type
                    }
                );

        if (error) {
            throw error;
        }

        const {
            data
        } =
            client
                .storage
                .from(PORTFOLIO_BUCKET)
                .getPublicUrl(fileName);

        if (!data || !data.publicUrl) {
            throw new Error(
                "Görsel bağlantısı oluşturulamadı."
            );
        }

        return data.publicUrl;
    }

    async function savePortfolio(client) {
        const form =
            document.getElementById("portfolioForm");

        const title =
            getValue("portfolioTitle");

        const category =
            getValue("portfolioCategory");

        const description =
            getValue("portfolioDescription");

        const status =
            getValue("portfolioStatus") ||
            "active";

        if (!title) {
            showMessage(
                "Çalışma başlığı zorunludur.",
                "error"
            );
            return;
        }

        const button =
            form
                ? form.querySelector(
                    'button[type="submit"]'
                )
                : null;

        try {
            if (button) {
                button.disabled = true;
                button.textContent = "Kaydediliyor...";
            }

            let imageUrl =
                currentPortfolioImageUrl;

            if (selectedPortfolioImage) {
                imageUrl =
                    await uploadPortfolioImage(
                        client,
                        selectedPortfolioImage
                    );
            }

            const data = {
                title: title,
                category: category,
                description: description,
                status: status,
                image_url: imageUrl || null
            };

            let result;

            if (currentEditingPortfolioId) {
                result =
                    await client
                        .from(PORTFOLIO_TABLE)
                        .update(data)
                        .eq(
                            "id",
                            currentEditingPortfolioId
                        );
            } else {
                result =
                    await client
                        .from(PORTFOLIO_TABLE)
                        .insert([data]);
            }

            if (result.error) {
                throw result.error;
            }

            showMessage(
                currentEditingPortfolioId
                    ? "Portföy güncellendi."
                    : "Yeni çalışma eklendi.",
                "success"
            );

            closePortfolioForm();

            await loadPortfolios(client);

        } catch (error) {
            console.error(error);

            showMessage(
                error.message ||
                "Portföy kaydedilemedi.",
                "error"
            );

        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = "Kaydet";
            }
        }
    }

    /* =========================================
       PORTFOLIO ACTIONS
    ========================================= */

    function initializePortfolioActions(client) {
        const list =
            document.getElementById("portfolioList");

        if (!list) {
            return;
        }

        list.addEventListener(
            "click",
            async function (event) {
                const edit =
                    event.target.closest(
                        ".edit-portfolio"
                    );

                const remove =
                    event.target.closest(
                        ".delete-portfolio"
                    );

                if (edit) {
                    await editPortfolio(
                        client,
                        edit.dataset.id
                    );
                }

                if (remove) {
                    await deletePortfolio(
                        client,
                        remove.dataset.id
                    );
                }
            }
        );
    }

    async function editPortfolio(client, id) {
        try {
            const {
                data,
                error
            } =
                await client
                    .from(PORTFOLIO_TABLE)
                    .select("*")
                    .eq("id", id)
                    .single();

            if (error) {
                throw error;
            }

            currentEditingPortfolioId =
                data.id;

            currentPortfolioImageUrl =
                data.image_url || "";

            selectedPortfolioImage = null;

            setValue(
                "portfolioTitle",
                data.title || ""
            );

            setValue(
                "portfolioCategory",
                data.category || ""
            );

            setValue(
                "portfolioDescription",
                data.description || ""
            );

            setValue(
                "portfolioStatus",
                data.status || "active"
            );

            const formTitle =
                document.getElementById(
                    "portfolioFormTitle"
                );

            const card =
                document.getElementById(
                    "portfolioFormCard"
                );

            resetImagePreview();

            if (formTitle) {
                formTitle.textContent =
                    "Portföy Çalışmasını Düzenle";
            }

            if (
                currentPortfolioImageUrl
            ) {
                const preview =
                    document.getElementById(
                        "portfolioImagePreview"
                    );

                const content =
                    document.getElementById(
                        "imageUploadContent"
                    );

                if (preview) {
                    preview.src =
                        currentPortfolioImageUrl;

                    preview.classList.add("show");
                }

                if (content) {
                    content.style.display = "none";
                }
            }

            if (card) {
                card.style.display = "block";

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {
            console.error(error);

            showMessage(
                "Portföy bilgileri yüklenemedi.",
                "error"
            );
        }
    }

    async function deletePortfolio(client, id) {
        if (
            !window.confirm(
                "Bu çalışmayı silmek istediğinize emin misiniz?"
            )
        ) {
            return;
        }

        try {
            const {
                error
            } =
                await client
                    .from(PORTFOLIO_TABLE)
                    .delete()
                    .eq("id", id);

            if (error) {
                throw error;
            }

            showMessage(
                "Portföy silindi.",
                "success"
            );

            await loadPortfolios(client);

        } catch (error) {
            console.error(error);

            showMessage(
                error.message ||
                "Portföy silinemedi.",
                "error"
            );
        }
    }

    /* =========================================
       SETTINGS LOAD
    ========================================= */

    async function loadSettings(client) {
        try {
            const {
                data,
                error
            } =
                await client
                    .from(SETTINGS_TABLE)
                    .select("*");

            if (error) {
                throw error;
            }

            const settings = {};

            (data || []).forEach(
                function (item) {
                    const key =
                        item.setting_key ??
                        item.key;

                    const value =
                        item.setting_value ??
                        item.value ??
                        "";

                    if (key) {
                        settings[key] = value;
                    }
                }
            );

            setValue(
                "siteTitle",
                settings.site_title ||
                settings.site_name ||
                ""
            );

            setValue(
                "heroTitle",
                settings.hero_title || ""
            );

            setValue(
                "heroText",
                settings.hero_text ||
                settings.hero_description ||
                ""
            );

            setValue(
                "instagramLink",
                settings.instagram_link ||
                settings.instagram ||
                ""
            );

            setValue(
                "emailAddress",
                settings.email_address ||
                settings.email ||
                ""
            );

            setValue(
                "contactEmail",
                settings.contact_email ||
                settings.email_address ||
                settings.email ||
                ""
            );

            setValue(
                "contactPhone",
                settings.contact_phone ||
                settings.whatsapp ||
                ""
            );

            setValue(
                "contactAddress",
                settings.contact_address ||
                settings.address ||
                ""
            );

        } catch (error) {
            console.error(
                "Ayar yükleme hatası:",
                error
            );

            showMessage(
                "Site ayarları yüklenemedi: " +
                error.message,
                "error"
            );
        }
    }

    /* =========================================
       SETTINGS FORM
    ========================================= */

    function initializeSettingsForm(client) {
        const form =
            document.getElementById(
                "siteSettingsForm"
            );

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const button =
                    form.querySelector(
                        'button[type="submit"]'
                    );

                const originalText =
                    button
                        ? button.textContent
                        : "";

                try {
                    if (button) {
                        button.disabled = true;
                        button.textContent =
                            "Kaydediliyor...";
                    }

                    const settings = {
                        site_title:
                            getValue("siteTitle"),

                        hero_title:
                            getValue("heroTitle"),

                        hero_text:
                            getValue("heroText"),

                        instagram_link:
                            getValue(
                                "instagramLink"
                            ),

                        email_address:
                            getValue(
                                "emailAddress"
                            )
                    };

                    await saveSettingsObject(
                        client,
                        settings
                    );

                    showMessage(
                        "Site ayarları başarıyla kaydedildi.",
                        "success"
                    );

                } catch (error) {
                    console.error(error);

                    showMessage(
                        "Site ayarları kaydedilemedi: " +
                        error.message,
                        "error"
                    );

                } finally {
                    if (button) {
                        button.disabled = false;
                        button.textContent =
                            originalText ||
                            "Ayarları Kaydet";
                    }
                }
            }
        );
    }

    /* =========================================
       CONTACT FORM
    ========================================= */

    function initializeContactForm(client) {
        const form =
            document.getElementById("contactForm");

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            async function (event) {
                event.preventDefault();

                const button =
                    form.querySelector(
                        'button[type="submit"]'
                    );

                const originalText =
                    button
                        ? button.textContent
                        : "";

                try {
                    if (button) {
                        button.disabled = true;
                        button.textContent =
                            "Kaydediliyor...";
                    }

                    const settings = {
                        contact_email:
                            getValue("contactEmail"),

                        contact_phone:
                            getValue("contactPhone"),

                        contact_address:
                            getValue(
                                "contactAddress"
                            )
                    };

                    await saveSettingsObject(
                        client,
                        settings
                    );

                    showMessage(
                        "İletişim bilgileri kaydedildi.",
                        "success"
                    );

                } catch (error) {
                    console.error(error);

                    showMessage(
                        "İletişim bilgileri kaydedilemedi: " +
                        error.message,
                        "error"
                    );

                } finally {
                    if (button) {
                        button.disabled = false;
                        button.textContent =
                            originalText ||
                            "İletişim Bilgilerini Kaydet";
                    }
                }
            }
        );
    }

    /* =========================================
       SAVE SETTINGS
    ========================================= */

    async function saveSettingsObject(
        client,
        settings
    ) {
        const {
            data,
            error
        } =
            await client
                .from(SETTINGS_TABLE)
                .select("*");

        if (error) {
            throw error;
        }

        const existing =
            Array.isArray(data)
                ? data
                : [];

        for (
            const [settingKey, settingValue]
            of Object.entries(settings)
        ) {
            const current =
                existing.find(
                    function (item) {
                        return (
                            item.setting_key ===
                                settingKey ||
                            item.key ===
                                settingKey
                        );
                    }
                );

            if (current) {
                const updateData = {};

                if (
                    Object.prototype
                        .hasOwnProperty.call(
                            current,
                            "setting_value"
                        )
                ) {
                    updateData.setting_value =
                        settingValue;
                } else {
                    updateData.value =
                        settingValue;
                }

                let query =
                    client
                        .from(SETTINGS_TABLE)
                        .update(updateData);

                if (
                    current.id !== undefined &&
                    current.id !== null
                ) {
                    query =
                        query.eq(
                            "id",
                            current.id
                        );
                } else if (
                    Object.prototype
                        .hasOwnProperty.call(
                            current,
                            "setting_key"
                        )
                ) {
                    query =
                        query.eq(
                            "setting_key",
                            settingKey
                        );
                } else {
                    query =
                        query.eq(
                            "key",
                            settingKey
                        );
                }

                const {
                    error: updateError
                } = await query;

                if (updateError) {
                    throw updateError;
                }

            } else {
                let result =
                    await client
                        .from(SETTINGS_TABLE)
                        .insert([
                            {
                                setting_key:
                                    settingKey,

                                setting_value:
                                    settingValue
                            }
                        ]);

                if (
                    result.error &&
                    result.error.message &&
                    (
                        result.error.message.includes(
                            "setting_key"
                        ) ||
                        result.error.message.includes(
                            "setting_value"
                        )
                    )
                ) {
                    result =
                        await client
                            .from(SETTINGS_TABLE)
                            .insert([
                                {
                                    key:
                                        settingKey,

                                    value:
                                        settingValue
                                }
                            ]);
                }

                if (result.error) {
                    throw result.error;
                }
            }
        }
    }

    /* =========================================
       HELPERS
    ========================================= */

    function getValue(id) {
        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";
    }

    function setValue(id, value) {
        const element =
            document.getElementById(id);

        if (element) {
            element.value =
                value ?? "";
        }
    }

    function showMessage(message, type) {
        const box =
            document.getElementById(
                "adminMessage"
            );

        if (!box) {
            console.log(message);
            return;
        }

        box.textContent = message;

        box.className =
            "admin-message " +
            (type === "error"
                ? "error"
                : "success");

        box.style.display = "block";

        clearTimeout(
            window.adminMessageTimer
        );

        window.adminMessageTimer =
            setTimeout(
                function () {
                    box.style.display =
                        "none";
                },
                5000
            );
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

})();
