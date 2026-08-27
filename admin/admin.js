/* =============================================
   FURKAN KAYA PORTFOLIO
   ADMIN PANEL JAVASCRIPT
   SUPABASE VERSION
============================================= */


document.addEventListener(
    "DOMContentLoaded",
    async function () {


        /* =============================================
           ELEMENTS
        ============================================= */

        const navButtons =
            document.querySelectorAll(
                ".admin-nav-button[data-target]"
            );


        const sections =
            document.querySelectorAll(
                ".admin-section"
            );


        const portfolioList =
            document.getElementById(
                "portfolioList"
            );


        const portfolioEmptyState =
            document.getElementById(
                "portfolioEmptyState"
            );


        const portfolioFormCard =
            document.getElementById(
                "portfolioFormCard"
            );


        const portfolioForm =
            document.getElementById(
                "portfolioForm"
            );


        const newPortfolioButton =
            document.getElementById(
                "newPortfolioButton"
            );


        const cancelPortfolioButton =
            document.getElementById(
                "cancelPortfolioButton"
            );


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


        const portfolioImagePreview =
            document.getElementById(
                "portfolioImagePreview"
            );


        const imageUploadContent =
            document.getElementById(
                "imageUploadContent"
            );


        const totalPortfolio =
            document.getElementById(
                "totalPortfolio"
            );


        const activePortfolio =
            document.getElementById(
                "activePortfolio"
            );


        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        const adminMessage =
            document.getElementById(
                "adminMessage"
            );


        /* =============================================
           STATE
        ============================================= */

        let selectedImageFile = null;

        let currentImageUrl = "";


        /* =============================================
           NAVIGATION
        ============================================= */

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


        /* =============================================
           MESSAGE
        ============================================= */

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


            setTimeout(
                function () {

                    adminMessage.className =
                        "admin-message";

                },
                4000
            );


        }


        /* =============================================
           AUTH CHECK
        ============================================= */

        async function checkAdminAuth() {


            if (
                !window.supabaseClient
            ) {

                console.error(
                    "Supabase bağlantısı bulunamadı."
                );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (error) {

                console.error(
                    error
                );

                return;

            }


            if (!data.session) {

                console.warn(
                    "Oturum bulunamadı."
                );


                /*
                Login sistemin henüz
                Supabase Auth kullanmıyorsa
                bu yönlendirme aktif edilmesin.
                */

                return;

            }


        }


        /* =============================================
           PORTFOLIOS GET
        ============================================= */

        async function getPortfolios() {


            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "portfolios"
                    )
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "Portföyler alınamadı:",
                    error
                );


                showMessage(
                    "Portföyler yüklenirken hata oluştu.",
                    "error"
                );


                return [];

            }


            return data || [];


        }


        /* =============================================
           DASHBOARD
        ============================================= */

        async function updateDashboard() {


            const portfolios =
                await getPortfolios();


            const activeCount =
                portfolios.filter(
                    function (item) {

                        return (
                            item.status ===
                            "active"
                        );

                    }
                ).length;


            if (totalPortfolio) {

                totalPortfolio.value =
                    portfolios.length;

            }


            if (activePortfolio) {

                activePortfolio.value =
                    activeCount;

            }


        }


        /* =============================================
           RENDER PORTFOLIOS
        ============================================= */

        async function renderPortfolios() {


            if (
                !portfolioList ||
                !portfolioEmptyState
            ) {

                return;

            }


            portfolioList.innerHTML =
                `
                    <div class="admin-loading">
                        Portföyler yükleniyor...
                    </div>
                `;


            const portfolios =
                await getPortfolios();


            portfolioList.innerHTML =
                "";


            if (
                portfolios.length === 0
            ) {


                portfolioEmptyState.style.display =
                    "block";


                await updateDashboard();


                return;

            }


            portfolioEmptyState.style.display =
                "none";


            portfolios.forEach(
                function (item) {


                    const element =
                        document.createElement(
                            "div"
                        );


                    element.className =
                        "portfolio-admin-item";


                    const imageHtml =
                        item.image_url
                            ? `
                                <img
                                    src="${escapeAttribute(
                                        item.image_url
                                    )}"
                                    alt="${escapeAttribute(
                                        item.title ||
                                        ""
                                    )}"
                                >
                            `
                            : `
                                <div
                                    class="portfolio-admin-no-image"
                                >
                                    Görsel Yok
                                </div>
                            `;


                    element.innerHTML =
                        `

                        <div
                            class="portfolio-admin-image"
                        >

                            ${imageHtml}

                        </div>


                        <div
                            class="portfolio-admin-content"
                        >

                            <span
                                class="portfolio-admin-status
                                ${item.status === "active"
                                    ? "status-active"
                                    : "status-inactive"
                                }"
                            >

                                ${item.status === "active"
                                    ? "AKTİF"
                                    : "PASİF"
                                }

                            </span>


                            <h3>

                                ${escapeHtml(
                                    item.title ||
                                    ""
                                )}

                            </h3>


                            <p>

                                ${escapeHtml(
                                    item.category ||
                                    ""
                                )}

                            </p>


                            <p>

                                ${escapeHtml(
                                    item.description ||
                                    ""
                                )}

                            </p>


                        </div>


                        <div
                            class="portfolio-admin-actions"
                        >


                            <button
                                type="button"
                                class="admin-secondary-button edit-portfolio"
                                data-id="${item.id}"
                            >
                                Düzenle
                            </button>


                            <button
                                type="button"
                                class="admin-danger-button delete-portfolio"
                                data-id="${item.id}"
                            >
                                Sil
                            </button>


                        </div>


                    `;


                    portfolioList.appendChild(
                        element
                    );


                }
            );


            await updateDashboard();


        }


        /* =============================================
           ESCAPE HTML
        ============================================= */

        function escapeHtml(text) {


            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                text === null ||
                text === undefined
                    ? ""
                    : String(text);


            return div.innerHTML;


        }


        /* =============================================
           ESCAPE ATTRIBUTE
        ============================================= */

        function escapeAttribute(text) {


            return escapeHtml(text)
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );


        }


        /* =============================================
           OPEN NEW PORTFOLIO FORM
        ============================================= */

        if (newPortfolioButton) {


            newPortfolioButton.addEventListener(
                "click",
                function () {


                    if (portfolioForm) {

                        portfolioForm.reset();

                    }


                    if (portfolioEditId) {

                        portfolioEditId.value =
                            "";

                    }


                    selectedImageFile =
                        null;


                    currentImageUrl =
                        "";


                    if (
                        portfolioImageInput
                    ) {

                        portfolioImageInput.value =
                            "";

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
                            "flex";

                    }


                    const formTitle =
                        document.getElementById(
                            "portfolioFormTitle"
                        );


                    if (formTitle) {

                        formTitle.textContent =
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
            );


        }


        /* =============================================
           CANCEL FORM
        ============================================= */

        if (cancelPortfolioButton) {


            cancelPortfolioButton.addEventListener(
                "click",
                function () {


                    if (
                        portfolioFormCard
                    ) {

                        portfolioFormCard.style.display =
                            "none";

                    }


                }
            );


        }


        /* =============================================
           IMAGE PREVIEW
        ============================================= */

        if (portfolioImageInput) {


            portfolioImageInput.addEventListener(
                "change",
                function (event) {


                    const file =
                        event.target.files[0];


                    if (!file) {

                        return;

                    }


                    selectedImageFile =
                        file;


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {


                            if (
                                portfolioImagePreview
                            ) {


                                portfolioImagePreview.src =
                                    event.target.result;


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


        /* =============================================
           UPLOAD IMAGE TO SUPABASE STORAGE
        ============================================= */

        async function uploadPortfolioImage(
            file
        ) {


            if (!file) {

                return currentImageUrl;

            }


            const extension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `portfolio/${Date.now()}-${crypto.randomUUID()}.${extension}`;


            const {
                error: uploadError
            } =
                await supabaseClient
                    .storage
                    .from(
                        "portfolio-images"
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
                        "portfolio-images"
                    )
                    .getPublicUrl(
                        fileName
                    );


            return data.publicUrl;


        }


        /* =============================================
           SAVE PORTFOLIO
        ============================================= */

        if (portfolioForm) {


            portfolioForm.addEventListener(
                "submit",
                async function (event) {


                    event.preventDefault();


                    const submitButton =
                        portfolioForm.querySelector(
                            'button[type="submit"]'
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


                        let imageUrl =
                            currentImageUrl;


                        if (
                            selectedImageFile
                        ) {


                            imageUrl =
                                await uploadPortfolioImage(
                                    selectedImageFile
                                );


                        }


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
                                    ? portfolioDate.value
                                    : null,

                            status:
                                portfolioStatus
                                    ? portfolioStatus.value
                                    : "active",

                            image_url:
                                imageUrl

                        };


                        if (editId) {


                            const {
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "portfolios"
                                    )
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
                            } =
                                await supabaseClient
                                    .from(
                                        "portfolios"
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


                        selectedImageFile =
                            null;


                        currentImageUrl =
                            "";


                        await renderPortfolios();


                    } catch (error) {


                        console.error(
                            "Portföy kaydedilirken hata:",
                            error
                        );


                        showMessage(
                            "Kaydetme sırasında hata oluştu: " +
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


        /* =============================================
           EDIT / DELETE
        ============================================= */

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


                    /* EDIT */

                    if (editButton) {


                        const id =
                            editButton.dataset.id;


                        try {


                            const {
                                data,
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "portfolios"
                                    )
                                    .select("*")
                                    .eq(
                                        "id",
                                        id
                                    )
                                    .single();


                            if (error) {

                                throw error;

                            }


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
                                    data.title ||
                                    "";

                            }


                            if (
                                portfolioCategory
                            ) {

                                portfolioCategory.value =
                                    data.category ||
                                    "";

                            }


                            if (
                                portfolioDescription
                            ) {

                                portfolioDescription.value =
                                    data.description ||
                                    "";

                            }


                            if (
                                portfolioDate
                            ) {

                                portfolioDate.value =
                                    data.project_date ||
                                    "";

                            }


                            if (
                                portfolioStatus
                            ) {

                                portfolioStatus.value =
                                    data.status ||
                                    "active";

                            }


                            currentImageUrl =
                                data.image_url ||
                                "";


                            selectedImageFile =
                                null;


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
                                        "flex";

                                }


                            }


                            const formTitle =
                                document.getElementById(
                                    "portfolioFormTitle"
                                );


                            if (formTitle) {

                                formTitle.textContent =
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
                                error
                            );


                            showMessage(
                                "Portföy bilgileri alınamadı.",
                                "error"
                            );


                        }


                        return;


                    }


                    /* DELETE */

                    if (deleteButton) {


                        const id =
                            deleteButton.dataset.id;


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
                                        "portfolios"
                                    )
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


                            await renderPortfolios();


                        } catch (error) {


                            console.error(
                                error
                            );


                            showMessage(
                                "Silme sırasında hata oluştu.",
                                "error"
                            );


                        }


                    }


                }
            );


        }


        /* =============================================
           LOGOUT
        ============================================= */

        if (logoutButton) {


            logoutButton.addEventListener(
                "click",
                async function () {


                    try {


                        await supabaseClient
                            .auth
                            .signOut();


                    } catch (error) {


                        console.error(
                            error
                        );


                    }


                    localStorage.removeItem(
                        "furkanKayaAdminLoggedIn"
                    );


                    window.location.href =
                        "login.html";


                }
            );


        }


        /* =============================================
           INITIALIZE
        ============================================= */

        await checkAdminAuth();

        await renderPortfolios();


    }
);
