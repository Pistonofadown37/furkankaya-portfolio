/* =========================================
   FURKAN KAYA PORTFOLIO
   ANA SITE JAVASCRIPT
   SUPABASE
========================================= */


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        initializeCurrentYear();

        initializeMobileMenu();

        initializeNavigation();

        initializeLightbox();

        await initializeSite();

    }
);


/* =========================================
   SITE INITIALIZE
========================================= */

async function initializeSite() {

    try {

        await Promise.all([

            loadSiteSettings(),

            loadPortfolios(),

            loadContactSettings()

        ]);

    } catch (error) {

        console.error(
            "Site yüklenirken hata oluştu:",
            error
        );

    }

}


/* =========================================
   CURRENT YEAR
========================================= */

function initializeCurrentYear() {

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (!currentYear) {

        return;

    }


    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================
   MOBILE MENU
========================================= */

function initializeMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const navigation =
        document.getElementById(
            "navigation"
        );


    if (
        !menuButton ||
        !navigation
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            navigation.classList.toggle(
                "open"
            );


            const isOpen =
                navigation.classList.contains(
                    "open"
                );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    const navLinks =
        navigation.querySelectorAll(
            "a"
        );


    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navigation.classList.remove(
                        "open"
                    );


                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    if (!navLinks.length) {

        return;

    }


    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navLinks.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );

                }
            );

        }
    );

}


/* =========================================
   SITE SETTINGS
========================================= */

async function loadSiteSettings() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("site_settings")
                .select("*");


        if (error) {

            console.error(
                "Site ayarları alınamadı:",
                error
            );

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            return;

        }


        const settings = {};


        data.forEach(
            function (item) {

                settings[item.key] =
                    item.value;

            }
        );


        applySiteSettings(
            settings
        );

    } catch (error) {

        console.error(
            "Site ayarları yükleme hatası:",
            error
        );

    }

}


/* =========================================
   APPLY SITE SETTINGS
========================================= */

function applySiteSettings(
    settings
) {

    /*
    -----------------------------------------
    SITE TITLE
    -----------------------------------------
    */

    if (
        settings.site_title
    ) {

        document.title =
            settings.site_title;

    }


    /*
    -----------------------------------------
    LOGO TEXT
    -----------------------------------------
    */

    const logoElements =
        document.querySelectorAll(
            "[data-site-logo]"
        );


    logoElements.forEach(
        function (element) {

            if (
                settings.logo_text
            ) {

                element.textContent =
                    settings.logo_text;

            }

        }
    );


    /*
    -----------------------------------------
    LOGO IMAGE
    -----------------------------------------
    */

    const logoImage =
        document.getElementById(
            "siteLogoImage"
        );


    if (
        logoImage &&
        settings.logo_image
    ) {

        logoImage.src =
            settings.logo_image;


        logoImage.style.display =
            "block";

    }


    /*
    -----------------------------------------
    HERO EYEBROW
    -----------------------------------------
    */

    const heroEyebrow =
        document.getElementById(
            "heroEyebrow"
        );


    if (
        heroEyebrow &&
        settings.hero_eyebrow
    ) {

        heroEyebrow.textContent =
            settings.hero_eyebrow;

    }


    /*
    -----------------------------------------
    HERO TITLE
    -----------------------------------------
    */

    const heroTitle =
        document.getElementById(
            "heroTitle"
        );


    if (
        heroTitle &&
        settings.hero_title
    ) {

        heroTitle.textContent =
            settings.hero_title;

    }


    /*
    -----------------------------------------
    HERO DESCRIPTION
    -----------------------------------------
    */

    const heroDescription =
        document.getElementById(
            "heroDescription"
        );


    if (
        heroDescription &&
        settings.hero_description
    ) {

        heroDescription.textContent =
            settings.hero_description;

    }


    /*
    -----------------------------------------
    PORTFOLIO EYEBROW
    -----------------------------------------
    */

    const portfolioEyebrow =
        document.getElementById(
            "portfolioEyebrow"
        );


    if (
        portfolioEyebrow &&
        settings.portfolio_eyebrow
    ) {

        portfolioEyebrow.textContent =
            settings.portfolio_eyebrow;

    }


    /*
    -----------------------------------------
    PORTFOLIO TITLE
    -----------------------------------------
    */

    const portfolioTitle =
        document.getElementById(
            "portfolioTitle"
        );


    if (
        portfolioTitle &&
        settings.portfolio_title
    ) {

        portfolioTitle.textContent =
            settings.portfolio_title;

    }


    /*
    -----------------------------------------
    PORTFOLIO DESCRIPTION
    -----------------------------------------
    */

    const portfolioDescription =
        document.getElementById(
            "portfolioDescription"
        );


    if (
        portfolioDescription &&
        settings.portfolio_description
    ) {

        portfolioDescription.textContent =
            settings.portfolio_description;

    }


    /*
    -----------------------------------------
    ABOUT TITLE
    -----------------------------------------
    */

    const aboutTitle =
        document.getElementById(
            "aboutTitle"
        );


    if (
        aboutTitle &&
        settings.about_title
    ) {

        aboutTitle.textContent =
            settings.about_title;

    }


    /*
    -----------------------------------------
    ABOUT TEXT
    -----------------------------------------
    */

    const aboutText =
        document.getElementById(
            "aboutText"
        );


    if (
        aboutText &&
        settings.about_text
    ) {

        aboutText.textContent =
            settings.about_text;

    }


    /*
    -----------------------------------------
    CONTACT EYEBROW
    -----------------------------------------
    */

    const contactEyebrow =
        document.getElementById(
            "contactEyebrow"
        );


    if (
        contactEyebrow &&
        settings.contact_eyebrow
    ) {

        contactEyebrow.textContent =
            settings.contact_eyebrow;

    }


    /*
    -----------------------------------------
    CONTACT TITLE
    -----------------------------------------
    */

    const contactTitle =
        document.getElementById(
            "contactTitle"
        );


    if (
        contactTitle &&
        settings.contact_title
    ) {

        contactTitle.textContent =
            settings.contact_title;

    }


    /*
    -----------------------------------------
    CONTACT TEXT
    -----------------------------------------
    */

    const contactText =
        document.getElementById(
            "contactText"
        );


    if (
        contactText &&
        settings.contact_text
    ) {

        contactText.textContent =
            settings.contact_text;

    }


    /*
    -----------------------------------------
    INSTAGRAM
    -----------------------------------------
    */

    const instagramLink =
        document.getElementById(
            "instagramLink"
        );


    if (
        instagramLink &&
        settings.instagram_link
    ) {

        instagramLink.href =
            settings.instagram_link;

    }


    /*
    -----------------------------------------
    EMAIL
    -----------------------------------------
    */

    const emailLink =
        document.getElementById(
            "emailLink"
        );


    if (
        emailLink &&
        settings.email
    ) {

        emailLink.href =
            "mailto:" +
            settings.email;


        emailLink.textContent =
            settings.email;

    }


    /*
    -----------------------------------------
    PHONE
    -----------------------------------------
    */

    const phoneLink =
        document.getElementById(
            "phoneLink"
        );


    if (
        phoneLink &&
        settings.phone
    ) {

        const cleanPhone =
            settings.phone.replace(
                /[^0-9+]/g,
                ""
            );


        phoneLink.href =
            "tel:" +
            cleanPhone;


        phoneLink.textContent =
            settings.phone;

    }


    /*
    -----------------------------------------
    ADDRESS
    -----------------------------------------
    */

    const addressText =
        document.getElementById(
            "addressText"
        );


    if (
        addressText &&
        settings.address
    ) {

        addressText.textContent =
            settings.address;

    }

}


/* =========================================
   LOAD PORTFOLIOS
========================================= */

async function loadPortfolios() {

    const portfolioSlider =
        document.getElementById(
            "portfolioSlider"
        );


    const portfolioPrev =
        document.getElementById(
            "portfolioPrev"
        );


    const portfolioNext =
        document.getElementById(
            "portfolioNext"
        );


    if (!portfolioSlider) {

        console.error(
            "portfolioSlider bulunamadı."
        );

        return;

    }


    try {

        portfolioSlider.innerHTML = `

            <div class="portfolio-empty">

                Portföy çalışmaları yükleniyor...

            </div>

        `;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("portfolios")
                .select("*")
                .eq(
                    "status",
                    "active"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            portfolioSlider.innerHTML = `

                <div class="portfolio-empty">

                    Henüz portföy çalışması eklenmedi.

                </div>

            `;


            if (portfolioPrev) {

                portfolioPrev.style.display =
                    "none";

            }


            if (portfolioNext) {

                portfolioNext.style.display =
                    "none";

            }


            return;

        }


        renderPortfolios(
            portfolioSlider,
            data
        );


        initializePortfolioSlider(
            portfolioSlider,
            portfolioPrev,
            portfolioNext
        );

    } catch (error) {

        console.error(
            "Portföyler yüklenirken hata oluştu:",
            error
        );


        portfolioSlider.innerHTML = `

            <div class="portfolio-empty">

                Portföy çalışmaları yüklenirken
                bir hata oluştu.

            </div>

        `;

    }

}


/* =========================================
   RENDER PORTFOLIOS
========================================= */

function renderPortfolios(
    portfolioSlider,
    portfolios
) {

    portfolioSlider.innerHTML =
        "";


    portfolios.forEach(
        function (
            portfolio
        ) {

            const portfolioItem =
                document.createElement(
                    "article"
                );


            portfolioItem.className =
                "portfolio-item";


            const imageContainer =
                document.createElement(
                    "div"
                );


            imageContainer.className =
                "portfolio-item-image";


            const imageUrl =
                getPortfolioImageUrl(
                    portfolio
                );


            if (imageUrl) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    imageUrl;


                image.alt =
                    portfolio.title ||
                    "Portföy çalışması";


                image.loading =
                    "lazy";


                imageContainer.appendChild(
                    image
                );

            }


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "portfolio-item-content";


            if (
                portfolio.category
            ) {

                const category =
                    document.createElement(
                        "div"
                    );


                category.className =
                    "portfolio-item-category";


                category.textContent =
                    portfolio.category;


                content.appendChild(
                    category
                );

            }


            const title =
                document.createElement(
                    "h3"
                );


            title.className =
                "portfolio-item-title";


            title.textContent =
                portfolio.title ||
                "İsimsiz Çalışma";


            content.appendChild(
                title
            );


            if (
                portfolio.description
            ) {

                const description =
                    document.createElement(
                        "p"
                    );


                description.className =
                    "portfolio-item-description";


                description.textContent =
                    portfolio.description;


                content.appendChild(
                    description
                );

            }


            portfolioItem.appendChild(
                imageContainer
            );


            portfolioItem.appendChild(
                content
            );


            if (imageUrl) {

                portfolioItem.style.cursor =
                    "pointer";


                portfolioItem.addEventListener(
                    "click",
                    function () {

                        openPortfolioLightbox(
                            imageUrl,
                            portfolio.title,
                            portfolio.description
                        );

                    }
                );


                portfolioItem.setAttribute(
                    "tabindex",
                    "0"
                );


                portfolioItem.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            openPortfolioLightbox(
                                imageUrl,
                                portfolio.title,
                                portfolio.description
                            );

                        }

                    }
                );

            }


            portfolioSlider.appendChild(
                portfolioItem
            );

        }
    );

}


/* =========================================
   GET PORTFOLIO IMAGE
========================================= */

function getPortfolioImageUrl(
    portfolio
) {

    const possibleKeys = [

        "image_url",

        "image",

        "imageUrl",

        "thumbnail",

        "cover"

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
            typeof portfolio[key] ===
            "string"
        ) {

            return portfolio[key];

        }

    }


    return "";

}


/* =========================================
   PORTFOLIO SLIDER
========================================= */

function initializePortfolioSlider(
    portfolioSlider,
    portfolioPrev,
    portfolioNext
) {

    const items =
        portfolioSlider.querySelectorAll(
            ".portfolio-item"
        );


    if (
        !items ||
        items.length === 0
    ) {

        return;

    }


    let currentIndex =
        0;


    function getVisibleCount() {

        if (
            window.innerWidth <=
            700
        ) {

            return 1;

        }


        if (
            window.innerWidth <=
            1100
        ) {

            return 2;

        }


        return 4;

    }


    function updateSlider() {

        const visibleCount =
            getVisibleCount();


        const maxIndex =
            Math.max(
                0,
                items.length -
                visibleCount
            );


        if (
            currentIndex >
            maxIndex
        ) {

            currentIndex =
                maxIndex;

        }


        const firstItem =
            items[0];


        if (!firstItem) {

            return;

        }


        const itemWidth =
            firstItem.offsetWidth;


        const sliderStyle =
            window.getComputedStyle(
                portfolioSlider
            );


        const gap =
            parseFloat(
                sliderStyle.gap
            ) ||
            20;


        const translateX =
            currentIndex *
            (
                itemWidth +
                gap
            );


        portfolioSlider.style.transform =
            `translateX(-${translateX}px)`;


        if (portfolioPrev) {

            portfolioPrev.style.display =
                items.length >
                visibleCount
                    ? "flex"
                    : "none";

        }


        if (portfolioNext) {

            portfolioNext.style.display =
                items.length >
                visibleCount
                    ? "flex"
                    : "none";

        }

    }


    function goToPrevious() {

        const visibleCount =
            getVisibleCount();


        const maxIndex =
            Math.max(
                0,
                items.length -
                visibleCount
            );


        currentIndex--;


        if (
            currentIndex < 0
        ) {

            currentIndex =
                maxIndex;

        }


        updateSlider();

    }


    function goToNext() {

        const visibleCount =
            getVisibleCount();


        const maxIndex =
            Math.max(
                0,
                items.length -
                visibleCount
            );


        currentIndex++;


        if (
            currentIndex >
            maxIndex
        ) {

            currentIndex =
                0;

        }


        updateSlider();

    }


    if (portfolioPrev) {

        portfolioPrev.addEventListener(
            "click",
            goToPrevious
        );

    }


    if (portfolioNext) {

        portfolioNext.addEventListener(
            "click",
            goToNext
        );

    }


    /*
    MOBİL SWIPE
    */

    let startX =
        0;


    let endX =
        0;


    portfolioSlider.addEventListener(
        "touchstart",
        function (event) {

            startX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    portfolioSlider.addEventListener(
        "touchend",
        function (event) {

            endX =
                event.changedTouches[0]
                    .screenX;


            const difference =
                endX -
                startX;


            if (
                Math.abs(
                    difference
                ) < 50
            ) {

                return;

            }


            if (
                difference < 0
            ) {

                goToNext();

            } else {

                goToPrevious();

            }

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function () {

            updateSlider();

        }
    );


    updateSlider();

}


/* =========================================
   CONTACT SETTINGS
========================================= */

async function loadContactSettings() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("site_settings")
                .select("*")
                .in(
                    "key",
                    [
                        "email",
                        "phone",
                        "address"
                    ]
                );


        if (error) {

            console.error(
                "İletişim bilgileri alınamadı:",
                error
            );

            return;

        }


        const contact = {};


        data.forEach(
            function (item) {

                contact[item.key] =
                    item.value;

            }
        );


        /*
        EMAIL
        */

        const emailLink =
            document.getElementById(
                "emailLink"
            );


        if (
            emailLink &&
            contact.email
        ) {

            emailLink.href =
                "mailto:" +
                contact.email;


            emailLink.textContent =
                contact.email;

        }


        /*
        PHONE
        */

        const phoneLink =
            document.getElementById(
                "phoneLink"
            );


        if (
            phoneLink &&
            contact.phone
        ) {

            phoneLink.href =
                "tel:" +
                contact.phone.replace(
                    /[^0-9+]/g,
                    ""
                );


            phoneLink.textContent =
                contact.phone;

        }


        /*
        ADDRESS
        */

        const addressText =
            document.getElementById(
                "addressText"
            );


        if (
            addressText &&
            contact.address
        ) {

            addressText.textContent =
                contact.address;

        }

    } catch (error) {

        console.error(
            "İletişim bilgileri yüklenirken hata oluştu:",
            error
        );

    }

}


/* =========================================
   LIGHTBOX INITIALIZE
========================================= */

function initializeLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const lightboxClose =
        document.getElementById(
            "lightboxClose"
        );


    if (!lightbox) {

        return;

    }


    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closePortfolioLightbox
        );

    }


    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lightbox
            ) {

                closePortfolioLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closePortfolioLightbox();

            }

        }
    );

}


/* =========================================
   OPEN LIGHTBOX
========================================= */

function openPortfolioLightbox(
    image,
    title,
    description
) {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    const lightboxTitle =
        document.getElementById(
            "lightboxTitle"
        );


    const lightboxDescription =
        document.getElementById(
            "lightboxDescription"
        );


    if (
        !lightbox ||
        !lightboxImage
    ) {

        return;

    }


    lightboxImage.src =
        image;


    lightboxImage.alt =
        title ||
        "Portföy çalışması";


    if (lightboxTitle) {

        lightboxTitle.textContent =
            title ||
            "";

    }


    if (lightboxDescription) {

        lightboxDescription.textContent =
            description ||
            "";

    }


    lightbox.classList.add(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE LIGHTBOX
========================================= */

function closePortfolioLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}
