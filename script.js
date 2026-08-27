/* =========================================
   FURKAN KAYA PORTFOLIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeCurrentYear();

        initializeNavigation();

        initializeMobileMenu();

        initializePortfolio();

        initializeLightbox();

    }
);


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
   NAVIGATION
========================================= */

function initializeNavigation() {

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


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
   MOBILE MENU
========================================= */

function initializeMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (!button || !menu) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const isOpen =
                menu.classList.toggle(
                    "active"
                );


            button.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );


            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        }
    );


    const links =
        menu.querySelectorAll(
            ".mobile-nav-link"
        );


    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "active"
                    );


                    document.body.classList.remove(
                        "menu-open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================
   PORTFOLIO INITIALIZE
========================================= */

function initializePortfolio() {

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


    const portfolioDots =
        document.getElementById(
            "portfolioDots"
        );


    const portfolioViewport =
        document.getElementById(
            "portfolioViewport"
        );


    if (
        !portfolioSlider ||
        !portfolioViewport
    ) {

        console.error(
            "Portföy slider elemanları bulunamadı."
        );

        return;

    }


    const portfolios =
        getPortfoliosFromStorage();


    if (
        portfolios.length === 0
    ) {

        portfolioSlider.innerHTML =
            `
            <div class="portfolio-loading">
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


        if (portfolioDots) {
            portfolioDots.innerHTML = "";
        }


        return;

    }


    renderPortfolios(
        portfolioSlider,
        portfolios
    );


    initializePortfolioSlider(
        portfolioSlider,
        portfolioViewport,
        portfolioPrev,
        portfolioNext,
        portfolioDots
    );

}


/* =========================================
   STORAGE DATA
========================================= */

function getPortfoliosFromStorage() {

    try {

        const savedPortfolios =
            localStorage.getItem(
                "furkanKayaPortfolios"
            );


        if (!savedPortfolios) {

            console.log(
                "Portföy verisi bulunamadı."
            );

            return [];

        }


        const parsedPortfolios =
            JSON.parse(
                savedPortfolios
            );


        if (
            !Array.isArray(
                parsedPortfolios
            )
        ) {

            return [];

        }


        return parsedPortfolios.filter(
            function (item) {

                if (
                    !item.status
                ) {
                    return true;
                }


                return (
                    item.status === "active" ||
                    item.status === true ||
                    item.status === "aktif"
                );

            }
        );

    } catch (error) {

        console.error(
            "Portföy verileri okunamadı:",
            error
        );


        return [];

    }

}


/* =========================================
   RENDER PORTFOLIOS
========================================= */

function renderPortfolios(
    portfolioSlider,
    portfolios
) {

    portfolioSlider.innerHTML = "";


    portfolios.forEach(
        function (
            portfolio,
            index
        ) {

            const card =
                createPortfolioCard(
                    portfolio,
                    index
                );


            portfolioSlider.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CREATE CARD
========================================= */

function createPortfolioCard(
    portfolio,
    index
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "portfolio-card";


    article.tabIndex =
        0;


    const title =
        getPortfolioValue(
            portfolio,
            [
                "title",
                "name",
                "baslik"
            ],
            "İsimsiz Çalışma"
        );


    const description =
        getPortfolioValue(
            portfolio,
            [
                "description",
                "content",
                "aciklama"
            ],
            ""
        );


    const category =
        getPortfolioValue(
            portfolio,
            [
                "category",
                "type",
                "kategori"
            ],
            ""
        );


    const image =
        getPortfolioImage(
            portfolio
        );


    const imageContainer =
        document.createElement(
            "div"
        );


    imageContainer.className =
        "portfolio-image";


    if (image) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            image;


        img.alt =
            title;


        img.loading =
            "lazy";


        imageContainer.appendChild(
            img
        );

    } else {

        const placeholder =
            document.createElement(
                "div"
            );


        placeholder.className =
            "portfolio-placeholder";


        const categoryText =
            document.createElement(
                "span"
            );


        categoryText.textContent =
            category ||
            "TASARIM";


        const number =
            document.createElement(
                "strong"
            );


        number.textContent =
            String(
                index + 1
            ).padStart(
                2,
                "0"
            );


        placeholder.appendChild(
            categoryText
        );


        placeholder.appendChild(
            number
        );


        imageContainer.appendChild(
            placeholder
        );

    }


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "portfolio-info";


    if (category) {

        const categoryElement =
            document.createElement(
                "span"
            );


        categoryElement.className =
            "portfolio-category";


        categoryElement.textContent =
            category;


        info.appendChild(
            categoryElement
        );

    }


    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        title;


    info.appendChild(
        heading
    );


    if (description) {

        const paragraph =
            document.createElement(
                "p"
            );


        paragraph.textContent =
            description;


        info.appendChild(
            paragraph
        );

    }


    article.appendChild(
        imageContainer
    );


    article.appendChild(
        info
    );


    article.addEventListener(
        "click",
        function () {

            if (!image) {
                return;
            }


            openPortfolioLightbox(
                image,
                title,
                description
            );

        }
    );


    article.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                if (image) {

                    openPortfolioLightbox(
                        image,
                        title,
                        description
                    );

                }

            }

        }
    );


    return article;

}


/* =========================================
   GET PORTFOLIO VALUE
========================================= */

function getPortfolioValue(
    portfolio,
    possibleKeys,
    defaultValue
) {

    for (
        let i = 0;
        i < possibleKeys.length;
        i++
    ) {

        const key =
            possibleKeys[i];


        if (
            portfolio[key] !== undefined &&
            portfolio[key] !== null &&
            portfolio[key] !== ""
        ) {

            return String(
                portfolio[key]
            );

        }

    }


    return defaultValue;

}


/* =========================================
   GET IMAGE
========================================= */

function getPortfolioImage(
    portfolio
) {

    const possibleKeys = [

        "image",
        "imageUrl",
        "image_url",
        "imageData",
        "image_data",
        "thumbnail",
        "thumbnailUrl",
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
            portfolio[key] !== undefined &&
            portfolio[key] !== null &&
            portfolio[key] !== ""
        ) {

            return portfolio[key];

        }

    }


    return "";

}


/* =========================================
   RESPONSIVE CARD COUNT
========================================= */

function getVisibleCardCount() {

    const width =
        window.innerWidth;


    if (width <= 700) {
        return 1;
    }


    if (width <= 1100) {
        return 2;
    }


    return 4;

}


/* =========================================
   SLIDER
========================================= */

function initializePortfolioSlider(
    slider,
    viewport,
    prevButton,
    nextButton,
    dotsContainer
) {

    const cards =
        Array.from(
            slider.querySelectorAll(
                ".portfolio-card"
            )
        );


    if (
        cards.length === 0
    ) {
        return;
    }


    let currentIndex = 0;

    let autoplayTimer = null;

    let touchStartX = 0;

    let touchEndX = 0;


    function getMaximumIndex() {

        const visibleCards =
            getVisibleCardCount();


        return Math.max(
            0,
            cards.length -
            visibleCards
        );

    }


    function getCardWidth() {

        if (!cards[0]) {
            return 0;
        }


        const cardWidth =
            cards[0].getBoundingClientRect()
                .width;


        const sliderStyle =
            window.getComputedStyle(
                slider
            );


        const gap =
            parseFloat(
                sliderStyle.gap
            ) || 0;


        return cardWidth + gap;

    }


    function updateDots() {

        if (!dotsContainer) {
            return;
        }


        const dots =
            dotsContainer.querySelectorAll(
                ".portfolio-dot"
            );


        dots.forEach(
            function (
                dot,
                index
            ) {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    function updateButtons() {

        const maximumIndex =
            getMaximumIndex();


        if (prevButton) {

            prevButton.style.display =
                maximumIndex === 0
                    ? "none"
                    : "flex";

        }


        if (nextButton) {

            nextButton.style.display =
                maximumIndex === 0
                    ? "none"
                    : "flex";

        }

    }


    function updateSlider() {

        const maximumIndex =
            getMaximumIndex();


        if (
            currentIndex >
            maximumIndex
        ) {

            currentIndex =
                maximumIndex;

        }


        if (
            currentIndex < 0
        ) {

            currentIndex = 0;

        }


        const translateAmount =
            currentIndex *
            getCardWidth();


        slider.style.transform =
            `translateX(-${translateAmount}px)`;


        updateDots();

        updateButtons();

    }


    function createDots() {

        if (!dotsContainer) {
            return;
        }


        dotsContainer.innerHTML = "";


        const maximumIndex =
            getMaximumIndex();


        for (
            let i = 0;
            i <= maximumIndex;
            i++
        ) {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type =
                "button";


            dot.className =
                "portfolio-dot";


            dot.setAttribute(
                "aria-label",
                `${i + 1}. portföy grubuna git`
            );


            dot.addEventListener(
                "click",
                function () {

                    currentIndex =
                        i;


                    updateSlider();

                    restartAutoplay();

                }
            );


            dotsContainer.appendChild(
                dot
            );

        }


        updateDots();

    }


    function goNext() {

        const maximumIndex =
            getMaximumIndex();


        if (
            currentIndex >=
            maximumIndex
        ) {

            currentIndex = 0;

        } else {

            currentIndex++;

        }


        updateSlider();

    }


    function goPrevious() {

        const maximumIndex =
            getMaximumIndex();


        if (
            currentIndex <= 0
        ) {

            currentIndex =
                maximumIndex;

        } else {

            currentIndex--;

        }


        updateSlider();

    }


    function startAutoplay() {

        if (
            cards.length <=
            getVisibleCardCount()
        ) {

            return;

        }


        stopAutoplay();


        autoplayTimer =
            setInterval(
                function () {

                    goNext();

                },
                4000
            );

    }


    function stopAutoplay() {

        if (autoplayTimer) {

            clearInterval(
                autoplayTimer
            );


            autoplayTimer = null;

        }

    }


    function restartAutoplay() {

        stopAutoplay();

        startAutoplay();

    }


    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                goPrevious();

                restartAutoplay();

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                goNext();

                restartAutoplay();

            }
        );

    }


    viewport.addEventListener(
        "mouseenter",
        stopAutoplay
    );


    viewport.addEventListener(
        "mouseleave",
        startAutoplay
    );


    viewport.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0]
                    .screenX;


            stopAutoplay();

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchend",
        function (event) {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) >
                50
            ) {

                if (
                    distance < 0
                ) {

                    goNext();

                } else {

                    goPrevious();

                }

            }


            startAutoplay();

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function () {

            const maximumIndex =
                getMaximumIndex();


            if (
                currentIndex >
                maximumIndex
            ) {

                currentIndex =
                    maximumIndex;

            }


            createDots();

            updateSlider();

        }
    );


    createDots();

    updateSlider();

    startAutoplay();

}


/* =========================================
   LIGHTBOX INITIALIZE
========================================= */

function initializeLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const closeButton =
        document.getElementById(
            "lightboxClose"
        );


    if (!lightbox) {
        return;
    }


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

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

                closeLightbox();

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


    document.body.classList.add(
        "lightbox-open"
    );

}


/* =========================================
   STORAGE CHANGE
========================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            "furkanKayaPortfolios"
        ) {

            window.location.reload();

        }

    }
);
