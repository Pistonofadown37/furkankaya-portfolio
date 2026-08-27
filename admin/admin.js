/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
========================================= */

(function () {
    "use strict";

    const PORTFOLIO_TABLE = "portfolios";
    const PORTFOLIO_BUCKET = "portfolio-images";

    let selectedPortfolioImage = null;
    let currentPortfolioImageUrl = "";
    let currentEditingPortfolioId = null;

    document.addEventListener("DOMContentLoaded", async function () {

        const supabaseClient = window.supabaseClient;

        if (!supabaseClient) {
            console.error(
                "Supabase bağlantısı bulunamadı. supabase.js dosyasını kontrol edin."
            );
            return;
        }

        window.adminSupabaseClient = supabaseClient;

        const hasSession = await checkAdminSession(supabaseClient);

        if (!hasSession) {
            return;
        }

        initializeAdminNavigation();
        initializeLogout(supabaseClient);
        initializePortfolioForm(supabaseClient);
        initializePortfolioImageUpload();
        initializePortfolioActions(supabaseClient);

        await loadPortfolios(supabaseClient);
    });


    /* =========================================
       OTURUM KONTROLÜ
    ========================================= */

    async function checkAdminSession(supabaseClient) {
        try {
            const { data, error } =
                await supabaseClient.auth.getSession();

            if (error) {
                console.error("Session hatası:", error);
                redirectToLogin();
                return false;
            }

            if (!data || !data.session) {
                redirectToLogin();
                return false;
            }

            return true;

        } catch (error) {
            console.error("Oturum kontrol hatası:", error);
            redirectToLogin();
            return false;
        }
    }


    function redirectToLogin() {
        window.location.replace("login.html");
    }


    /* =========================================
       NAVIGATION
    ========================================= */

    function initializeAdminNavigation() {

        const navButtons =
            document.querySelectorAll(".admin-nav-button");

        const sections =
            document.querySelectorAll(".admin-section");

        if (!navButtons.length) {
            console.warn("Navigation butonları bulunamadı.");
            return;
        }

        navButtons.forEach(function (button) {

            button.addEventListener("click", function (event) {

                event.preventDefault();

                const targetId = button.getAttribute("data-target");

                if (!targetId) {
                    console.warn(
                        "Butonda data-target bulunamadı:",
                        button
                    );
                    return;
                }

                const targetSection =
                    document.getElementById(targetId);

                if (!targetSection) {
                    console.warn(
                        "Bölüm bulunamadı:",
                        targetId
                    );
                    return;
                }

                navButtons.forEach(function (item) {
                    item.classList.remove("active");
                });

                sections.forEach(function (section) {
                    section.classList.remove("active");
                });

                button.classList.add("active");
                targetSection.classList.add("active");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        });
    }


    /* =========================================
       LOGOUT
    ========================================= */

    function initializeLogout(supabaseClient) {

        const logoutButton =
            document.getElementById("logoutButton");

        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener(
            "click",
            async function () {

                const originalText =
                    logoutButton.textContent;

                try {
                    logoutButton.disabled = true;
                    logoutButton.textContent =
                        "Çıkış yapılıyor...";

                    const { error } =
                        await supabaseClient.auth.signOut();

                    if (error) {
                        throw error;
                    }

                    clearSupabaseStorage();

                    window.location.replace(
                        "login.html?logout=1"
                    );

                } catch (error) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );

                    logoutButton.disabled = false;
                    logoutButton.textContent =
                        originalText;

                    showMessage(
                        "Çıkış yapılırken hata oluştu: " +
                        error.message,
                        "error"
                    );
                }
            }
        );
    }


    function clearSupabaseStorage() {

        const localKeys = [];

        for (let i = 0; i < localStorage.length; i++) {

            const key = localStorage.key(i);

            if (
                key &&
                (
                    key.startsWith("sb-") ||
                    key.includes("supabase")
                )
            ) {
                localKeys.push(key);
            }
        }

        localKeys.forEach(function (key) {
            localStorage.removeItem(key);
        });


        const sessionKeys = [];

        for (let i = 0; i < sessionStorage.length; i++) {

            const key = sessionStorage.key(i);

            if (
                key &&
                (
                    key.startsWith("sb-") ||
                    key.includes("supabase")
                )
            ) {
                sessionKeys.push(key);
            }
        }

        sessionKeys.forEach(function (key) {
            sessionStorage.removeItem(key);
        });
    }


    /* =========================================
       PORTFÖYLERİ YÜKLE
    ========================================= */

    async function loadPortfolios(supabaseClient) {

        const portfolioList =
            document.getElementById("portfolioList");

        if (!portfolioList) {
            return;
        }

        portfolioList.innerHTML =
            '<div class="admin-loading">Portföyler yükleniyor...</div>';

        try {

            const { data, error } =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
                    .select("*")
                    .order("created_at", {
                        ascending: false
                    });

            if (error) {
                throw error;
            }

            const portfolios =
                Array.isArray(data) ? data : [];

            renderPortfolios(portfolios);
            updateDashboard(portfolios);

        } catch (error) {

            console.error(
                "Portföy yükleme hatası:",
                error
            );

            portfolioList.innerHTML =
                '<div class="admin-empty-state">Portföyler yüklenirken hata oluştu.</div>';

            showMessage(
                error.message ||
                "Portföyler yüklenemedi.",
                "error"
            );
        }
    }


    /* =========================================
       PORTFÖY LİSTESİ
    ========================================= */

    function renderPortfolios(portfolios) {

        const portfolioList =
            document.getElementById("portfolioList");

        if (!portfolioList) {
            return;
        }

        portfolioList.innerHTML = "";

        if (!portfolios.length) {

            portfolioList.innerHTML =
                '<div class="admin-empty-state">Henüz portföy çalışması bulunmuyor.</div>';

            return;
        }

        portfolios.forEach(function (portfolio) {

            const imageUrl =
                portfolio.image_url || "";

            const item =
                document.createElement("div");

            item.className =
                "portfolio-admin-item";

            item.innerHTML = `
                <div class="portfolio-admin-image">
                    ${
                        imageUrl
                            ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(portfolio.title || "Portföy görseli")}">`
                            : `<div class="portfolio-admin-no-image">GÖRSEL YOK</div>`
                    }
                </div>

                <div class="portfolio-admin-content">

                    <h3>
                        ${escapeHtml(
                            portfolio.title || "İsimsiz çalışma"
                        )}
                    </h3>

                    <p class="portfolio-admin-category">
                        ${escapeHtml(
                            portfolio.category || ""
                        )}
                    </p>

                    <p class="portfolio-admin-description">
                        ${escapeHtml(
                            portfolio.description || ""
                        )}
                    </p>

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

            portfolioList.appendChild(item);
        });
    }


    /* =========================================
       DASHBOARD
    ========================================= */

    function updateDashboard(portfolios) {

        const totalPortfolio =
            document.getElementById("totalPortfolio");

        const activePortfolio =
            document.getElementById("activePortfolio");

        if (totalPortfolio) {
            totalPortfolio.textContent =
                portfolios.length;
        }

        if (activePortfolio) {

            activePortfolio.textContent =
                portfolios.filter(function (portfolio) {
                    return portfolio.status === "active";
                }).length;
        }
    }


    /* =========================================
       FORM
    ========================================= */

    function initializePortfolioForm(supabaseClient) {

        const newPortfolioButton =
            document.getElementById("newPortfolioButton");

        const cancelPortfolioButton =
            document.getElementById("cancelPortfolioButton");

        const portfolioForm =
            document.getElementById("portfolioForm");

        if (newPortfolioButton) {
            newPortfolioButton.addEventListener(
                "click",
                openNewPortfolioForm
            );
        }

        if (cancelPortfolioButton) {
            cancelPortfolioButton.addEventListener(
                "click",
                closePortfolioForm
            );
        }

        if (portfolioForm) {

            portfolioForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    await savePortfolio(
                        supabaseClient
                    );
                }
            );
        }
    }


    function openNewPortfolioForm() {

        const form =
            document.getElementById("portfolioForm");

        const formCard =
            document.getElementById("portfolioFormCard");

        const formTitle =
            document.getElementById("portfolioFormTitle");

        currentEditingPortfolioId = null;
        currentPortfolioImageUrl = "";
        selectedPortfolioImage = null;

        if (form) {
            form.reset();
        }

        resetPortfolioImagePreview();

        if (formTitle) {
            formTitle.textContent =
                "Yeni Portföy Çalışması";
        }

        if (formCard) {
            formCard.style.display = "block";

            formCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    function closePortfolioForm() {

        const formCard =
            document.getElementById("portfolioFormCard");

        if (formCard) {
            formCard.style.display = "none";
        }

        currentEditingPortfolioId = null;
        currentPortfolioImageUrl = "";
        selectedPortfolioImage = null;
    }


    /* =========================================
       GÖRSEL SEÇİMİ
    ========================================= */

    function initializePortfolioImageUpload() {

        const imageInput =
            document.getElementById("portfolioImageInput");

        if (!imageInput) {
            return;
        }

        imageInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {

                    showMessage(
                        "Lütfen geçerli bir görsel seçin.",
                        "error"
                    );

                    imageInput.value = "";

                    return;
                }

                selectedPortfolioImage = file;

                showPortfolioImagePreview(file);
            }
        );
    }


    function showPortfolioImagePreview(file) {

        const preview =
            document.getElementById(
                "portfolioImagePreview"
            );

        const uploadContent =
            document.getElementById(
                "imageUploadContent"
            );

        if (!preview) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            preview.src = event.target.result;
            preview.classList.add("show");

            if (uploadContent) {
                uploadContent.style.display = "none";
            }
        };

        reader.readAsDataURL(file);
    }


    function resetPortfolioImagePreview() {

        const preview =
            document.getElementById(
                "portfolioImagePreview"
            );

        const uploadContent =
            document.getElementById(
                "imageUploadContent"
            );

        const imageInput =
            document.getElementById(
                "portfolioImageInput"
            );

        if (preview) {
            preview.src = "";
            preview.classList.remove("show");
        }

        if (uploadContent) {
            uploadContent.style.display = "";
        }

        if (imageInput) {
            imageInput.value = "";
        }
    }


    /* =========================================
       STORAGE UPLOAD
    ========================================= */

    async function uploadPortfolioImage(
        supabaseClient,
        file
    ) {

        const extension =
            file.name.split(".").pop() ||
            "jpg";

        const fileName =
            `portfolio/${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 10)}.${extension}`;

        const { error: uploadError } =
            await supabaseClient
                .storage
                .from(PORTFOLIO_BUCKET)
                .upload(
                    fileName,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false
                    }
                );

        if (uploadError) {
            throw uploadError;
        }

        const { data } =
            supabaseClient
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


    /* =========================================
       KAYDET
    ========================================= */

    async function savePortfolio(supabaseClient) {

        const titleInput =
            document.getElementById("portfolioTitle");

        const categoryInput =
            document.getElementById("portfolioCategory");

        const descriptionInput =
            document.getElementById("portfolioDescription");

        const dateInput =
            document.getElementById("portfolioDate");

        const statusInput =
            document.getElementById("portfolioStatus");

        const form =
            document.getElementById("portfolioForm");

        const submitButton =
            form
                ? form.querySelector(
                    'button[type="submit"]'
                )
                : null;

        const title =
            titleInput
                ? titleInput.value.trim()
                : "";

        if (!title) {

            showMessage(
                "Portföy başlığı zorunludur.",
                "error"
            );

            if (titleInput) {
                titleInput.focus();
            }

            return;
        }

        try {

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent =
                    "Kaydediliyor...";
            }

            let imageUrl =
                currentPortfolioImageUrl;

            if (selectedPortfolioImage) {
                imageUrl =
                    await uploadPortfolioImage(
                        supabaseClient,
                        selectedPortfolioImage
                    );
            }

            const portfolioData = {
                title: title,
                category:
                    categoryInput
                        ? categoryInput.value.trim()
                        : "",
                description:
                    descriptionInput
                        ? descriptionInput.value.trim()
                        : "",
                date:
                    dateInput
                        ? dateInput.value
                        : null,
                status:
                    statusInput
                        ? statusInput.value
                        : "active",
                image_url:
                    imageUrl || null
            };

            let error;

            if (currentEditingPortfolioId) {

                const result =
                    await supabaseClient
                        .from(PORTFOLIO_TABLE)
                        .update(portfolioData)
                        .eq(
                            "id",
                            currentEditingPortfolioId
                        );

                error = result.error;

            } else {

                const result =
                    await supabaseClient
                        .from(PORTFOLIO_TABLE)
                        .insert([portfolioData]);

                error = result.error;
            }

            if (error) {
                throw error;
            }

            showMessage(
                currentEditingPortfolioId
                    ? "Portföy başarıyla güncellendi."
                    : "Portföy başarıyla eklendi.",
                "success"
            );

            closePortfolioForm();

            await loadPortfolios(
                supabaseClient
            );

        } catch (error) {

            console.error(
                "Portföy kaydetme hatası:",
                error
            );

            showMessage(
                "Kaydetme hatası: " +
                (error.message || "Bilinmeyen hata"),
                "error"
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent =
                    "Kaydet";
            }
        }
    }


    /* =========================================
       LİSTE BUTONLARI
    ========================================= */

    function initializePortfolioActions(
        supabaseClient
    ) {

        const portfolioList =
            document.getElementById("portfolioList");

        if (!portfolioList) {
            return;
        }

        portfolioList.addEventListener(
            "click",
            async function (event) {

                const editButton =
                    event.target.closest(
                        ".edit-portfolio"
                    );

                const deleteButton =
                    event.target.closest(
                        ".delete-portfolio"
                    );

                if (editButton) {

                    await editPortfolio(
                        supabaseClient,
                        editButton.dataset.id
                    );

                    return;
                }

                if (deleteButton) {

                    await deletePortfolio(
                        supabaseClient,
                        deleteButton.dataset.id
                    );
                }
            }
        );
    }


    /* =========================================
       DÜZENLE
    ========================================= */

    async function editPortfolio(
        supabaseClient,
        portfolioId
    ) {

        if (!portfolioId) {
            return;
        }

        try {

            const { data, error } =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
                    .select("*")
                    .eq("id", portfolioId)
                    .single();

            if (error) {
                throw error;
            }

            currentEditingPortfolioId = data.id;
            currentPortfolioImageUrl =
                data.image_url || "";

            selectedPortfolioImage = null;

            setFieldValue(
                "portfolioTitle",
                data.title || ""
            );

            setFieldValue(
                "portfolioCategory",
                data.category || ""
            );

            setFieldValue(
                "portfolioDescription",
                data.description || ""
            );

            setFieldValue(
                "portfolioDate",
                data.date || ""
            );

            setFieldValue(
                "portfolioStatus",
                data.status || "active"
            );

            const formTitle =
                document.getElementById(
                    "portfolioFormTitle"
                );

            if (formTitle) {
                formTitle.textContent =
                    "Portföy Çalışmasını Düzenle";
            }

            const formCard =
                document.getElementById(
                    "portfolioFormCard"
                );

            if (formCard) {
                formCard.style.display = "block";
            }

            if (currentPortfolioImageUrl) {

                const preview =
                    document.getElementById(
                        "portfolioImagePreview"
                    );

                if (preview) {
                    preview.src =
                        currentPortfolioImageUrl;

                    preview.classList.add("show");
                }
            }

            if (formCard) {
                formCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        } catch (error) {

            console.error(
                "Düzenleme hatası:",
                error
            );

            showMessage(
                error.message ||
                "Portföy bilgileri yüklenemedi.",
                "error"
            );
        }
    }


    /* =========================================
       SİL
    ========================================= */

    async function deletePortfolio(
        supabaseClient,
        portfolioId
    ) {

        if (!portfolioId) {
            return;
        }

        const confirmed =
            window.confirm(
                "Bu portföy çalışmasını silmek istediğinize emin misiniz?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const { error } =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
                    .delete()
                    .eq("id", portfolioId);

            if (error) {
                throw error;
            }

            showMessage(
                "Portföy başarıyla silindi.",
                "success"
            );

            await loadPortfolios(
                supabaseClient
            );

        } catch (error) {

            console.error(
                "Silme hatası:",
                error
            );

            showMessage(
                error.message ||
                "Portföy silinemedi.",
                "error"
            );
        }
    }


    /* =========================================
       MESAJ
    ========================================= */

    function showMessage(
        message,
        type
    ) {

        const messageBox =
            document.getElementById(
                "adminMessage"
            );

        if (!messageBox) {

            console.log(
                type + ":",
                message
            );

            return;
        }

        messageBox.textContent = message;

        messageBox.className =
            "admin-message show " +
            type;

        window.clearTimeout(
            window.adminMessageTimeout
        );

        window.adminMessageTimeout =
            window.setTimeout(
                function () {
                    messageBox.className =
                        "admin-message";
                },
                5000
            );
    }


    /* =========================================
       YARDIMCI FONKSİYONLAR
    ========================================= */

    function setFieldValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = value;
        }
    }


    function escapeHtml(value) {

        const div =
            document.createElement("div");

        div.textContent =
            value === null ||
            value === undefined
                ? ""
                : String(value);

        return div.innerHTML;
    }


    function escapeAttribute(value) {

        return escapeHtml(value)
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

})();
