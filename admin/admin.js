/* =========================================
   FURKAN KAYA - ADMIN PANEL
   SUPABASE VERSION
========================================= */

document.addEventListener("DOMContentLoaded", async function () {

    /* =========================================
       ELEMENTLER
    ========================================= */

    const navButtons =
        document.querySelectorAll(".admin-nav-button");

    const sections =
        document.querySelectorAll(".admin-section");


    const portfolioList =
        document.getElementById("portfolioList");

    const portfolioEmptyState =
        document.getElementById("portfolioEmptyState");


    const portfolioFormCard =
        document.getElementById("portfolioFormCard");

    const portfolioForm =
        document.getElementById("portfolioForm");

    const portfolioFormTitle =
        document.getElementById("portfolioFormTitle");


    const newPortfolioButton =
        document.getElementById("newPortfolioButton");

    const cancelPortfolioButton =
        document.getElementById("cancelPortfolioButton");


    const portfolioEditId =
        document.getElementById("portfolioEditId");

    const portfolioTitle =
        document.getElementById("portfolioTitle");

    const portfolioCategory =
        document.getElementById("portfolioCategory");

    const portfolioDescription =
        document.getElementById("portfolioDescription");

    const portfolioDate =
        document.getElementById("portfolioDate");

    const portfolioStatus =
        document.getElementById("portfolioStatus");


    const portfolioImageInput =
        document.getElementById("portfolioImageInput");

    const portfolioImagePreview =
        document.getElementById("portfolioImagePreview");

    const imageUploadContent =
        document.getElementById("imageUploadContent");


    const totalPortfolio =
        document.getElementById("totalPortfolio");

    const activePortfolio =
        document.getElementById("activePortfolio");


    const siteSettingsForm =
        document.getElementById("siteSettingsForm");

    const contactForm =
        document.getElementById("contactForm");


    const logoutButton =
        document.getElementById("logoutButton");

    const adminMessage =
        document.getElementById("adminMessage");


    /* =========================================
       GLOBAL DEĞİŞKENLER
    ========================================= */

    let currentImageUrl = "";

    let currentImagePath = "";

    let portfoliosCache = [];


    /* =========================================
       ADMIN OTURUM KONTROLÜ
    ========================================= */

    async function checkAdminSession() {

        const {
            data,
            error
        } = await supabaseClient
            .auth
            .getSession();


        if (error) {

            console.error(
                "Oturum kontrol hatası:",
                error
            );

            return;

        }


        if (!data.session) {

            window.location.href =
                "login.html";

        }

    }


    /* =========================================
       MESAJ GÖSTER
    ========================================= */

    function showMessage(
        message,
        type = "success"
    ) {

        if (!adminMessage) {
            return;
        }


        adminMessage.textContent =
            message;


        adminMessage.className =
            "admin-message show " +
            type;


        clearTimeout(
            window.adminMessageTimeout
        );


        window.adminMessageTimeout =
            setTimeout(
                function () {

                    adminMessage.className =
                        "admin-message";

                },
                4000
            );

    }


    /* =========================================
       NAVIGATION
    ========================================= */

    navButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.target;


                    navButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    sections.forEach(
                        function (section) {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const targetSection =
                        document.getElementById(
                            targetId
                        );


                    if (targetSection) {

                        targetSection.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


    /* =========================================
       DASHBOARD SAYILARI
    ========================================= */

    function updateDashboard() {

        const activeCount =
            portfoliosCache.filter(
                function (portfolio) {

                    return (
                        portfolio.status ===
                        "active"
                    );

                }
            ).length;


        if (totalPortfolio) {

            totalPortfolio.value =
                portfoliosCache.length;

        }


        if (activePortfolio) {

            activePortfolio.value =
                activeCount;

        }

    }


    /* =========================================
       PORTFÖYLERİ SUPABASE'DEN AL
    ========================================= */

    async function loadPortfolios() {

        if (!portfolioList) {
            return;
        }


        portfolioList.innerHTML =
            "<p>Portföyler yükleniyor...</p>";


        const {
            data,
            error
        } = await supabaseClient
            .from("portfolios")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Portföy yükleme hatası:",
                error
            );


            portfolioList.innerHTML = "";


            showMessage(
                "Portföyler yüklenirken hata oluştu: " +
                error.message,
                "error"
            );


            return;

        }


        portfoliosCache =
            data || [];


        renderPortfolios();

    }


    /* =========================================
       PORTFÖYLERİ LİSTELE
    ========================================= */

    function renderPortfolios() {

        if (
            !portfolioList ||
            !portfolioEmptyState
        ) {
            return;
        }


        portfolioList.innerHTML = "";


        if (
            portfoliosCache.length === 0
        ) {

            portfolioEmptyState.style.display =
                "block";


            updateDashboard();

            return;

        }


        portfolioEmptyState.style.display =
            "none";


        portfoliosCache.forEach(
            function (portfolio) {

                const item =
                    document.createElement("div");


                item.className =
                    "portfolio-admin-item";


                const imageUrl =
                    portfolio.image_url || "";


                item.innerHTML = `

                    <div class="portfolio-admin-image">

                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${escapeAttribute(imageUrl)}"
                                        alt="${escapeAttribute(portfolio.title || "")}"
                                    >
                                `
                                : `
                                    <div class="portfolio-admin-no-image">
                                        Görsel Yok
                                    </div>
                                `
                        }

                    </div>


                    <div class="portfolio-admin-content">

                        <h3>
                            ${escapeHtml(
                                portfolio.title || ""
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                portfolio.category || ""
                            )}
                        </p>


                        <p>
                            ${escapeHtml(
                                portfolio.description || ""
                            )}
                        </p>


                        <span
                            class="portfolio-status ${portfolio.status === "active" ? "active" : "inactive"}"
                        >
                            ${
                                portfolio.status === "active"
                                    ? "Aktif"
                                    : "Pasif"
                            }
                        </span>

                    </div>


                    <div class="portfolio-admin-actions">

                        <button
                            type="button"
                            class="admin-secondary-button edit-portfolio"
                            data-id="${portfolio.id}"
                        >
                            Düzenle
                        </button>


                        <button
                            type="button"
                            class="admin-danger-button delete-portfolio"
                            data-id="${portfolio.id}"
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


        updateDashboard();

    }


    /* =========================================
       HTML ESCAPE
    ========================================= */

    function escapeHtml(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value || "";


        return div.innerHTML;

    }


    function escapeAttribute(value) {

        return String(
            value || ""
        )
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    }


    /* =========================================
       YENİ PORTFÖY FORMUNU AÇ
    ========================================= */

    function openNewPortfolioForm() {

        if (portfolioForm) {

            portfolioForm.reset();

        }


        if (portfolioEditId) {

            portfolioEditId.value = "";

        }


        currentImageUrl = "";

        currentImagePath = "";


        if (portfolioImagePreview) {

            portfolioImagePreview.src = "";

            portfolioImagePreview.classList.remove(
                "show"
            );

        }


        if (imageUploadContent) {

            imageUploadContent.style.display =
                "block";

        }


        if (portfolioFormTitle) {

            portfolioFormTitle.textContent =
                "Yeni Portföy Çalışması";

        }


        if (portfolioFormCard) {

            portfolioFormCard.style.display =
                "block";


            portfolioFormCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    if (newPortfolioButton) {

        newPortfolioButton.addEventListener(
            "click",
            openNewPortfolioForm
        );

    }


    /* =========================================
       FORM KAPAT
    ========================================= */

    if (cancelPortfolioButton) {

        cancelPortfolioButton.addEventListener(
            "click",
            function () {

                if (portfolioFormCard) {

                    portfolioFormCard.style.display =
                        "none";

                }

            }
        );

    }


    /* =========================================
       GÖRSEL ÖNİZLEME
    ========================================= */

    if (portfolioImageInput) {

        portfolioImageInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];


                if (!file) {
                    return;
                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showMessage(
                        "Lütfen geçerli bir görsel seçin.",
                        "error"
                    );


                    portfolioImageInput.value =
                        "";


                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (readerEvent) {

                        if (
                            portfolioImagePreview
                        ) {

                            portfolioImagePreview.src =
                                readerEvent.target.result;


                            portfolioImagePreview.classList.add(
                                "show"
                            );

                        }


                        if (
                            imageUploadContent
                        ) {

                            imageUploadContent.style.display =
                                "none";

                        }

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =========================================
       SUPABASE STORAGE GÖRSEL YÜKLE
    ========================================= */

    async function uploadPortfolioImage(
        file
    ) {

        if (!file) {

            return {
                url: currentImageUrl,
                path: currentImagePath
            };

        }


        const fileExtension =
            file.name
                .split(".")
                .pop()
                .toLowerCase();


        const fileName =
            "portfolio/" +
            Date.now() +
            "-" +
            crypto.randomUUID() +
            "." +
            fileExtension;


        const {
            error: uploadError
        } = await supabaseClient
            .storage
            .from("portfolio-images")
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


        const {
            data: publicUrlData
        } = supabaseClient
            .storage
            .from("portfolio-images")
            .getPublicUrl(
                fileName
            );


        return {

            url:
                publicUrlData.publicUrl,

            path:
                fileName

        };

    }


    /* =========================================
       PORTFÖY KAYDET
    ========================================= */

    if (portfolioForm) {

        portfolioForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const submitButton =
                    portfolioForm.querySelector(
                        '[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
                        "Kaydediliyor...";

                }


                try {

                    const editId =
                        portfolioEditId
                            ? portfolioEditId.value
                            : "";


                    const selectedFile =
                        portfolioImageInput &&
                        portfolioImageInput.files.length > 0
                            ? portfolioImageInput.files[0]
                            : null;


                    const imageData =
                        await uploadPortfolioImage(
                            selectedFile
                        );


                    const portfolioData = {

                        title:
                            portfolioTitle
                                ? portfolioTitle.value.trim()
                                : "",

                        category:
                            portfolioCategory
                                ? portfolioCategory.value.trim()
                                : "",

                        description:
                            portfolioDescription
                                ? portfolioDescription.value.trim()
                                : "",

                        project_date:
                            portfolioDate
                                ? portfolioDate.value || null
                                : null,

                        status:
                            portfolioStatus
                                ? portfolioStatus.value
                                : "active",

                        image_url:
                            imageData.url || null,

                        image_path:
                            imageData.path || null

                    };


                    if (editId) {

                        const {
                            error
                        } = await supabaseClient
                            .from("portfolios")
                            .update(
                                portfolioData
                            )
                            .eq(
                                "id",
                                editId
                            );


                        if (error) {

                            throw error;

                        }


                        showMessage(
                            "Portföy çalışması güncellendi.",
                            "success"
                        );

                    } else {

                        const {
                            error
                        } = await supabaseClient
                            .from("portfolios")
                            .insert(
                                portfolioData
                            );


                        if (error) {

                            throw error;

                        }


                        showMessage(
                            "Yeni portföy çalışması eklendi.",
                            "success"
                        );

                    }


                    if (
                        portfolioFormCard
                    ) {

                        portfolioFormCard.style.display =
                            "none";

                    }


                    if (
                        portfolioForm
                    ) {

                        portfolioForm.reset();

                    }


                    currentImageUrl = "";

                    currentImagePath = "";


                    await loadPortfolios();

                } catch (error) {

                    console.error(
                        "Portföy kaydetme hatası:",
                        error
                    );


                    showMessage(
                        "Portföy kaydedilemedi: " +
                        error.message,
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
        );

    }


    /* =========================================
       PORTFÖY DÜZENLE
    ========================================= */

    async function editPortfolio(
        id
    ) {

        const portfolio =
            portfoliosCache.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(
                        id
                    );

                }
            );


        if (!portfolio) {

            showMessage(
                "Portföy bulunamadı.",
                "error"
            );


            return;

        }


        if (portfolioEditId) {

            portfolioEditId.value =
                portfolio.id;

        }


        if (portfolioTitle) {

            portfolioTitle.value =
                portfolio.title || "";

        }


        if (portfolioCategory) {

            portfolioCategory.value =
                portfolio.category || "";

        }


        if (portfolioDescription) {

            portfolioDescription.value =
                portfolio.description || "";

        }


        if (portfolioDate) {

            portfolioDate.value =
                portfolio.project_date || "";

        }


        if (portfolioStatus) {

            portfolioStatus.value =
                portfolio.status || "active";

        }


        currentImageUrl =
            portfolio.image_url || "";


        currentImagePath =
            portfolio.image_path || "";


        if (
            currentImageUrl &&
            portfolioImagePreview
        ) {

            portfolioImagePreview.src =
                currentImageUrl;


            portfolioImagePreview.classList.add(
                "show"
            );


            if (
                imageUploadContent
            ) {

                imageUploadContent.style.display =
                    "none";

            }

        } else {

            if (
                portfolioImagePreview
            ) {

                portfolioImagePreview.src =
                    "";


                portfolioImagePreview.classList.remove(
                    "show"
                );

            }


            if (
                imageUploadContent
            ) {

                imageUploadContent.style.display =
                    "block";

            }

        }


        if (portfolioImageInput) {

            portfolioImageInput.value =
                "";

        }


        if (portfolioFormTitle) {

            portfolioFormTitle.textContent =
                "Portföy Çalışmasını Düzenle";

        }


        if (portfolioFormCard) {

            portfolioFormCard.style.display =
                "block";


            portfolioFormCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =========================================
       PORTFÖY SİL
    ========================================= */

    async function deletePortfolio(
        id
    ) {

        const portfolio =
            portfoliosCache.find(
                function (item) {

                    return String(
                        item.id
                    ) === String(
                        id
                    );

                }
            );


        if (!portfolio) {

            showMessage(
                "Silinecek portföy bulunamadı.",
                "error"
            );


            return;

        }


        const confirmed =
            confirm(
                "Bu portföy çalışmasını silmek istediğine emin misin?"
            );


        if (!confirmed) {
            return;
        }


        try {

            if (
                portfolio.image_path
            ) {

                const {
                    error: storageError
                } = await supabaseClient
                    .storage
                    .from(
                        "portfolio-images"
                    )
                    .remove(
                        [
                            portfolio.image_path
                        ]
                    );


                if (storageError) {

                    console.warn(
                        "Görsel silinemedi:",
                        storageError
                    );

                }

            }


            const {
                error
            } = await supabaseClient
                .from("portfolios")
                .delete()
                .eq(
                    "id",
                    id
                );


            if (error) {

                throw error;

            }


            showMessage(
                "Portföy çalışması silindi.",
                "success"
            );


            await loadPortfolios();

        } catch (error) {

            console.error(
                "Portföy silme hatası:",
                error
            );


            showMessage(
                "Portföy silinemedi: " +
                error.message,
                "error"
            );

        }

    }


    /* =========================================
       EDIT / DELETE EVENT
    ========================================= */

    if (portfolioList) {

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
                        editButton.dataset.id
                    );

                }


                if (deleteButton) {

                    await deletePortfolio(
                        deleteButton.dataset.id
                    );

                }

            }
        );

    }


    /* =========================================
       SITE AYARLARINI YÜKLE
    ========================================= */

    async function loadSiteSettings() {

        const {
            data,
            error
        } = await supabaseClient
            .from("site_settings")
            .select("*")
            .limit(1)
            .maybeSingle();


        if (error) {

            console.error(
                "Site ayarları yükleme hatası:",
                error
            );


            return;

        }


        if (!data) {
            return;
        }


        const siteTitle =
            document.getElementById(
                "siteTitle"
            );

        const heroTitle =
            document.getElementById(
                "heroTitle"
            );

        const heroText =
            document.getElementById(
                "heroText"
            );

        const instagramLink =
            document.getElementById(
                "instagramLink"
            );

        const emailAddress =
            document.getElementById(
                "emailAddress"
            );


        if (siteTitle) {

            siteTitle.value =
                data.site_title || "";

        }


        if (heroTitle) {

            heroTitle.value =
                data.hero_title || "";

        }


        if (heroText) {

            heroText.value =
                data.hero_text || "";

        }


        if (instagramLink) {

            instagramLink.value =
                data.instagram_link || "";

        }


        if (emailAddress) {

            emailAddress.value =
                data.email || "";

        }

    }


    /* =========================================
       SITE AYARLARINI KAYDET
    ========================================= */

    if (siteSettingsForm) {

        siteSettingsForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const siteTitle =
                    document.getElementById(
                        "siteTitle"
                    );

                const heroTitle =
                    document.getElementById(
                        "heroTitle"
                    );

                const heroText =
                    document.getElementById(
                        "heroText"
                    );

                const instagramLink =
                    document.getElementById(
                        "instagramLink"
                    );

                const emailAddress =
                    document.getElementById(
                        "emailAddress"
                    );


                const settingsData = {

                    site_title:
                        siteTitle
                            ? siteTitle.value.trim()
                            : "",

                    hero_title:
                        heroTitle
                            ? heroTitle.value.trim()
                            : "",

                    hero_text:
                        heroText
                            ? heroText.value.trim()
                            : "",

                    instagram_link:
                        instagramLink
                            ? instagramLink.value.trim()
                            : "",

                    email:
                        emailAddress
                            ? emailAddress.value.trim()
                            : ""

                };


                try {

                    const {
                        data: existing,
                        error: checkError
                    } = await supabaseClient
                        .from(
                            "site_settings"
                        )
                        .select("id")
                        .limit(1)
                        .maybeSingle();


                    if (checkError) {

                        throw checkError;

                    }


                    let result;


                    if (existing) {

                        result =
                            await supabaseClient
                                .from(
                                    "site_settings"
                                )
                                .update(
                                    settingsData
                                )
                                .eq(
                                    "id",
                                    existing.id
                                );

                    } else {

                        result =
                            await supabaseClient
                                .from(
                                    "site_settings"
                                )
                                .insert(
                                    settingsData
                                );

                    }


                    if (result.error) {

                        throw result.error;

                    }


                    showMessage(
                        "Site ayarları kaydedildi.",
                        "success"
                    );

                } catch (error) {

                    console.error(
                        "Site ayarları kaydetme hatası:",
                        error
                    );


                    showMessage(
                        "Ayarlar kaydedilemedi: " +
                        error.message,
                        "error"
                    );

                }

            }
        );

    }


    /* =========================================
       İLETİŞİM BİLGİLERİNİ YÜKLE
    ========================================= */

    async function loadContactSettings() {

        const {
            data,
            error
        } = await supabaseClient
            .from("contact_settings")
            .select("*")
            .limit(1)
            .maybeSingle();


        if (error) {

            console.error(
                "İletişim bilgileri yükleme hatası:",
                error
            );


            return;

        }


        if (!data) {
            return;
        }


        const contactEmail =
            document.getElementById(
                "contactEmail"
            );

        const contactPhone =
            document.getElementById(
                "contactPhone"
            );

        const contactAddress =
            document.getElementById(
                "contactAddress"
            );


        if (contactEmail) {

            contactEmail.value =
                data.email || "";

        }


        if (contactPhone) {

            contactPhone.value =
                data.phone || "";

        }


        if (contactAddress) {

            contactAddress.value =
                data.address || "";

        }

    }


    /* =========================================
       İLETİŞİM BİLGİLERİNİ KAYDET
    ========================================= */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const contactEmail =
                    document.getElementById(
                        "contactEmail"
                    );

                const contactPhone =
                    document.getElementById(
                        "contactPhone"
                    );

                const contactAddress =
                    document.getElementById(
                        "contactAddress"
                    );


                const contactData = {

                    email:
                        contactEmail
                            ? contactEmail.value.trim()
                            : "",

                    phone:
                        contactPhone
                            ? contactPhone.value.trim()
                            : "",

                    address:
                        contactAddress
                            ? contactAddress.value.trim()
                            : ""

                };


                try {

                    const {
                        data: existing,
                        error: checkError
                    } = await supabaseClient
                        .from(
                            "contact_settings"
                        )
                        .select("id")
                        .limit(1)
                        .maybeSingle();


                    if (checkError) {

                        throw checkError;

                    }


                    let result;


                    if (existing) {

                        result =
                            await supabaseClient
                                .from(
                                    "contact_settings"
                                )
                                .update(
                                    contactData
                                )
                                .eq(
                                    "id",
                                    existing.id
                                );

                    } else {

                        result =
                            await supabaseClient
                                .from(
                                    "contact_settings"
                                )
                                .insert(
                                    contactData
                                );

                    }


                    if (result.error) {

                        throw result.error;

                    }


                    showMessage(
                        "İletişim bilgileri kaydedildi.",
                        "success"
                    );

                } catch (error) {

                    console.error(
                        "İletişim kaydetme hatası:",
                        error
                    );


                    showMessage(
                        "İletişim bilgileri kaydedilemedi: " +
                        error.message,
                        "error"
                    );

                }

            }
        );

    }


   /* =========================================
   LOGOUT
========================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                logoutButton.disabled = true;

                logoutButton.textContent =
                    "Çıkış yapılıyor...";


                const {
                    error
                } = await supabaseClient.auth.signOut();


                if (error) {

                    throw error;

                }


                /*
                Eski localStorage verilerini temizle
                */

                localStorage.removeItem(
                    "furkanKayaAdminLoggedIn"
                );


                /*
                Admin sayfasından çık
                */

                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Çıkış yapılırken hata oluştu:",
                    error
                );


                showMessage(
                    "Çıkış yapılırken bir hata oluştu: " +
                    error.message,
                    "error"
                );


                logoutButton.disabled = false;

                logoutButton.textContent =
                    "Çıkış Yap";

            }

        }
    );

}


    /* =========================================
       BAŞLAT
    ========================================= */

    try {

        await checkAdminSession();

        await Promise.all([
            loadPortfolios(),
            loadSiteSettings(),
            loadContactSettings()
        ]);

    } catch (error) {

        console.error(
            "Admin panel başlatma hatası:",
            error
        );


        showMessage(
            "Admin paneli yüklenirken hata oluştu.",
            "error"
        );

    }

});
