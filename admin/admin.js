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


/*
   Supabase istemcisini global oluşturuyoruz.

   settings.js dosyası da aynı bağlantıyı
   kullanabilecek.
*/

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

/*
   Supabase Storage bucket adı.

   Bucket oluştururken verdiğin isim farklıysa
   sadece aşağıdaki değeri değiştir.
*/

const PORTFOLIO_BUCKET =
    "portfolio-images";


/*
   Portföy tablosu.
*/

const PORTFOLIO_TABLE =
    "portfolios";


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

        initializeAdminNavigation();

        initializeLogout();

        initializePortfolioForm();

        initializePortfolioImageUpload();

        initializePortfolioActions();

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
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session kontrol hatası:",
                error
            );

            return;

        }


        /*
           Giriş sistemi Supabase Auth kullanıyorsa
           ve kullanıcı giriş yapmamışsa login sayfasına
           yönlendir.
        */

        if (
            !data ||
            !data.session
        ) {

            console.log(
                "Aktif Supabase oturumu bulunamadı."
            );

        }

    } catch (error) {

        console.error(
            "Oturum kontrolünde hata:",
            error
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


    navButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.target;


                    if (!targetId) {
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

}


/* =========================================
   PORTFÖYLERİ YÜKLE
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


    if (!portfolioList) {

        console.error(
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

        const {
            data,
            error
        } =
            await supabaseClient
                .from(PORTFOLIO_TABLE)
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


        if (
            portfolioEmptyState
        ) {

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


        portfolioList.innerHTML = `

            <div class="admin-empty-state">
                Portföyler yüklenirken hata oluştu.
                <br>
                <small>
                    ${escapeHtml(
                        error.message ||
                        "Bilinmeyen hata"
                    )}
                </small>
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
            "portfolioList"
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
                getPortfolioImageUrl(
                    portfolio
                );


            const imageHtml =
                imageUrl
                    ? `

                        <img
                            src="${escapeAttribute(imageUrl)}"
                            alt="${escapeAttribute(
                                portfolio.title ||
                                "Portföy görseli"
                            )}"
                        >

                    `
                    : `

                        <div class="portfolio-admin-no-image">
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


            item.innerHTML = `

                <div class="portfolio-admin-image">

                    ${imageHtml}

                </div>


                <div class="portfolio-admin-content">


                    <div class="portfolio-admin-meta">

                        <span class="portfolio-status ${escapeAttribute(status)}">

                            ${statusText}

                        </span>

                    </div>


                    <h3>

                        ${escapeHtml(
                            portfolio.title ||
                            "İsimsiz Çalışma"
                        )}

                    </h3>


                    <p class="portfolio-admin-category">

                        ${escapeHtml(
                            portfolio.category ||
                            ""
                        )}

                    </p>


                    <p class="portfolio-admin-description">

                        ${escapeHtml(
                            portfolio.description ||
                            ""
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


    if (
        totalPortfolio
    ) {

        totalPortfolio.value =
            total;

    }


    if (
        activePortfolio
    ) {

        activePortfolio.value =
            active;

    }

}


/* =========================================
   PORTFÖY FORM BAŞLAT
========================================= */

function initializePortfolioForm() {

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


    if (
        portfolioForm
    ) {

        portfolioForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                await savePortfolio();

            }
        );

    }

}


/* =========================================
   YENİ PORTFÖY FORMUNU AÇ
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


    const portfolioFormTitle =
        document.getElementById(
            "portfolioFormTitle"
        );


    if (
        portfolioForm
    ) {

        portfolioForm.reset();

    }


    currentEditingPortfolioId =
        null;


    currentPortfolioImageUrl =
        "";


    selectedPortfolioImage =
        null;


    const portfolioEditId =
        document.getElementById(
            "portfolioEditId"
        );


    if (
        portfolioEditId
    ) {

        portfolioEditId.value =
            "";

    }


    resetPortfolioImagePreview();


    if (
        portfolioFormTitle
    ) {

        portfolioFormTitle.textContent =
            "Yeni Portföy Çalışması";

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
   PORTFÖY FORMUNU KAPAT
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


    currentEditingPortfolioId =
        null;


    selectedPortfolioImage =
        null;

}


/* =========================================
   GÖRSEL YÜKLEME
========================================= */

function initializePortfolioImageUpload() {

    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    if (
        !portfolioImageInput
    ) {

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

    const portfolioImagePreview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const imageUploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    if (
        !portfolioImagePreview
    ) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            portfolioImagePreview.src =
                event.target.result;


            portfolioImagePreview.classList.add(
                "show"
            );


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
   ÖNİZLEMEYİ SIFIRLA
========================================= */

function resetPortfolioImagePreview() {

    const portfolioImagePreview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const imageUploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    const portfolioImageInput =
        document.getElementById(
            "portfolioImageInput"
        );


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
            "flex";

    }


    if (
        portfolioImageInput
    ) {

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
        "portfolio-" +
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
            .from(PORTFOLIO_BUCKET)
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
            .from(PORTFOLIO_BUCKET)
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


    const submitButton =
        portfolioForm
            ? portfolioForm.querySelector(
                'button[type="submit"]'
            )
            : null;


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

        if (
            submitButton
        ) {

            submitButton.disabled =
                true;


            submitButton.textContent =
                "Kaydediliyor...";

        }


        let imageUrl =
            currentPortfolioImageUrl;


        /*
           Yeni görsel seçildiyse
           Storage'a yükle.
        */

        if (
            selectedPortfolioImage
        ) {

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


        /*
           Düzenleme
        */

        if (
            currentEditingPortfolioId
        ) {

            const {
                error
            } =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
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

            /*
               Yeni portföy
            */

            const {
                error
            } =
                await supabaseClient
                    .from(PORTFOLIO_TABLE)
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


        closePortfolioForm();


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
   PORTFÖY ACTIONS
========================================= */

function initializePortfolioActions() {

    const portfolioList =
        document.getElementById(
            "portfolioList"
        );


    if (
        !portfolioList
    ) {

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


            if (
                editButton
            ) {

                const portfolioId =
                    editButton.dataset.id;


                await editPortfolio(
                    portfolioId
                );


                return;

            }


            if (
                deleteButton
            ) {

                const portfolioId =
                    deleteButton.dataset.id;


                await deletePortfolio(
                    portfolioId
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

    if (
        !portfolioId
    ) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(PORTFOLIO_TABLE)
                .select("*")
                .eq(
                    "id",
                    portfolioId
                )
                .single();


        if (
            error
        ) {

            throw error;

        }


        if (
            !data
        ) {

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
                data.id;

        }


        if (
            portfolioTitle
        ) {

            portfolioTitle.value =
                data.title || "";

        }


        if (
            portfolioCategory
        ) {

            portfolioCategory.value =
                data.category || "";

        }


        if (
            portfolioDescription
        ) {

            portfolioDescription.value =
                data.description || "";

        }


        if (
            portfolioDate
        ) {

            portfolioDate.value =
                data.date || "";

        }


        if (
            portfolioStatus
        ) {

            portfolioStatus.value =
                data.status || "active";

        }


        if (
            currentPortfolioImageUrl
        ) {

            showExistingPortfolioImage(
                currentPortfolioImageUrl
            );

        } else {

            resetPortfolioImagePreview();

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
                    behavior: "smooth",
                    block: "start"
                }
            );

        }

    } catch (error) {

        console.error(
            "Portföy düzenleme hatası:",
            error
        );


        showMessage(
            "Portföy açılırken hata oluştu: " +
            error.message,
            "error"
        );

    }

}


/* =========================================
   MEVCUT GÖRSELİ GÖSTER
========================================= */

function showExistingPortfolioImage(
    imageUrl
) {

    const portfolioImagePreview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const imageUploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    if (
        portfolioImagePreview
    ) {

        portfolioImagePreview.src =
            imageUrl;


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

}


/* =========================================
   PORTFÖY SİL
========================================= */

async function deletePortfolio(
    portfolioId
) {

    if (
        !portfolioId
    ) {

        return;

    }


    const confirmed =
        confirm(
            "Bu portföy çalışmasını silmek istediğine emin misin?"
        );


    if (
        !confirmed
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from(PORTFOLIO_TABLE)
                .delete()
                .eq(
                    "id",
                    portfolioId
                );


        if (
            error
        ) {

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


                await supabaseClient
                    .auth
                    .signOut();


                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Çıkış hatası:",
                    error
                );


                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =========================================
   MESAJ GÖSTER
========================================= */

function showMessage(
    message,
    type
) {

    const adminMessage =
        document.getElementById(
            "adminMessage"
        );


    if (
        !adminMessage
    ) {

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
            : String(value);


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
