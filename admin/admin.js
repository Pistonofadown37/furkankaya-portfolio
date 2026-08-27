/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
========================================= */


/* =========================================
   GLOBAL VARIABLES
========================================= */

let currentPortfolioImageUrl = "";
let currentLogoUrl = "";


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            console.log(
                "Admin panel başlatılıyor..."
            );


            /*
            SUPABASE KONTROLÜ
            */

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                throw new Error(
                    "Supabase bağlantısı bulunamadı. admin/supabase.js dosyasını kontrol edin."
                );

            }


            /*
            SESSION KONTROLÜ
            */

            const {
                data: sessionData,
                error: sessionError
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (
                sessionError
            ) {

                throw sessionError;

            }


            if (
                !sessionData.session
            ) {

                window.location.replace(
                    "login.html"
                );

                return;

            }


            /*
            ADMIN PANELİNİ BAŞLAT
            */

            initializeAdminPanel();


        } catch (error) {

            console.error(
                "ADMIN PANEL BAŞLATMA HATASI:",
                error
            );


            console.error(
                "HATA MESAJI:",
                error.message
            );


            showGlobalMessage(
                "Admin paneli yüklenirken hata oluştu: " +
                (
                    error.message ||
                    "Bilinmeyen hata"
                ),
                "error"
            );

        }

    }
);


/* =========================================
   ADMIN PANEL INITIALIZE
========================================= */

function initializeAdminPanel() {

    console.log(
        "Admin panel initialize edildi."
    );


    initializeNavigation();

    initializeLogout();

    initializePortfolio();

    initializeSiteSettings();

    initializeContactSettings();

    loadDashboard();


}


/* =========================================
   GLOBAL MESSAGE
========================================= */

function showGlobalMessage(
    message,
    type
) {

    const adminMessage =
        document.getElementById(
            "adminMessage"
        );


    if (!adminMessage) {

        console.error(
            message
        );

        return;

    }


    adminMessage.textContent =
        message;


    adminMessage.className =
        "admin-message show " +
        type;


    setTimeout(
        function () {

            adminMessage.className =
                "admin-message";

        },
        5000
    );

}


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {

    const navButtons =
        document.querySelectorAll(
            ".admin-nav-button"
        );


    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


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


                    if (
                        targetSection
                    ) {

                        targetSection.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   DASHBOARD
========================================= */

async function loadDashboard() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("portfolios")
                .select(
                    "id, status"
                );


        if (
            error
        ) {

            throw error;

        }


        const portfolios =
            data || [];


        const activePortfolios =
            portfolios.filter(
                function (item) {

                    return (
                        item.status ===
                        "active"
                    );

                }
            );


        const totalPortfolio =
            document.getElementById(
                "totalPortfolio"
            );


        const activePortfolio =
            document.getElementById(
                "activePortfolio"
            );


        if (
            totalPortfolio
        ) {

            totalPortfolio.value =
                portfolios.length;

        }


        if (
            activePortfolio
        ) {

            activePortfolio.value =
                activePortfolios.length;

        }


    } catch (error) {

        console.error(
            "Dashboard yükleme hatası:",
            error
        );

    }

}


/* =========================================
   PORTFOLIO INITIALIZE
========================================= */

function initializePortfolio() {

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


    const portfolioList =
        document.getElementById(
            "portfolioList"
        );


    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    /*
    PORTFÖYLERİ YÜKLE
    */

    loadPortfolios();


    /*
    YENİ ÇALIŞMA
    */

    if (
        newPortfolioButton
    ) {

        newPortfolioButton.addEventListener(
            "click",
            function () {

                openNewPortfolioForm();

            }
        );

    }


    /*
    İPTAL
    */

    if (
        cancelPortfolioButton
    ) {

        cancelPortfolioButton.addEventListener(
            "click",
            function () {

                closePortfolioForm();

            }
        );

    }


    /*
    GÖRSEL SEÇİMİ
    */

    if (
        portfolioImageInput
    ) {

        portfolioImageInput.addEventListener(
            "change",
            handlePortfolioImagePreview
        );

    }


    /*
    FORM KAYDET
    */

    if (
        portfolioForm
    ) {

        portfolioForm.addEventListener(
            "submit",
            savePortfolio
        );

    }


    /*
    DÜZENLE / SİL
    */

    if (
        portfolioList
    ) {

        portfolioList.addEventListener(
            "click",
            handlePortfolioActions
        );

    }

}


/* =========================================
   LOAD PORTFOLIOS
========================================= */

async function loadPortfolios() {

    const portfolioList =
        document.getElementById(
            "portfolioList"
        );


    const portfolioEmptyState =
        document.getElementById(
            "portfolioEmptyState"
        );


    if (
        !portfolioList
    ) {

        return;

    }


    try {

        portfolioList.innerHTML = "";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("portfolios")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (
            error
        ) {

            throw error;

        }


        const portfolios =
            data || [];


        if (
            portfolios.length === 0
        ) {

            if (
                portfolioEmptyState
            ) {

                portfolioEmptyState.style.display =
                    "block";

            }


            return;

        }


        if (
            portfolioEmptyState
        ) {

            portfolioEmptyState.style.display =
                "none";

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
                    portfolio.image ||
                    "";


                const title =
                    portfolio.title ||
                    "";


                const category =
                    portfolio.category ||
                    "";


                const description =
                    portfolio.description ||
                    "";


                const status =
                    portfolio.status ||
                    "active";


                item.innerHTML = `

                    <div
                        class="portfolio-admin-image"
                    >

                        ${
                            imageUrl
                                ? `
                                    <img
                                        src="${escapeAttribute(imageUrl)}"
                                        alt="${escapeAttribute(title)}"
                                    >
                                `
                                : `
                                    <div
                                        class="portfolio-no-image"
                                    >
                                        Görsel Yok
                                    </div>
                                `
                        }

                    </div>


                    <div
                        class="portfolio-admin-content"
                    >

                        <h3>
                            ${escapeHtml(title)}
                        </h3>


                        <p>
                            ${escapeHtml(category)}
                        </p>


                        <p>
                            ${escapeHtml(description)}
                        </p>


                        <span
                            class="portfolio-status ${escapeAttribute(status)}"
                        >
                            ${
                                status === "active"
                                    ? "Aktif"
                                    : "Pasif"
                            }
                        </span>

                    </div>


                    <div
                        class="portfolio-admin-actions"
                    >

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


        await loadDashboard();


    } catch (error) {

        console.error(
            "Portföy yükleme hatası:",
            error
        );


        showGlobalMessage(
            "Portföyler yüklenemedi: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   NEW PORTFOLIO FORM
========================================= */

function openNewPortfolioForm() {

    const portfolioForm =
        document.getElementById(
            "portfolioForm"
        );


    const portfolioFormCard =
        document.getElementById(
            "portfolioFormCard"
        );


    const portfolioEditId =
        document.getElementById(
            "portfolioEditId"
        );


    const portfolioFormTitle =
        document.getElementById(
            "portfolioFormTitle"
        );


    const portfolioImagePreview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const imageUploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    if (
        portfolioForm
    ) {

        portfolioForm.reset();

    }


    if (
        portfolioEditId
    ) {

        portfolioEditId.value =
            "";

    }


    currentPortfolioImageUrl =
        "";


    if (
        portfolioFormTitle
    ) {

        portfolioFormTitle.textContent =
            "Yeni Portföy Çalışması";

    }


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


    if (
        portfolioFormCard
    ) {

        portfolioFormCard.style.display =
            "block";


        portfolioFormCard.scrollIntoView(
            {
                behavior: "smooth",
                block: "start"
            }
        );

    }

}


/* =========================================
   CLOSE PORTFOLIO FORM
========================================= */

function closePortfolioForm() {

    const portfolioFormCard =
        document.getElementById(
            "portfolioFormCard"
        );


    if (
        portfolioFormCard
    ) {

        portfolioFormCard.style.display =
            "none";

    }

}


/* =========================================
   IMAGE PREVIEW
========================================= */

function handlePortfolioImagePreview(
    event
) {

    const file =
        event.target.files[0];


    if (
        !file
    ) {

        return;

    }


    const portfolioImagePreview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const imageUploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            if (
                portfolioImagePreview
            ) {

                portfolioImagePreview.src =
                    e.target.result;


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


/* =========================================
   UPLOAD PORTFOLIO IMAGE
========================================= */

async function uploadPortfolioImage(
    file
) {

    if (
        !file
    ) {

        return currentPortfolioImageUrl;

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "portfolio/" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10) +
        "." +
        extension;


    const {
        error: uploadError
    } =
        await supabaseClient
            .storage
            .from("portfolio-images")
            .upload(
                fileName,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (
        uploadError
    ) {

        throw uploadError;

    }


    const {
        data: publicUrlData
    } =
        supabaseClient
            .storage
            .from("portfolio-images")
            .getPublicUrl(
                fileName
            );


    if (
        !publicUrlData ||
        !publicUrlData.publicUrl
    ) {

        throw new Error(
            "Görselin public URL adresi alınamadı."
        );

    }


    return publicUrlData.publicUrl;

}


/* =========================================
   SAVE PORTFOLIO
========================================= */

async function savePortfolio(
    event
) {

    event.preventDefault();


    const portfolioEditId =
        document.getElementById(
            "portfolioEditId"
        );


    const portfolioTitle =
        document.getElementById(
            "portfolioTitle"
        );


    const portfolioCategory =
        document.getElementById(
            "portfolioCategory"
        );


    const portfolioDescription =
        document.getElementById(
            "portfolioDescription"
        );


    const portfolioDate =
        document.getElementById(
            "portfolioDate"
        );


    const portfolioStatus =
        document.getElementById(
            "portfolioStatus"
        );


    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    const submitButton =
        event.target.querySelector(
            'button[type="submit"]'
        );


    try {

        if (
            !portfolioTitle ||
            !portfolioTitle.value.trim()
        ) {

            throw new Error(
                "Proje başlığı zorunludur."
            );

        }


        if (
            submitButton
        ) {

            submitButton.disabled =
                true;


            submitButton.textContent =
                "Kaydediliyor...";

        }


        const editId =
            portfolioEditId
                ? portfolioEditId.value
                : "";


        let imageUrl =
            currentPortfolioImageUrl;


        const selectedFile =
            portfolioImageInput &&
            portfolioImageInput.files
                ? portfolioImageInput.files[0]
                : null;


        if (
            selectedFile
        ) {

            imageUrl =
                await uploadPortfolioImage(
                    selectedFile
                );

        }


        const portfolioData = {

            title:
                portfolioTitle.value.trim(),

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
                    ? portfolioDate.value ||
                      null
                    : null,

            status:
                portfolioStatus
                    ? portfolioStatus.value
                    : "active",

            image_url:
                imageUrl

        };


        if (
            editId
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("portfolios")
                    .update(
                        portfolioData
                    )
                    .eq(
                        "id",
                        editId
                    );


            if (
                error
            ) {

                throw error;

            }


            showGlobalMessage(
                "Portföy çalışması güncellendi.",
                "success"
            );


        } else {

            const {
                error
            } =
                await supabaseClient
                    .from("portfolios")
                    .insert(
                        portfolioData
                    );


            if (
                error
            ) {

                throw error;

            }


            showGlobalMessage(
                "Yeni portföy çalışması eklendi.",
                "success"
            );

        }


        closePortfolioForm();


        await loadPortfolios();


    } catch (error) {

        console.error(
            "Portföy kaydetme hatası:",
            error
        );


        showGlobalMessage(
            "Portföy kaydedilemedi: " +
            error.message,
            "error"
        );


    } finally {

        if (
            submitButton
        ) {

            submitButton.disabled =
                false;


            submitButton.textContent =
                "Kaydet";

        }

    }

}


/* =========================================
   PORTFOLIO ACTIONS
========================================= */

async function handlePortfolioActions(
    event
) {

    const editButton =
        event.target.closest(
            ".edit-portfolio"
        );


    const deleteButton =
        event.target.closest(
            ".delete-portfolio"
        );


    /*
    EDIT
    */

    if (
        editButton
    ) {

        const id =
            editButton.dataset.id;


        await editPortfolio(
            id
        );

        return;

    }


    /*
    DELETE
    */

    if (
        deleteButton
    ) {

        const id =
            deleteButton.dataset.id;


        const confirmed =
            confirm(
                "Bu portföy çalışmasını silmek istediğine emin misin?"
            );


        if (
            !confirmed
        ) {

            return;

        }


        await deletePortfolio(
            id
        );

    }

}


/* =========================================
   EDIT PORTFOLIO
========================================= */

async function editPortfolio(
    id
) {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("portfolios")
                .select("*")
                .eq(
                    "id",
                    id
                )
                .single();


        if (
            error
        ) {

            throw error;

        }


        const portfolio =
            data;


        const portfolioEditId =
            document.getElementById(
                "portfolioEditId"
            );


        const portfolioTitle =
            document.getElementById(
                "portfolioTitle"
            );


        const portfolioCategory =
            document.getElementById(
                "portfolioCategory"
            );


        const portfolioDescription =
            document.getElementById(
                "portfolioDescription"
            );


        const portfolioDate =
            document.getElementById(
                "portfolioDate"
            );


        const portfolioStatus =
            document.getElementById(
                "portfolioStatus"
            );


        const portfolioImagePreview =
            document.getElementById(
                "portfolioImagePreview"
            );


        const imageUploadContent =
            document.getElementById(
                "imageUploadContent"
            );


        const portfolioFormCard =
            document.getElementById(
                "portfolioFormCard"
            );


        const portfolioFormTitle =
            document.getElementById(
                "portfolioFormTitle"
            );


        if (
            portfolioEditId
        ) {

            portfolioEditId.value =
                portfolio.id;

        }


        if (
            portfolioTitle
        ) {

            portfolioTitle.value =
                portfolio.title ||
                "";

        }


        if (
            portfolioCategory
        ) {

            portfolioCategory.value =
                portfolio.category ||
                "";

        }


        if (
            portfolioDescription
        ) {

            portfolioDescription.value =
                portfolio.description ||
                "";

        }


        if (
            portfolioDate
        ) {

            portfolioDate.value =
                portfolio.project_date ||
                portfolio.date ||
                "";

        }


        if (
            portfolioStatus
        ) {

            portfolioStatus.value =
                portfolio.status ||
                "active";

        }


        currentPortfolioImageUrl =
            portfolio.image_url ||
            portfolio.image ||
            "";


        if (
            currentPortfolioImageUrl &&
            portfolioImagePreview
        ) {

            portfolioImagePreview.src =
                currentPortfolioImageUrl;


            portfolioImagePreview.classList.add(
                "show"
            );


            if (
                imageUploadContent
            ) {

                imageUploadContent.style.display =
                    "none";

            }

        }


        if (
            portfolioFormTitle
        ) {

            portfolioFormTitle.textContent =
                "Portföy Çalışmasını Düzenle";

        }


        if (
            portfolioFormCard
        ) {

            portfolioFormCard.style.display =
                "block";


            portfolioFormCard.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "start"
                }
            );

        }


    } catch (error) {

        console.error(
            "Portföy düzenleme hatası:",
            error
        );


        showGlobalMessage(
            "Portföy açılamadı: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   DELETE PORTFOLIO
========================================= */

async function deletePortfolio(
    id
) {

    try {

        const {
            error
        } =
            await supabaseClient
                .from("portfolios")
                .delete()
                .eq(
                    "id",
                    id
                );


        if (
            error
        ) {

            throw error;

        }


        showGlobalMessage(
            "Portföy çalışması silindi.",
            "success"
        );


        await loadPortfolios();


    } catch (error) {

        console.error(
            "Portföy silme hatası:",
            error
        );


        showGlobalMessage(
            "Portföy silinemedi: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   SITE SETTINGS INITIALIZE
========================================= */

function initializeSiteSettings() {

    const form =
        document.getElementById(
            "siteSettingsForm"
        );


    const logoInput =
        document.getElementById(
            "siteLogoInput"
        );


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            saveSiteSettings
        );

    }


    if (
        logoInput
    ) {

        logoInput.addEventListener(
            "change",
            handleLogoPreview
        );

    }


    loadSiteSettings();

}


/* =========================================
   LOAD SITE SETTINGS
========================================= */

async function loadSiteSettings() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("site_settings")
                .select("*")
                .limit(1);


        if (
            error
        ) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            return;

        }


        const settings =
            data[0];


        setInputValue(
            "siteTitle",
            settings.site_title ||
            settings.siteTitle ||
            ""
        );


        setInputValue(
            "heroTitle",
            settings.hero_title ||
            settings.heroTitle ||
            ""
        );


        setInputValue(
            "heroText",
            settings.hero_text ||
            settings.heroText ||
            ""
        );


        setInputValue(
            "instagramLink",
            settings.instagram_link ||
            settings.instagramLink ||
            ""
        );


        setInputValue(
            "emailAddress",
            settings.email ||
            settings.email_address ||
            settings.emailAddress ||
            ""
        );


        currentLogoUrl =
            settings.logo_url ||
            settings.logo ||
            "";


        showLogoPreview(
            currentLogoUrl
        );


    } catch (error) {

        console.error(
            "Site ayarları yükleme hatası:",
            error
        );


        showGlobalMessage(
            "Site ayarları yüklenemedi: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   HANDLE LOGO PREVIEW
========================================= */

function handleLogoPreview(
    event
) {

    const file =
        event.target.files[0];


    if (
        !file
    ) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (e) {

            showLogoPreview(
                e.target.result
            );

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================================
   SHOW LOGO PREVIEW
========================================= */

function showLogoPreview(
    imageUrl
) {

    const preview =
        document.getElementById(
            "siteLogoPreview"
        );


    const previewContainer =
        document.getElementById(
            "siteLogoPreviewContainer"
        );


    if (
        !preview ||
        !imageUrl
    ) {

        return;

    }


    preview.src =
        imageUrl;


    if (
        previewContainer
    ) {

        previewContainer.style.display =
            "block";

    }


    preview.style.display =
        "block";

}


/* =========================================
   UPLOAD LOGO
========================================= */

async function uploadLogo(
    file
) {

    if (
        !file
    ) {

        return currentLogoUrl;

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "logo/site-logo-" +
        Date.now() +
        "." +
        extension;


    const {
        error: uploadError
    } =
        await supabaseClient
            .storage
            .from("portfolio-images")
            .upload(
                fileName,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        true
                }
            );


    if (
        uploadError
    ) {

        throw uploadError;

    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from("portfolio-images")
            .getPublicUrl(
                fileName
            );


    return data.publicUrl;

}


/* =========================================
   SAVE SITE SETTINGS
========================================= */

async function saveSiteSettings(
    event
) {

    event.preventDefault();


    const submitButton =
        event.target.querySelector(
            'button[type="submit"]'
        );


    try {

        if (
            submitButton
        ) {

            submitButton.disabled =
                true;

        }


        const logoInput =
            document.getElementById(
                "siteLogoInput"
            );


        const logoFile =
            logoInput &&
            logoInput.files
                ? logoInput.files[0]
                : null;


        if (
            logoFile
        ) {

            currentLogoUrl =
                await uploadLogo(
                    logoFile
                );

        }


        const settingsData = {

            site_title:
                getInputValue(
                    "siteTitle"
                ),

            hero_title:
                getInputValue(
                    "heroTitle"
                ),

            hero_text:
                getInputValue(
                    "heroText"
                ),

            instagram_link:
                getInputValue(
                    "instagramLink"
                ),

            email:
                getInputValue(
                    "emailAddress"
                ),

            logo_url:
                currentLogoUrl

        };


        const {
            data: existing,
            error: selectError
        } =
            await supabaseClient
                .from("site_settings")
                .select("id")
                .limit(1);


        if (
            selectError
        ) {

            throw selectError;

        }


        if (
            existing &&
            existing.length > 0
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("site_settings")
                    .update(
                        settingsData
                    )
                    .eq(
                        "id",
                        existing[0].id
                    );


            if (
                error
            ) {

                throw error;

            }


        } else {

            const {
                error
            } =
                await supabaseClient
                    .from("site_settings")
                    .insert(
                        settingsData
                    );


            if (
                error
            ) {

                throw error;

            }

        }


        showGlobalMessage(
            "Site ayarları başarıyla kaydedildi.",
            "success"
        );


    } catch (error) {

        console.error(
            "Site ayarları kaydetme hatası:",
            error
        );


        showGlobalMessage(
            "Site ayarları kaydedilemedi: " +
            error.message,
            "error"
        );


    } finally {

        if (
            submitButton
        ) {

            submitButton.disabled =
                false;

        }

    }

}


/* =========================================
   CONTACT INITIALIZE
========================================= */

function initializeContactSettings() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (
        form
    ) {

        form.addEventListener(
            "submit",
            saveContactSettings
        );

    }


    loadContactSettings();

}


/* =========================================
   LOAD CONTACT SETTINGS
========================================= */

async function loadContactSettings() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("contact_settings")
                .select("*")
                .limit(1);


        if (
            error
        ) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            return;

        }


        const contact =
            data[0];


        setInputValue(
            "contactEmail",
            contact.email ||
            ""
        );


        setInputValue(
            "contactPhone",
            contact.phone ||
            ""
        );


        setInputValue(
            "contactAddress",
            contact.address ||
            ""
        );


    } catch (error) {

        console.error(
            "İletişim bilgileri yükleme hatası:",
            error
        );

    }

}


/* =========================================
   SAVE CONTACT SETTINGS
========================================= */

async function saveContactSettings(
    event
) {

    event.preventDefault();


    try {

        const contactData = {

            email:
                getInputValue(
                    "contactEmail"
                ),

            phone:
                getInputValue(
                    "contactPhone"
                ),

            address:
                getInputValue(
                    "contactAddress"
                )

        };


        const {
            data: existing,
            error: selectError
        } =
            await supabaseClient
                .from("contact_settings")
                .select("id")
                .limit(1);


        if (
            selectError
        ) {

            throw selectError;

        }


        if (
            existing &&
            existing.length > 0
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from("contact_settings")
                    .update(
                        contactData
                    )
                    .eq(
                        "id",
                        existing[0].id
                    );


            if (
                error
            ) {

                throw error;

            }


        } else {

            const {
                error
            } =
                await supabaseClient
                    .from("contact_settings")
                    .insert(
                        contactData
                    );


            if (
                error
            ) {

                throw error;

            }

        }


        showGlobalMessage(
            "İletişim bilgileri kaydedildi.",
            "success"
        );


    } catch (error) {

        console.error(
            "İletişim kaydetme hatası:",
            error
        );


        showGlobalMessage(
            "İletişim bilgileri kaydedilemedi: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   LOGOUT
========================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (
        !logoutButton
    ) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                logoutButton.disabled =
                    true;


                logoutButton.textContent =
                    "Çıkış yapılıyor...";


                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signOut();


                if (
                    error
                ) {

                    throw error;

                }


                window.location.replace(
                    "login.html"
                );


            } catch (error) {

                console.error(
                    "Çıkış hatası:",
                    error
                );


                showGlobalMessage(
                    "Çıkış yapılırken hata oluştu: " +
                    error.message,
                    "error"
                );


                logoutButton.disabled =
                    false;


                logoutButton.textContent =
                    "Çıkış Yap";

            }

        }
    );

}


/* =========================================
   HELPER: GET INPUT VALUE
========================================= */

function getInputValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return "";

    }


    return element.value.trim();

}


/* =========================================
   HELPER: SET INPUT VALUE
========================================= */

function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return;

    }


    element.value =
        value || "";

}


/* =========================================
   HELPER: ESCAPE HTML
========================================= */

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


/* =========================================
   HELPER: ESCAPE ATTRIBUTE
========================================= */

function escapeAttribute(
    text
) {

    return escapeHtml(
        text
    ).replace(
        /"/g,
        "&quot;"
    );

}
