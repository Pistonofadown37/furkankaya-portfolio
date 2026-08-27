/* =========================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
========================================= */

/* =========================================
   SUPABASE KONTROLÜ
========================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


if (
    !window.supabase
) {
    console.error(
        "Supabase kütüphanesi yüklenemedi."
    );
}


/* =========================================
   SUPABASE CLIENT
========================================= */

if (
    !window.supabaseClient
) {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false
                }
            }
        );

}


const supabaseClient =
    window.supabaseClient;


/* =========================================
   SABİTLER
========================================= */

const PORTFOLIO_TABLE =
    "portfolios";


const PORTFOLIO_BUCKET =
    "portfolio-images";


/* =========================================
   GLOBAL DEĞİŞKENLER
========================================= */

let selectedPortfolioImage =
    null;


let currentPortfolioImageUrl =
    "";


let currentEditingPortfolioId =
    null;


/* =========================================
   DOM HAZIR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
           Önce oturum kontrol edilir.

           Kullanıcı giriş yapmamışsa
           aşağıdaki fonksiyon login.html'ye
           yönlendireceği için diğer işlemler
           çalıştırılmaz.
        */

        const sessionValid =
            await checkAdminSession();


        if (
            !sessionValid
        ) {
            return;
        }


        initializeAdminNavigation();

        initializeLogout();

        initializePortfolioForm();

        initializePortfolioImageUpload();

        initializePortfolioActions();


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


        if (
            error
        ) {

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

    } catch (
        error
    ) {

        console.error(
            "Oturum kontrolünde hata:",
            error
        );


        redirectToLogin();

        return false;

    }

}


/* =========================================
   LOGIN SAYFASINA YÖNLENDİR
========================================= */

function redirectToLogin() {

    window.location.replace(
        "login.html"
    );

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
        function (
            button
        ) {

            button.addEventListener(
                "click",
                function () {

                    const targetId =
                        button.dataset.target;


                    if (
                        !targetId
                    ) {
                        return;
                    }


                    const targetSection =
                        document.getElementById(
                            targetId
                        );


                    if (
                        !targetSection
                    ) {

                        console.warn(
                            "Bölüm bulunamadı:",
                            targetId
                        );

                        return;

                    }


                    navButtons.forEach(
                        function (
                            item
                        ) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    sections.forEach(
                        function (
                            section
                        ) {

                            section.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    targetSection.classList.add(
                        "active"
                    );


                    window.scrollTo(
                        {
                            top: 0,
                            behavior: "smooth"
                        }
                    );

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


    if (
        !portfolioList
    ) {

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
                .select(
                    "*"
                )
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
            Array.isArray(
                data
            )
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

    } catch (
        error
    ) {

        console.error(
            "Portföy yükleme hatası:",
            error
        );


        portfolioList.innerHTML =
            `
            <div class="admin-empty-state">
                Portföyler yüklenirken hata oluştu.
            </div>
            `;


        showMessage(
            "Portföyler yüklenirken hata oluştu: " +
            (
                error.message ||
                "Bilinmeyen hata"
            ),
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


    if (
        !portfolioList
    ) {

        return;

    }


    portfolioList.innerHTML =
        "";


    if (
        !portfolios ||
        portfolios.length === 0
    ) {

        return;

    }


    portfolios.forEach(
        function (
            portfolio
        ) {

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


            item.innerHTML =
                `
                <div class="portfolio-admin-image">

                    ${imageHtml}

                </div>


                <div class="portfolio-admin-content">

                    <div class="portfolio-admin-meta">

                        <span
                            class="portfolio-status ${escapeAttribute(status)}"
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
   PORTFÖY GÖRSEL URL
========================================= */

function getPortfolioImageUrl(
    portfolio
) {

    const keys =
        [
            "image_url",
            "image",
            "imageUrl",
            "thumbnail_url",
            "thumbnail"
        ];


    for (
        const key of keys
    ) {

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
            function (
                portfolio
            ) {

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
   PORTFÖY FORM
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
            openNewPortfolioForm
        );

    }


    if (
        cancelPortfolioButton
    ) {

        cancelPortfolioButton.addEventListener(
            "click",
            closePortfolioForm
        );

    }


    if (
        portfolioForm
    ) {

        portfolioForm.addEventListener(
            "submit",
            async function (
                event
            ) {

                event.preventDefault();

                await savePortfolio();

            }
        );

    }

}


/* =========================================
   YENİ PORTFÖY FORMU
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


    currentPortfolioImageUrl =
        "";


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
        function (
            event
        ) {

            const file =
                event.target.files[0];


            if (
                !file
            ) {

                return;

            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Lütfen geçerli bir görsel seç.",
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

    const preview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const uploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    if (
        !preview
    ) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (
            event
        ) {

            preview.src =
                event.target.result;


            preview.classList.add(
                "show"
            );


            if (
                uploadContent
            ) {

                uploadContent.style.display =
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

    const preview =
        document.getElementById(
            "portfolioImagePreview"
        );


    const uploadContent =
        document.getElementById(
            "imageUploadContent"
        );


    const input =
        document.getElementById(
            "portfolioImageInput"
        );


    if (
        preview
    ) {

        preview.src =
            "";


        preview.classList.remove(
            "show"
        );

    }


    if (
        uploadContent
    ) {

        uploadContent.style.display =
            "flex";

    }


    if (
        input
    ) {

        input.value =
            "";

    }

}


/* =========================================
   STORAGE'A GÖRSEL YÜKLE
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
        `portfolio-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}.${extension}`;


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
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (
        error
    ) {

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
            "Görsel URL'si oluşturulamadı."
        );

    }


    return data.publicUrl;

}


/* =========================================
   PORTFÖY KAYDET
========================================= */

async function savePortfolio() {

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


    const dateInput =
        document.getElementById(
            "portfolioDate"
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


    if (
        !title
    ) {

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


        if (
            selectedPortfolioImage
        ) {

            imageUrl =
                await uploadPortfolioImage(
                    selectedPortfolioImage
                );

        }


        const portfolioData =
            {
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


        let result;


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
                    );

        } else {

            result =
                await supabaseClient
                    .from(
                        PORTFOLIO_TABLE
                    )
                    .insert(
                        [
                            portfolioData
                        ]
                    );

        }


        if (
            result.error
        ) {

            throw result.error;

        }


        showMessage(
            currentEditingPortfolioId
                ? "Portföy çalışması güncellendi."
                : "Yeni portföy çalışması eklendi.",
            "success"
        );


        closePortfolioForm();

        await loadPortfolios();

    } catch (
        error
    ) {

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
        async function (
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


            if (
                editButton
            ) {

                await editPortfolio(
                    editButton.dataset.id
                );

                return;

            }


            if (
                deleteButton
            ) {

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
                .from(
                    PORTFOLIO_TABLE
                )
                .select(
                    "*"
                )
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


        currentEditingPortfolioId =
            data.id;


        currentPortfolioImageUrl =
            getPortfolioImageUrl(
                data
            );


        selectedPortfolioImage =
            null;


        const fields =
            {
                portfolioTitle:
                    data.title || "",

                portfolioCategory:
                    data.category || "",

                portfolioDescription:
                    data.description || "",

                portfolioDate:
                    data.date || "",

                portfolioStatus:
                    data.status || "active"
            };


        Object.entries(
            fields
        ).forEach(
            function (
                [id, value]
            ) {

                const element =
                    document.getElementById(
                        id
                    );


                if (
                    element
                ) {

                    element.value =
                        value;

                }

            }
        );


        if (
            currentPortfolioImageUrl
        ) {

            const preview =
                document.getElementById(
                    "portfolioImagePreview"
                );


            if (
                preview
            ) {

                preview.src =
                    currentPortfolioImageUrl;


                preview.classList.add(
                    "show"
                );

            }

        }


        const title =
            document.getElementById(
                "portfolioFormTitle"
            );


        if (
            title
        ) {

            title.textContent =
                "Portföy Çalışmasını Düzenle";

        }


        const formCard =
            document.getElementById(
                "portfolioFormCard"
            );


        if (
            formCard
        ) {

            formCard.style.display =
                "block";


            formCard.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );

        }

    } catch (
        error
    ) {

        console.error(
            "Düzenleme hatası:",
            error
        );


        showMessage(
            "Portföy açılırken hata oluştu.",
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
                .from(
                    PORTFOLIO_TABLE
                )
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

    } catch (
        error
    ) {

        console.error(
            "Silme hatası:",
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
   ÇIKIŞ YAP
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

            const originalText =
                logoutButton.textContent;


            try {

                logoutButton.disabled =
                    true;


                logoutButton.textContent =
                    "Çıkış yapılıyor...";


                /*
                   ÖNEMLİ:

                   Eski kodda signOut sonucu
                   kontrol edilmeden login sayfasına
                   gidiliyordu.

                   Burada önce Supabase oturumunu
                   gerçekten kapatıyoruz.
                */

                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signOut(
                            {
                                scope: "global"
                            }
                        );


                if (
                    error
                ) {

                    throw error;

                }


                /*
                   Supabase auth tokenlarını
                   tarayıcıdan da temizle.
                */

                clearSupabaseAuthStorage();


                /*
                   Oturumun gerçekten silindiğini
                   kontrol et.
                */

                const {
                    data:
                        sessionData,
                    error:
                        sessionError
                } =
                    await supabaseClient
                        .auth
                        .getSession();


                if (
                    sessionError
                ) {

                    console.warn(
                        "Çıkış sonrası session kontrol hatası:",
                        sessionError
                    );

                }


                if (
                    sessionData &&
                    sessionData.session
                ) {

                    throw new Error(
                        "Oturum kapatılamadı."
                    );

                }


                /*
                   replace kullanıyoruz.
                   Böylece tarayıcı geri tuşuyla
                   tekrar admin'e dönülmesi engellenir.
                */

                window.location.replace(
                    "login.html?logout=1&t=" +
                    Date.now()
                );

            } catch (
                error
            ) {

                console.error(
                    "Çıkış hatası:",
                    error
                );


                showMessage(
                    "Çıkış yapılamadı: " +
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
   SUPABASE AUTH STORAGE TEMİZLE
========================================= */

function clearSupabaseAuthStorage() {

    const keysToRemove =
        [];


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(
                i
            );


        if (
            key &&
            (
                key.includes(
                    "sb-"
                ) &&
                key.includes(
                    "auth-token"
                )
            )
        ) {

            keysToRemove.push(
                key
            );

        }

    }


    keysToRemove.forEach(
        function (
            key
        ) {

            localStorage.removeItem(
                key
            );

        }
    );


    const sessionKeysToRemove =
        [];


    for (
        let i = 0;
        i < sessionStorage.length;
        i++
    ) {

        const key =
            sessionStorage.key(
                i
            );


        if (
            key &&
            (
                key.includes(
                    "sb-"
                ) &&
                key.includes(
                    "auth-token"
                )
            )
        ) {

            sessionKeysToRemove.push(
                key
            );

        }

    );


    sessionKeysToRemove.forEach(
        function (
            key
        ) {

            sessionStorage.removeItem(
                key
            );

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
