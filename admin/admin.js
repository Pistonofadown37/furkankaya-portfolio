/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
   SUPABASE + PORTFOLIO MANAGEMENT
========================================= */


/* =========================================
   SUPABASE BAĞLANTISI
========================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


if (!window.supabaseClient) {

    window.supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

}


const supabaseClient =
    window.supabaseClient;


/* =========================================
   AYARLAR
========================================= */

const PORTFOLIO_BUCKET =
    "portfolio-images";


const PORTFOLIO_TABLE =
    "portfolios";


/* =========================================
   GLOBAL DEĞİŞKENLER
========================================= */

let selectedPortfolioImage = null;

let currentPortfolioImageUrl = "";

let currentEditingPortfolioId = null;

let adminMessageTimeout = null;


/* =========================================
   DOM HAZIR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        initializeAdminNavigation();

        initializeSidebarToggle();

        initializeLogout();

        initializePortfolioModal();

        initializePortfolioForm();

        initializePortfolioImageUpload();

        initializePortfolioActions();

        initializeQuickActions();

        await checkAdminSession();

        await loadPortfolios();

    }
);


/* =========================================
   ADMIN SESSION KONTROL
========================================= */

async function checkAdminSession() {

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
                "Session kontrol hatası:",
                error
            );

            return;

        }


        if (
            !data ||
            !data.session
        ) {

            window.location.href =
                "login.html";

        }

    } catch (error) {

        console.error(
            "Oturum kontrolünde hata:",
            error
        );

        window.location.href =
            "login.html";

    }

}


/* =========================================
   ADMIN NAVIGATION
========================================= */

function initializeAdminNavigation() {

    const navButtons =
        document.querySelectorAll(
            ".admin-nav-item"
        );


    const sections =
        document.querySelectorAll(
            ".admin-section"
        );


    const pageTitle =
        document.getElementById(
            "adminPageTitle"
        );


    const pageEyebrow =
        document.getElementById(
            "adminPageEyebrow"
        );


    function changeSection(
        targetId
    ) {

        if (!targetId) {

            return;

        }


        const targetSection =
            document.getElementById(
                targetId
            );


        if (!targetSection) {

            console.warn(
                "Bölüm bulunamadı:",
                targetId
            );

            return;

        }


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


        const activeButton =
            document.querySelector(
                '.admin-nav-item[data-section="' +
                targetId +
                '"]'
            );


        if (activeButton) {

            activeButton.classList.add(
                "active"
            );

        }


        targetSection.classList.add(
            "active"
        );


        const sectionTitle =
            targetSection.dataset.title ||
            targetSection.querySelector(
                "h2"
            )?.textContent;


        if (
            pageTitle &&
            sectionTitle
        ) {

            pageTitle.textContent =
                sectionTitle.trim();

        }


        if (
            pageEyebrow &&
            activeButton
        ) {

            pageEyebrow.textContent =
                activeButton.textContent
                    .trim()
                    .toUpperCase();

        }


        if (
            window.innerWidth <= 850
        ) {

            const sidebar =
                document.querySelector(
                    ".admin-sidebar"
                );


            if (sidebar) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }


        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );

    }


    navButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    changeSection(
                        button.dataset.section
                    );

                }
            );

        }
    );


    window.changeAdminSection =
        changeSection;

}


/* =========================================
   SIDEBAR MOBILE TOGGLE
========================================= */

function initializeSidebarToggle() {

    const sidebarToggle =
        document.getElementById(
            "sidebarToggle"
        );


    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    if (
        !sidebarToggle ||
        !sidebar
    ) {

        return;

    }


    sidebarToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "active"
            );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth > 850
            ) {

                return;

            }


            const clickedInsideSidebar =
                sidebar.contains(
                    event.target
                );


            const clickedToggle =
                sidebarToggle.contains(
                    event.target
                );


            if (
                !clickedInsideSidebar &&
                !clickedToggle
            ) {

                sidebar.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   QUICK ACTIONS
========================================= */

function initializeQuickActions() {

    const quickActions =
        document.querySelectorAll(
            "[data-go-section]"
        );


    quickActions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.goSection;


                    if (
                        targetId &&
                        window.changeAdminSection
                    ) {

                        window.changeAdminSection(
                            targetId
                        );

                    }


                    if (
                        button.dataset.action ===
                        "addPortfolio"
                    ) {

                        setTimeout(
                            function () {

                                openNewPortfolioModal();

                            },
                            200
                        );

                    }

                }
            );

        }
    );

}


/* =========================================
   PORTFÖYLERİ YÜKLE
========================================= */

async function loadPortfolios() {

    const portfolioList =
        document.getElementById(
            "adminPortfolioList"
        );


    const portfolioEmptyState =
        document.getElementById(
            "portfolioEmptyState"
        );


    if (!portfolioList) {

        console.error(
            "adminPortfolioList bulunamadı."
        );

        return;

    }


    portfolioList.innerHTML =
        `
        <div class="admin-loading">
            Portföyler yükleniyor...
        </div>
        `;


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
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        const portfolios =
            Array.isArray(data)
                ? data
                : [];


        renderPortfolios(
            portfolios
        );


        updateDashboard(
            portfolios
        );


        if (portfolioEmptyState) {

            portfolioEmptyState.style.display =
                portfolios.length === 0
                    ? "block"
                    : "none";

        }

    } catch (error) {

        console.error(
            "Portföyler yüklenirken hata:",
            error
        );


        portfolioList.innerHTML =
            `
            <div class="admin-empty-state">
                <div>
                    <strong>
                        Portföyler yüklenirken hata oluştu.
                    </strong>
                    <br>
                    <small>
                        ${escapeHtml(
                            error.message ||
                            "Bilinmeyen hata"
                        )}
                    </small>
                </div>
            </div>
            `;


        showMessage(
            "Portföyler yüklenirken hata oluştu.",
            "error"
        );

    }

}


/* =========================================
   PORTFÖYLERİ EKRANA YAZ
========================================= */

function renderPortfolios(
    portfolios
) {

    const portfolioList =
        document.getElementById(
            "adminPortfolioList"
        );


    const portfolioEmptyState =
        document.getElementById(
            "portfolioEmptyState"
        );


    if (!portfolioList) {

        return;

    }


    portfolioList.innerHTML = "";


    if (
        !portfolios ||
        portfolios.length === 0
    ) {

        if (portfolioEmptyState) {

            portfolioEmptyState.style.display =
                "block";

        }

        return;

    }


    if (portfolioEmptyState) {

        portfolioEmptyState.style.display =
            "none";

    }


    portfolios.forEach(
        function (portfolio) {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "admin-portfolio-card";


            const imageUrl =
                getPortfolioImageUrl(
                    portfolio
                );


            const imageHtml =
                imageUrl
                    ? `
                        <img
                            src="${escapeAttribute(
                                imageUrl
                            )}"
                            alt="${escapeAttribute(
                                portfolio.title ||
                                "Portföy görseli"
                            )}"
                        >
                    `
                    : `
                        <div
                            class="portfolio-admin-no-image"
                        >
                            GÖRSEL YOK
                        </div>
                    `;


            const status =
                portfolio.status ||
                "active";


            const statusText =
                status === "active"
                    ? "Aktif"
                    : "Pasif";


            item.innerHTML =
                `
                <div class="admin-portfolio-image">

                    ${imageHtml}

                </div>


                <div class="admin-portfolio-content">

                    <div
                        class="portfolio-admin-meta"
                    >
                        <span
                            class="portfolio-status ${escapeAttribute(
                                status
                            )}"
                        >
                            ${statusText}
                        </span>
                    </div>


                    <h3>
                        ${escapeHtml(
                            portfolio.title ||
                            "İsimsiz Çalışma"
                        )}
                    </h3>


                    ${
                        portfolio.category
                            ? `
                                <p
                                    class="portfolio-admin-category"
                                >
                                    ${escapeHtml(
                                        portfolio.category
                                    )}
                                </p>
                            `
                            : ""
                    }


                    ${
                        portfolio.description
                            ? `
                                <p>
                                    ${escapeHtml(
                                        portfolio.description
                                    )}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div
                    class="admin-portfolio-actions"
                >

                    <button
                        type="button"
                        class="portfolio-edit-button edit-portfolio"
                        data-id="${escapeAttribute(
                            portfolio.id
                        )}"
                    >
                        Düzenle
                    </button>


                    <button
                        type="button"
                        class="portfolio-delete-button delete-portfolio"
                        data-id="${escapeAttribute(
                            portfolio.id
                        )}"
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
   PORTFÖY GÖRSEL URL BUL
========================================= */

function getPortfolioImageUrl(
    portfolio
) {

    const possibleKeys = [

        "image_url",
        "image",
        "imageUrl",
        "thumbnail_url",
        "thumbnail"

    ];


    for (
        let i = 0;
        i < possibleKeys.length;
        i++
    ) {

        const key =
            possibleKeys[i];


        if (
            portfolio[key] &&
            String(
                portfolio[key]
            ).trim() !== ""
        ) {

            return portfolio[key];

        }

    }


    return "";

}


/* =========================================
   DASHBOARD SAYILARI
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


    const total =
        portfolios.length;


    const active =
        portfolios.filter(
            function (portfolio) {

                return (
                    portfolio.status === "active" ||
                    portfolio.status === true ||
                    portfolio.status === "aktif"
                );

            }
        ).length;


    if (totalPortfolio) {

        totalPortfolio.textContent =
            total;

    }


    if (activePortfolio) {

        activePortfolio.textContent =
            active;

    }

}


/* =========================================
   PORTFÖY MODAL BAŞLAT
========================================= */

function initializePortfolioModal() {

    const newPortfolioButton =
        document.getElementById(
            "newPortfolioButton"
        );


    const modal =
        document.getElementById(
            "portfolioModal"
        );


    const closeButton =
        document.getElementById(
            "closePortfolioModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelPortfolioModal"
        );


    const overlay =
        modal
            ? modal.querySelector(
                ".modal-overlay"
            )
            : null;


    if (newPortfolioButton) {

        newPortfolioButton.addEventListener(
            "click",
            function () {

                openNewPortfolioModal();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closePortfolioModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closePortfolioModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closePortfolioModal
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closePortfolioModal();

            }

        }
    );

}


/* =========================================
   YENİ PORTFÖY MODALINI AÇ
========================================= */

function openNewPortfolioModal() {

    const modal =
        document.getElementById(
            "portfolioModal"
        );


    const portfolioForm =
        document.getElementById(
            "portfolioForm"
        );


    const modalTitle =
        document.getElementById(
            "portfolioModalTitle"
        );


    const existingImageUrl =
        document.getElementById(
            "existingImageUrl"
        );


    if (!modal) {

        console.error(
            "portfolioModal bulunamadı."
        );

        return;

    }


    if (portfolioForm) {

        portfolioForm.reset();

    }


    currentEditingPortfolioId =
        null;


    currentPortfolioImageUrl =
        "";


    selectedPortfolioImage =
        null;


    if (existingImageUrl) {

        existingImageUrl.value =
            "";

    }


    if (modalTitle) {

        modalTitle.textContent =
            "Yeni Çalışma Ekle";

    }


    resetPortfolioImagePreview();


    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   PORTFÖY MODALINI KAPAT
========================================= */

function closePortfolioModal() {

    const modal =
        document.getElementById(
            "portfolioModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    document.body.style.overflow =
        "";

}


/* =========================================
   PORTFÖY FORM
========================================= */

function initializePortfolioForm() {

    const portfolioForm =
        document.getElementById(
            "portfolioForm"
        );


    if (!portfolioForm) {

        return;

    }


    portfolioForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            await savePortfolio();

        }
    );

}


/* =========================================
   GÖRSEL YÜKLEME
========================================= */

function initializePortfolioImageUpload() {

    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    if (!portfolioImageInput) {

        return;

    }


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
                    "Lütfen geçerli bir görsel dosyası seç.",
                    "error"
                );

                portfolioImageInput.value =
                    "";

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


    if (!preview) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            preview.innerHTML =
                `
                <img
                    src="${event.target.result}"
                    alt="Görsel önizleme"
                >
                `;

        };


    reader.readAsDataURL(
        file
    );

}


/* =========================================
   MEVCUT GÖRSELİ GÖSTER
========================================= */

function showExistingPortfolioImage(
    imageUrl
) {

    const preview =
        document.getElementById(
            "portfolioImagePreview"
        );


    if (!preview) {

        return;

    }


    preview.innerHTML =
        `
        <img
            src="${escapeAttribute(
                imageUrl
            )}"
            alt="Mevcut görsel"
        >
        `;

}


/* =========================================
   ÖNİZLEMEYİ SIFIRLA
========================================= */

function resetPortfolioImagePreview() {

    const preview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    if (preview) {

        preview.innerHTML =
            `
            <span>
                Görsel önizlemesi burada görünecek
            </span>
            `;

    }


    if (portfolioImageInput) {

        portfolioImageInput.value =
            "";

    }

}


/* =========================================
   STORAGE'A GÖRSEL YÜKLE
========================================= */

async function uploadPortfolioImage(
    file
) {

    if (!file) {

        return currentPortfolioImageUrl;

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
        Math.random()
            .toString(36)
            .substring(2, 10) +
        "." +
        fileExtension;


    const {
        error
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
                        false
                }
            );


    if (error) {

        throw error;

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
            "Görsel public URL oluşturulamadı."
        );

    }


    return data.publicUrl;

}


/* =========================================
   PORTFÖY KAYDET
========================================= */

async function savePortfolio() {

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


    const portfolioForm =
        document.getElementById(
            "portfolioForm"
        );


    const savePortfolioButton =
        document.getElementById(
            "savePortfolioButton"
        );


    const title =
        portfolioTitle
            ? portfolioTitle.value.trim()
            : "";


    if (!title) {

        showMessage(
            "Proje başlığı zorunludur.",
            "error"
        );

        return;

    }


    try {

        if (savePortfolioButton) {

            savePortfolioButton.disabled =
                true;

            savePortfolioButton.textContent =
                "Kaydediliyor...";

        }


        let imageUrl =
            currentPortfolioImageUrl;


        if (selectedPortfolioImage) {

            showMessage(
                "Görsel yükleniyor...",
                "success"
            );


            imageUrl =
                await uploadPortfolioImage(
                    selectedPortfolioImage
                );

        }


        const portfolioData = {

            title:
                title,

            category:
                portfolioCategory
                    ? portfolioCategory.value.trim()
                    : "",

            description:
                portfolioDescription
                    ? portfolioDescription.value.trim()
                    : "",

            date:
                portfolioDate
                    ? portfolioDate.value
                    : null,

            status:
                portfolioStatus
                    ? portfolioStatus.value
                    : "active",

            image_url:
                imageUrl || null

        };


        if (
            currentEditingPortfolioId
        ) {

            const {
                error
            } =
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
            } =
                await supabaseClient
                    .from(
                        PORTFOLIO_TABLE
                    )
                    .insert(
                        [
                            portfolioData
                        ]
                    );


            if (error) {

                throw error;

            }


            showMessage(
                "Yeni portföy çalışması eklendi.",
                "success"
            );

        }


        closePortfolioModal();


        if (portfolioForm) {

            portfolioForm.reset();

        }


        await loadPortfolios();

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

        if (savePortfolioButton) {

            savePortfolioButton.disabled =
                false;

            savePortfolioButton.textContent =
                "Tasarımı Kaydet";

        }

    }

}


/* =========================================
   PORTFÖY ACTIONS
========================================= */

function initializePortfolioActions() {

    const portfolioList =
        document.getElementById(
            "adminPortfolioList"
        );


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
                    editButton.dataset.id
                );

                return;

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
   PORTFÖY DÜZENLE
========================================= */

async function editPortfolio(
    portfolioId
) {

    if (!portfolioId) {

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
                "Portföy çalışması bulunamadı."
            );

        }


        currentEditingPortfolioId =
            data.id;


        currentPortfolioImageUrl =
            getPortfolioImageUrl(
                data
            );


        selectedPortfolioImage =
            null;


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


        const existingImageUrl =
            document.getElementById(
                "existingImageUrl"
            );


        const modalTitle =
            document.getElementById(
                "portfolioModalTitle"
            );


        if (portfolioTitle) {

            portfolioTitle.value =
                data.title || "";

        }


        if (portfolioCategory) {

            portfolioCategory.value =
                data.category || "";

        }


        if (portfolioDescription) {

            portfolioDescription.value =
                data.description || "";

        }


        if (portfolioDate) {

            portfolioDate.value =
                data.date || "";

        }


        if (portfolioStatus) {

            portfolioStatus.value =
                data.status || "active";

        }


        if (existingImageUrl) {

            existingImageUrl.value =
                currentPortfolioImageUrl;

        }


        if (modalTitle) {

            modalTitle.textContent =
                "Çalışmayı Düzenle";

        }


        if (currentPortfolioImageUrl) {

            showExistingPortfolioImage(
                currentPortfolioImageUrl
            );

        } else {

            resetPortfolioImagePreview();

        }


        const modal =
            document.getElementById(
                "portfolioModal"
            );


        if (modal) {

            modal.classList.add(
                "active"
            );

            document.body.style.overflow =
                "hidden";

        }

    } catch (error) {

        console.error(
            "Portföy düzenleme hatası:",
            error
        );


        showMessage(
            "Portföy açılırken hata oluştu: " +
            (
                error.message ||
                "Bilinmeyen hata"
            ),
            "error"
        );

    }

}


/* =========================================
   PORTFÖY SİL
========================================= */

async function deletePortfolio(
    portfolioId
) {

    if (!portfolioId) {

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
            "Silme hatası: " +
            (
                error.message ||
                "Bilinmeyen hata"
            ),
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


    if (!logoutButton) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                logoutButton.disabled =
                    true;


                const originalText =
                    logoutButton.textContent;


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


                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Çıkış hatası:",
                    error
                );


                showMessage(
                    "Çıkış yapılırken hata oluştu.",
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
   MESAJ GÖSTER
========================================= */

function showMessage(
    message,
    type = "success"
) {

    let adminMessage =
        document.getElementById(
            "adminMessage"
        );


    if (!adminMessage) {

        adminMessage =
            document.createElement(
                "div"
            );


        adminMessage.id =
            "adminMessage";


        adminMessage.className =
            "admin-message";


        document.body.appendChild(
            adminMessage
        );

    }


    adminMessage.textContent =
        message;


    adminMessage.className =
        "admin-message show " +
        type;


    clearTimeout(
        adminMessageTimeout
    );


    adminMessageTimeout =
        setTimeout(
            function () {

                adminMessage.className =
                    "admin-message";

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

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value === null ||
        value === undefined
            ? ""
            : String(
                value
            );


    return div.innerHTML;

}


/* =========================================
   ATTRIBUTE ESCAPE
========================================= */

function escapeAttribute(
    value
) {

    return escapeHtml(
        value
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
