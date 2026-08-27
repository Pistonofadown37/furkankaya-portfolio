document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();
    initializeLogout();

    initializePortfolioForm();
    initializePortfolioImage();

    initializeSiteSettings();
    initializeContactSettings();

    initializePortfolioActions();

    checkSession();
    loadPortfolios();

});


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {

    const buttons =
        document.querySelectorAll(".admin-nav-button");

    const sections =
        document.querySelectorAll(".admin-section");


    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetId =
                button.dataset.target;


            const targetSection =
                document.getElementById(targetId);


            if (!targetSection) {

                console.error(
                    "Bölüm bulunamadı:",
                    targetId
                );

                return;

            }


            buttons.forEach((item) => {

                item.classList.remove("active");

            });


            sections.forEach((section) => {

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
   SUPABASE CLIENT
========================================= */

function getSupabaseClient() {

    if (window.supabaseClient) {

        return window.supabaseClient;

    }

    return null;

}


/* =========================================
   SESSION
========================================= */

async function checkSession() {

    const client =
        getSupabaseClient();


    if (!client) {

        console.warn(
            "Supabase client bulunamadı."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await client.auth.getSession();


        if (error) {

            console.error(error);

            return;

        }


        if (!data.session) {

            window.location.href =
                "login.html";

        }

    } catch (error) {

        console.error(
            "Oturum kontrol hatası:",
            error
        );

    }

}


/* =========================================
   LOGOUT
========================================= */

function initializeLogout() {

    const button =
        document.getElementById("logoutButton");


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const client =
                getSupabaseClient();


            button.disabled = true;

            button.textContent =
                "Çıkış yapılıyor...";


            try {

                if (client) {

                    await client.auth.signOut();

                }

            } catch (error) {

                console.error(error);

            }


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================
   PORTFOLIO LOAD
========================================= */

async function loadPortfolios() {

    const client =
        getSupabaseClient();

    const list =
        document.getElementById("portfolioList");

    const empty =
        document.getElementById(
            "portfolioEmptyState"
        );


    if (!list) {
        return;
    }


    if (!client) {

        list.innerHTML =
            `
            <div class="admin-empty-state">
                Supabase bağlantısı bulunamadı.
            </div>
            `;

        return;

    }


    try {

        list.innerHTML =
            `
            <div class="admin-loading">
                Portföyler yükleniyor...
            </div>
            `;


        const {
            data,
            error
        } =
            await client
                .from("portfolios")
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


        renderPortfolios(portfolios);

        updateDashboard(portfolios);


        if (empty) {

            empty.style.display =
                portfolios.length === 0
                    ? "block"
                    : "none";

        }

    } catch (error) {

        console.error(error);

        list.innerHTML =
            `
            <div class="admin-empty-state">
                Portföyler yüklenirken hata oluştu.
                <br>
                <small>${escapeHtml(error.message)}</small>
            </div>
            `;

    }

}


/* =========================================
   PORTFOLIO RENDER
========================================= */

function renderPortfolios(portfolios) {

    const list =
        document.getElementById("portfolioList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    portfolios.forEach((portfolio) => {

        const item =
            document.createElement("article");

        item.className =
            "portfolio-admin-item";


        const imageUrl =
            portfolio.image_url || "";


        const status =
            portfolio.status === "active"
                ? "Aktif"
                : "Pasif";


        item.innerHTML =
            `
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
                            GÖRSEL YOK
                        </div>
                        `
                }

            </div>


            <div class="portfolio-admin-content">

                <span
                    class="portfolio-status ${portfolio.status || "inactive"}"
                >
                    ${status}
                </span>


                <h3>
                    ${escapeHtml(portfolio.title || "İsimsiz Çalışma")}
                </h3>


                <p class="portfolio-admin-category">
                    ${escapeHtml(portfolio.category || "")}
                </p>


                <p class="portfolio-admin-description">
                    ${escapeHtml(portfolio.description || "")}
                </p>

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


        list.appendChild(item);

    });

}


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard(portfolios) {

    const total =
        document.getElementById("totalPortfolio");

    const active =
        document.getElementById("activePortfolio");


    if (total) {

        total.value =
            portfolios.length;

    }


    if (active) {

        active.value =
            portfolios.filter(
                (item) =>
                    item.status === "active"
            ).length;

    }

}


/* =========================================
   NEW PORTFOLIO BUTTON
========================================= */

function initializePortfolioForm() {

    const newButton =
        document.getElementById(
            "newPortfolioButton"
        );

    const cancelButton =
        document.getElementById(
            "cancelPortfolioButton"
        );

    const form =
        document.getElementById(
            "portfolioForm"
        );


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
            savePortfolio
        );

    }

}


function openNewPortfolioForm() {

    const card =
        document.getElementById(
            "portfolioFormCard"
        );

    const form =
        document.getElementById(
            "portfolioForm"
        );

    const title =
        document.getElementById(
            "portfolioFormTitle"
        );


    if (form) {

        form.reset();

    }


    if (title) {

        title.textContent =
            "Yeni Portföy Çalışması";

    }


    resetImagePreview();


    if (card) {

        card.style.display =
            "block";

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


    if (card) {

        card.style.display =
            "none";

    }

}


/* =========================================
   IMAGE PREVIEW
========================================= */

function initializePortfolioImage() {

    const input =
        document.getElementById(
            "portfolioImageInput"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "change",
        () => {

            const file =
                input.files[0];


            if (!file) {
                return;
            }


            const preview =
                document.getElementById(
                    "portfolioImagePreview"
                );

            const content =
                document.getElementById(
                    "imageUploadContent"
                );


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    if (preview) {

                        preview.src =
                            event.target.result;

                        preview.classList.add("show");

                    }


                    if (content) {

                        content.style.display =
                            "none";

                    }

                };


            reader.readAsDataURL(file);

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


    if (preview) {

        preview.src = "";

        preview.classList.remove("show");

    }


    if (content) {

        content.style.display =
            "flex";

    }

}


/* =========================================
   SAVE PORTFOLIO
========================================= */

async function savePortfolio(event) {

    event.preventDefault();


    const client =
        getSupabaseClient();


    if (!client) {

        showAdminMessage(
            "Supabase bağlantısı bulunamadı.",
            "error"
        );

        return;

    }


    const title =
        document.getElementById(
            "portfolioTitle"
        ).value.trim();


    if (!title) {

        showAdminMessage(
            "Portföy başlığı zorunludur.",
            "error"
        );

        return;

    }


    const category =
        document.getElementById(
            "portfolioCategory"
        ).value.trim();


    const description =
        document.getElementById(
            "portfolioDescription"
        ).value.trim();


    const date =
        document.getElementById(
            "portfolioDate"
        ).value;


    const status =
        document.getElementById(
            "portfolioStatus"
        ).value;


    const imageInput =
        document.getElementById(
            "portfolioImageInput"
        );


    const editId =
        document.getElementById(
            "portfolioEditId"
        ).value;


    let imageUrl = "";


    try {

        if (
            imageInput &&
            imageInput.files.length > 0
        ) {

            const file =
                imageInput.files[0];


            const extension =
                file.name.split(".").pop();


            const fileName =
                `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;


            const {
                error: uploadError
            } =
                await client
                    .storage
                    .from("portfolio-images")
                    .upload(
                        fileName,
                        file
                    );


            if (uploadError) {
                throw uploadError;
            }


            const {
                data: publicData
            } =
                client
                    .storage
                    .from("portfolio-images")
                    .getPublicUrl(fileName);


            imageUrl =
                publicData.publicUrl;

        }


        const portfolioData = {

            title,

            category,

            description,

            date: date || null,

            status,

            image_url:
                imageUrl || null

        };


        let result;


        if (editId) {

            result =
                await client
                    .from("portfolios")
                    .update(portfolioData)
                    .eq("id", editId);

        } else {

            result =
                await client
                    .from("portfolios")
                    .insert([portfolioData]);

        }


        if (result.error) {
            throw result.error;
        }


        showAdminMessage(
            editId
                ? "Portföy güncellendi."
                : "Yeni portföy eklendi.",
            "success"
        );


        closePortfolioForm();

        await loadPortfolios();


    } catch (error) {

        console.error(error);

        showAdminMessage(
            error.message ||
            "Kaydetme sırasında hata oluştu.",
            "error"
        );

    }

}


/* =========================================
   EDIT / DELETE
========================================= */

function initializePortfolioActions() {

    const list =
        document.getElementById(
            "portfolioList"
        );


    if (!list) {
        return;
    }


    list.addEventListener(
        "click",
        async (event) => {

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


async function editPortfolio(id) {

    const client =
        getSupabaseClient();


    if (!client) {
        return;
    }


    try {

        const {
            data,
            error
        } =
            await client
                .from("portfolios")
                .select("*")
                .eq("id", id)
                .single();


        if (error) {
            throw error;
        }


        document.getElementById(
            "portfolioEditId"
        ).value = data.id;


        document.getElementById(
            "portfolioTitle"
        ).value = data.title || "";


        document.getElementById(
            "portfolioCategory"
        ).value = data.category || "";


        document.getElementById(
            "portfolioDescription"
        ).value = data.description || "";


        document.getElementById(
            "portfolioDate"
        ).value = data.date || "";


        document.getElementById(
            "portfolioStatus"
        ).value =
            data.status || "active";


        document.getElementById(
            "portfolioFormTitle"
        ).textContent =
            "Portföy Çalışmasını Düzenle";


        const card =
            document.getElementById(
                "portfolioFormCard"
            );


        card.style.display =
            "block";


        card.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        showAdminMessage(
            error.message,
            "error"
        );

    }

}


async function deletePortfolio(id) {

    const confirmed =
        confirm(
            "Bu portföy çalışmasını silmek istediğine emin misin?"
        );


    if (!confirmed) {
        return;
    }


    const client =
        getSupabaseClient();


    if (!client) {
        return;
    }


    try {

        const {
            error
        } =
            await client
                .from("portfolios")
                .delete()
                .eq("id", id);


        if (error) {
            throw error;
        }


        showAdminMessage(
            "Portföy silindi.",
            "success"
        );


        await loadPortfolios();


    } catch (error) {

        showAdminMessage(
            error.message,
            "error"
        );

    }

}


/* =========================================
   SITE SETTINGS
========================================= */

function initializeSiteSettings() {

    const form =
        document.getElementById(
            "siteSettingsForm"
        );


    if (!form) {
        return;
    }


    loadSiteSettings();


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const settings = {

                siteTitle:
                    document.getElementById(
                        "siteTitle"
                    ).value,

                heroTitle:
                    document.getElementById(
                        "heroTitle"
                    ).value,

                heroText:
                    document.getElementById(
                        "heroText"
                    ).value,

                instagramLink:
                    document.getElementById(
                        "instagramLink"
                    ).value,

                emailAddress:
                    document.getElementById(
                        "emailAddress"
                    ).value

            };


            localStorage.setItem(
                "furkanKayaSiteSettings",
                JSON.stringify(settings)
            );


            showAdminMessage(
                "Site ayarları kaydedildi.",
                "success"
            );

        }
    );

}


function loadSiteSettings() {

    try {

        const data =
            localStorage.getItem(
                "furkanKayaSiteSettings"
            );


        if (!data) {
            return;
        }


        const settings =
            JSON.parse(data);


        setInputValue(
            "siteTitle",
            settings.siteTitle
        );

        setInputValue(
            "heroTitle",
            settings.heroTitle
        );

        setInputValue(
            "heroText",
            settings.heroText
        );

        setInputValue(
            "instagramLink",
            settings.instagramLink
        );

        setInputValue(
            "emailAddress",
            settings.emailAddress
        );

    } catch (error) {

        console.error(error);

    }

}


/* =========================================
   CONTACT SETTINGS
========================================= */

function initializeContactSettings() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) {
        return;
    }


    loadContactSettings();


    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const contact = {

                email:
                    document.getElementById(
                        "contactEmail"
                    ).value,

                phone:
                    document.getElementById(
                        "contactPhone"
                    ).value,

                address:
                    document.getElementById(
                        "contactAddress"
                    ).value

            };


            localStorage.setItem(
                "furkanKayaContact",
                JSON.stringify(contact)
            );


            showAdminMessage(
                "İletişim bilgileri kaydedildi.",
                "success"
            );

        }
    );

}


function loadContactSettings() {

    try {

        const data =
            localStorage.getItem(
                "furkanKayaContact"
            );


        if (!data) {
            return;
        }


        const contact =
            JSON.parse(data);


        setInputValue(
            "contactEmail",
            contact.email
        );

        setInputValue(
            "contactPhone",
            contact.phone
        );

        setInputValue(
            "contactAddress",
            contact.address
        );

    } catch (error) {

        console.error(error);

    }

}


/* =========================================
   HELPER
========================================= */

function setInputValue(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value || "";

    }

}


function showAdminMessage(
    message,
    type = "success"
) {

    const box =
        document.getElementById(
            "adminMessage"
        );


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.className =
        `admin-message show ${type}`;


    clearTimeout(
        window.adminMessageTimer
    );


    window.adminMessageTimer =
        setTimeout(
            () => {

                box.className =
                    "admin-message";

            },
            4000
        );

}


function escapeHtml(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value || "";


    return div.innerHTML;

}


function escapeAttribute(value) {

    return escapeHtml(value)
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
