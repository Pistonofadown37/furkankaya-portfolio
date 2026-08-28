/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
========================================= */

(function () {
    "use strict";


    /* =========================================
       AYARLAR
    ========================================= */

    const PORTFOLIO_TABLE = "portfolios";
    const PORTFOLIO_BUCKET = "portfolio-images";


    /* =========================================
       GLOBAL DEĞİŞKENLER
    ========================================= */

    let selectedPortfolioImage = null;
    let currentPortfolioImageUrl = "";
    let currentEditingPortfolioId = null;


    /* =========================================
       DOM HAZIR
    ========================================= */

    document.addEventListener(
        "DOMContentLoaded",
        async function () {

            const supabaseClient =
                window.supabaseClient;

            if (!supabaseClient) {

                console.error(
                    "Supabase bağlantısı bulunamadı."
                );

                showMessage(
                    "Supabase bağlantısı bulunamadı.",
                    "error"
                );

                return;
            }


            window.adminSupabaseClient =
                supabaseClient;


            /* ---------------------------------
               OTURUM KONTROLÜ
            --------------------------------- */

            const hasSession =
                await checkAdminSession(
                    supabaseClient
                );

            if (!hasSession) {
                return;
            }


            /* ---------------------------------
               TÜM SİSTEMLERİ BAŞLAT
            --------------------------------- */

            initializeAdminNavigation();

            initializeLogout(
                supabaseClient
            );

            initializePortfolioForm(
                supabaseClient
            );

            initializePortfolioImageUpload();

            initializePortfolioActions(
                supabaseClient
            );


            /* ---------------------------------
               PORTFÖYLERİ YÜKLE
            --------------------------------- */

            await loadPortfolios(
                supabaseClient
            );

        }
    );


    /* =========================================
       OTURUM KONTROLÜ
    ========================================= */

    async function checkAdminSession(
        supabaseClient
    ) {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                console.error(
                    "Oturum kontrol hatası:",
                    error
                );

                redirectToLogin();

                return false;
            }


            if (
                !data ||
                !data.session
            ) {

                redirectToLogin();

                return false;
            }


            return true;

        } catch (error) {

            console.error(
                "Oturum kontrol hatası:",
                error
            );

            redirectToLogin();

            return false;
        }

    }


    /* =========================================
       LOGIN SAYFASINA GİT
    ========================================= */

    function redirectToLogin() {

        if (
            !window.location.pathname
                .endsWith("/login.html")
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }


    /* =========================================
       ADMIN NAVIGATION
    ========================================= */

    function initializeAdminNavigation() {

        const navButtons =
            document.querySelectorAll(
                ".admin-nav-button"
            );


        const sections =
            document.querySelectorAll(
                ".admin-section"
            );


        if (
            !navButtons.length ||
            !sections.length
        ) {

            console.warn(
                "Admin navigation elemanları bulunamadı."
            );

            return;
        }


        navButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        const targetId =
                            button.getAttribute(
                                "data-target"
                            );


                        if (!targetId) {

                            console.warn(
                                "Butonda data-target bulunamadı.",
                                button
                            );

                            return;
                        }


                        const targetSection =
                            document.getElementById(
                                targetId
                            );


                        if (!targetSection) {

                            console.warn(
                                "Hedef bölüm bulunamadı:",
                                targetId
                            );

                            return;
                        }


                        /* Tüm butonları kapat */

                        navButtons.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                        /* Tüm bölümleri kapat */

                        sections.forEach(
                            function (section) {

                                section.classList.remove(
                                    "active"
                                );

                            }
                        );


                        /* Seçilen bölümü aç */

                        button.classList.add(
                            "active"
                        );


                        targetSection.classList.add(
                            "active"
                        );


                        /* Sayfanın üstüne çık */

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }
                );

            }
        );

    }


    /* =========================================
       ÇIKIŞ
    ========================================= */

    function initializeLogout(
        supabaseClient
    ) {

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        if (!logoutButton) {
            return;
        }


        logoutButton.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                const originalText =
                    logoutButton.textContent;


                try {

                    logoutButton.disabled = true;

                    logoutButton.textContent =
                        "Çıkış yapılıyor...";


                    const {
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signOut();


                    if (error) {
                        throw error;
                    }


                    /* Supabase session temizliği */

                    clearSupabaseStorage();


                    /* Login sayfasına git */

                    window.location.replace(
                        "login.html?logout=1"
                    );


                } catch (error) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );


                    showMessage(
                        "Çıkış yapılırken hata oluştu: " +
                        (
                            error.message ||
                            "Bilinmeyen hata"
                        ),
                        "error"
                    );


                    logoutButton.disabled =
                        false;


                    logoutButton.textContent =
                        originalText;

                }

            }
        );

    }


    /* =========================================
       SUPABASE STORAGE TEMİZLE
    ========================================= */

    function clearSupabaseStorage() {

        const localKeys = [];


        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {

            const key =
                localStorage.key(i);


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


        localKeys.forEach(
            function (key) {

                localStorage.removeItem(key);

            }
        );


        const sessionKeys = [];


        for (
            let i = 0;
            i < sessionStorage.length;
            i++
        ) {

            const key =
                sessionStorage.key(i);


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


        sessionKeys.forEach(
            function (key) {

                sessionStorage.removeItem(key);

            }
        );

    }


    /* =========================================
       PORTFÖYLERİ YÜKLE
    ========================================= */

    async function loadPortfolios(
        supabaseClient
    ) {

        const portfolioList =
            document.getElementById(
                "portfolioList"
            );


        if (!portfolioList) {

            console.warn(
                "portfolioList bulunamadı."
            );

            return;
        }


        portfolioList.innerHTML = `
            <div class="admin-loading">
                Portföyler yükleniyor...
            </div>
        `;


        try {

            let response =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            /*
               Eğer created_at yoksa
               normal select ile tekrar dene
            */

            if (response.error) {

                response =
                    await supabaseClient
                        .from(PORTFOLIO_TABLE)
                        .select("*");

            }


            if (response.error) {
                throw response.error;
            }


            const portfolios =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];


            renderPortfolios(
                portfolios
            );


            updateDashboard(
                portfolios
            );


        } catch (error) {

            console.error(
                "Portföy yükleme hatası:",
                error
            );


            portfolioList.innerHTML = `
                <div class="admin-empty-state">
                    Portföyler yüklenirken hata oluştu.
                </div>
            `;


            showMessage(
                error.message ||
                "Portföyler yüklenemedi.",
                "error"
            );

        }

    }


    /* =========================================
       PORTFÖYLERİ GÖSTER
    ========================================= */

    function renderPortfolios(
        portfolios
    ) {

        const portfolioList =
            document.getElementById(
                "portfolioList"
            );


        if (!portfolioList) {
            return;
        }


        portfolioList.innerHTML = "";


        if (!portfolios.length) {

            portfolioList.innerHTML = `
                <div class="admin-empty-state">
                    Henüz portföy çalışması bulunmuyor.
                </div>
            `;

            return;
        }


        portfolios.forEach(
            function (portfolio) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "portfolio-admin-item";


                const imageUrl =
                    portfolio.image_url ||
                    "";


                const title =
                    portfolio.title ||
                    "İsimsiz çalışma";


                const category =
                    portfolio.category ||
                    "";


                const description =
                    portfolio.description ||
                    "";


                item.innerHTML = `

                    <div class="portfolio-admin-image">

                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${escapeAttribute(imageUrl)}"
                                        alt="${escapeAttribute(title)}"
                                    >
                                `
                                : `
                                    <div class="portfolio-admin-no-image">
                                        GÖRSEL YOK
                                    </div>
                                `
                        }

                    </div>


                    <div class="portfolio-admin-content">

                        <h3>
                            ${escapeHtml(title)}
                        </h3>


                        ${
                            category
                                ? `
                                    <p class="portfolio-admin-category">
                                        ${escapeHtml(category)}
                                    </p>
                                `
                                : ""
                        }


                        ${
                            description
                                ? `
                                    <p class="portfolio-admin-description">
                                        ${escapeHtml(description)}
                                    </p>
                                `
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


                portfolioList.appendChild(
                    item
                );

            }
        );

    }


    /* =========================================
       DASHBOARD İSTATİSTİKLERİ
    ========================================= */

    function updateDashboard(
        portfolios
    ) {

        const totalPortfolio =
            document.getElementById(
                "totalPortfolio"
            );


        const activePortfolio =
            document.getElementById(
                "activePortfolio"
            );


        if (totalPortfolio) {

            totalPortfolio.textContent =
                portfolios.length;

        }


        if (activePortfolio) {

            const activeCount =
                portfolios.filter(
                    function (portfolio) {

                        if (
                            !portfolio.status
                        ) {
                            return true;
                        }


                        const status =
                            String(
                                portfolio.status
                            )
                            .trim()
                            .toLowerCase();


                        return (
                            status === "active" ||
                            status === "aktif" ||
                            status === "true" ||
                            status === "1"
                        );

                    }
                ).length;


            activePortfolio.textContent =
                activeCount;

        }

    }


    /* =========================================
       PORTFÖY FORMUNU BAŞLAT
    ========================================= */

    function initializePortfolioForm(
        supabaseClient
    ) {

        const newPortfolioButton =
            document.getElementById(
                "newPortfolioButton"
            );


        const cancelPortfolioButton =
            document.getElementById(
                "cancelPortfolioButton"
            );


        const portfolioForm =
            document.getElementById(
                "portfolioForm"
            );


        if (newPortfolioButton) {

            newPortfolioButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openNewPortfolioForm();

                }
            );

        }


        if (cancelPortfolioButton) {

            cancelPortfolioButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closePortfolioForm();

                }
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


    /* =========================================
       YENİ PORTFÖY FORMU
    ========================================= */

    function openNewPortfolioForm() {

        const form =
            document.getElementById(
                "portfolioForm"
            );


        const formCard =
            document.getElementById(
                "portfolioFormCard"
            );


        const formTitle =
            document.getElementById(
                "portfolioFormTitle"
            );


        currentEditingPortfolioId =
            null;


        currentPortfolioImageUrl =
            "";


        selectedPortfolioImage =
            null;


        if (form) {
            form.reset();
        }


        resetPortfolioImagePreview();


        if (formTitle) {

            formTitle.textContent =
                "Yeni Portföy Çalışması";

        }


        if (formCard) {

            formCard.style.display =
                "block";


            setTimeout(
                function () {

                    formCard.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                50
            );

        }

    }


    /* =========================================
       FORMU KAPAT
    ========================================= */

    function closePortfolioForm() {

        const formCard =
            document.getElementById(
                "portfolioFormCard"
            );


        const form =
            document.getElementById(
                "portfolioForm"
            );


        if (formCard) {

            formCard.style.display =
                "none";

        }


        if (form) {
            form.reset();
        }


        currentEditingPortfolioId =
            null;


        currentPortfolioImageUrl =
            "";


        selectedPortfolioImage =
            null;


        resetPortfolioImagePreview();

    }


    /* =========================================
       GÖRSEL YÜKLEME BAŞLAT
    ========================================= */

    function initializePortfolioImageUpload() {

        const imageInput =
            document.getElementById(
                "portfolioImageInput"
            );


        if (!imageInput) {

            console.warn(
                "portfolioImageInput bulunamadı."
            );

            return;
        }


        imageInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files &&
                    event.target.files[0];


                if (!file) {
                    return;
                }


                if (
                    !file.type ||
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showMessage(
                        "Lütfen geçerli bir görsel seçin.",
                        "error"
                    );


                    imageInput.value =
                        "";


                    selectedPortfolioImage =
                        null;


                    return;
                }


                selectedPortfolioImage =
                    file;


                showPortfolioImagePreview(
                    file
                );

            }
        );

    }


    /* =========================================
       GÖRSEL ÖNİZLEME
    ========================================= */

    function showPortfolioImagePreview(
        file
    ) {

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


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                preview.src =
                    event.target.result;


                preview.classList.add(
                    "show"
                );


                if (uploadContent) {

                    uploadContent.style.display =
                        "none";

                }

            };


        reader.readAsDataURL(
            file
        );

    }


    /* =========================================
       GÖRSEL ÖNİZLEME SIFIRLA
    ========================================= */

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

            preview.src =
                "";


            preview.classList.remove(
                "show"
            );

        }


        if (uploadContent) {

            uploadContent.style.display =
                "";

        }


        if (imageInput) {

            imageInput.value =
                "";

        }

    }


    /* =========================================
       SUPABASE STORAGE GÖRSEL YÜKLE
    ========================================= */

    async function uploadPortfolioImage(
        supabaseClient,
        file
    ) {

        if (!file) {
            return "";
        }


        const originalName =
            file.name ||
            "portfolio.jpg";


        let extension =
            originalName
                .split(".")
                .pop()
                .toLowerCase();


        if (
            !extension ||
            extension.length > 10
        ) {

            extension =
                "jpg";

        }


        const fileName =
            "portfolio/" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 12) +
            "." +
            extension;


        const {
            error: uploadError
        } =
            await supabaseClient
                .storage
                .from(
                    PORTFOLIO_BUCKET
                )
                .upload(
                    fileName,
                    file,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            file.type ||
                            "image/jpeg"
                    }
                );


        if (uploadError) {

            console.error(
                "Görsel yükleme hatası:",
                uploadError
            );

            throw uploadError;

        }


        const {
            data
        } =
            supabaseClient
                .storage
                .from(
                    PORTFOLIO_BUCKET
                )
                .getPublicUrl(
                    fileName
                );


        if (
            !data ||
            !data.publicUrl
        ) {

            throw new Error(
                "Görsel bağlantısı oluşturulamadı."
            );

        }


        return data.publicUrl;

    }


    /* =========================================
       PORTFÖY KAYDET
    ========================================= */

    async function savePortfolio(
        supabaseClient
    ) {

        const titleInput =
            document.getElementById(
                "portfolioTitle"
            );


        const categoryInput =
            document.getElementById(
                "portfolioCategory"
            );


        const descriptionInput =
            document.getElementById(
                "portfolioDescription"
            );


        const statusInput =
            document.getElementById(
                "portfolioStatus"
            );


        const form =
            document.getElementById(
                "portfolioForm"
            );


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


        const category =
            categoryInput
                ? categoryInput.value.trim()
                : "";


        const description =
            descriptionInput
                ? descriptionInput.value.trim()
                : "";


        const status =
            statusInput &&
            statusInput.value
                ? statusInput.value
                : "active";


        try {

            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.textContent =
                    "Kaydediliyor...";

            }


            let imageUrl =
                currentPortfolioImageUrl ||
                "";


            /* Yeni görsel seçildiyse yükle */

            if (selectedPortfolioImage) {

                imageUrl =
                    await uploadPortfolioImage(
                        supabaseClient,
                        selectedPortfolioImage
                    );

            }


            /*
               ÖNEMLİ:
               date alanı YOK.

               Çünkü Supabase portfolios tablosunda
               date sütunu bulunmuyor.
            */

            const portfolioData = {

                title:
                    title,

                category:
                    category,

                description:
                    description,

                status:
                    status,

                image_url:
                    imageUrl || null

            };


            let result;


            /* ---------------------------------
               DÜZENLEME
            --------------------------------- */

            if (
                currentEditingPortfolioId
            ) {

                result =
                    await supabaseClient
                        .from(
                            PORTFOLIO_TABLE
                        )
                        .update(
                            portfolioData
                        )
                        .eq(
                            "id",
                            currentEditingPortfolioId
                        )
                        .select();


            /* ---------------------------------
               YENİ KAYIT
            --------------------------------- */

            } else {

                result =
                    await supabaseClient
                        .from(
                            PORTFOLIO_TABLE
                        )
                        .insert(
                            [portfolioData]
                        )
                        .select();

            }


            if (result.error) {

                console.error(
                    "Supabase kayıt hatası:",
                    result.error
                );

                throw result.error;

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
                (
                    error.message ||
                    "Bilinmeyen hata"
                ),
                "error"
            );


        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;


                submitButton.textContent =
                    "Kaydet";

            }

        }

    }


    /* =========================================
       PORTFÖY LİSTE BUTONLARI
    ========================================= */

    function initializePortfolioActions(
        supabaseClient
    ) {

        const portfolioList =
            document.getElementById(
                "portfolioList"
            );


        if (!portfolioList) {

            console.warn(
                "Portfolio actions için liste bulunamadı."
            );

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


                /* DÜZENLE */

                if (editButton) {

                    event.preventDefault();


                    await editPortfolio(
                        supabaseClient,
                        editButton.dataset.id
                    );


                    return;
                }


                /* SİL */

                if (deleteButton) {

                    event.preventDefault();


                    await deletePortfolio(
                        supabaseClient,
                        deleteButton.dataset.id
                    );

                }

            }
        );

    }


    /* =========================================
       PORTFÖY DÜZENLE
    ========================================= */

    async function editPortfolio(
        supabaseClient,
        portfolioId
    ) {

        if (!portfolioId) {

            showMessage(
                "Portföy ID bulunamadı.",
                "error"
            );

            return;
        }


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        PORTFOLIO_TABLE
                    )
                    .select("*")
                    .eq(
                        "id",
                        portfolioId
                    )
                    .single();


            if (error) {
                throw error;
            }


            if (!data) {

                throw new Error(
                    "Portföy bulunamadı."
                );

            }


            currentEditingPortfolioId =
                data.id;


            currentPortfolioImageUrl =
                data.image_url ||
                "";


            selectedPortfolioImage =
                null;


            /* FORM ALANLARINI DOLDUR */

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

                formCard.style.display =
                    "block";

            }


            resetPortfolioImagePreview();


            /* Mevcut görseli göster */

            if (
                currentPortfolioImageUrl
            ) {

                const preview =
                    document.getElementById(
                        "portfolioImagePreview"
                    );


                const uploadContent =
                    document.getElementById(
                        "imageUploadContent"
                    );


                if (preview) {

                    preview.src =
                        currentPortfolioImageUrl;


                    preview.classList.add(
                        "show"
                    );

                }


                if (uploadContent) {

                    uploadContent.style.display =
                        "none";

                }

            }


            if (formCard) {

                setTimeout(
                    function () {

                        formCard.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    50
                );

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
       PORTFÖY SİL
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

            const {
                error
            } =
                await supabaseClient
                    .from(
                        PORTFOLIO_TABLE
                    )
                    .delete()
                    .eq(
                        "id",
                        portfolioId
                    );


            if (error) {
                throw error;
            }


            /* Düzenlenen kayıt silindiyse formu kapat */

            if (
                String(
                    currentEditingPortfolioId
                ) ===
                String(portfolioId)
            ) {

                closePortfolioForm();

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
                "Portföy silme hatası:",
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
       FORM ALANI DOLDUR
    ========================================= */

    function setFieldValue(
        id,
        value
    ) {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.value =
            value;

    }


    /* =========================================
       MESAJ GÖSTER
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


        messageBox.textContent =
            message;


        messageBox.className =
            "admin-message " +
            (
                type === "error"
                    ? "error"
                    : "success"
            );


        messageBox.style.display =
            "block";


        clearTimeout(
            window.adminMessageTimer
        );


        window.adminMessageTimer =
            setTimeout(
                function () {

                    messageBox.style.display =
                        "none";

                },
                5000
            );

    }


    /* =========================================
       HTML ESCAPE
    ========================================= */

    function escapeHtml(
        value
    ) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =========================================
       ATTRIBUTE ESCAPE
    ========================================= */

    function escapeAttribute(
        value
    ) {

        return escapeHtml(
            value
        );

    }


})();
