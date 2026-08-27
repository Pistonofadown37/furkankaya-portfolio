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


    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    window.addEventListener(
        "scroll",
        function () {

            let currentSection = "";


            sections.forEach(
                function (section) {

                    const sectionTop =
                        section.offsetTop - 150;


                    const sectionHeight =
                        section.offsetHeight;


                    if (
                        window.scrollY >= sectionTop &&
                        window.scrollY <
                        sectionTop + sectionHeight
                    ) {

                        currentSection =
                            section.getAttribute(
                                "id"
                            );

                    }

                }
            );


            navLinks.forEach(
                function (link) {

                    const href =
                        link.getAttribute(
                            "href"
                        );


                    link.classList.toggle(
                        "active",
                        href ===
                        "#" + currentSection
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


    if (
        !button ||
        !menu
    ) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            const isOpen =
                menu.classList.toggle(
                    "open"
                );


            button.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );


    const mobileLinks =
        menu.querySelectorAll(
            ".mobile-nav-link"
        );


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove(
                        "open"
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


    if (!portfolioSlider) {

        return;

    }


    const portfolios =
        getPortfoliosFromStorage();


    if (
        portfolios.length === 0
    ) {

        portfolioSlider.innerHTML = `

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


        return;

    }


    renderPortfolios(
        portfolioSlider,
        portfolios
    );


    initializePortfolioSlider(
        portfolioSlider,
        portfolioPrev,
        portfolioNext,
        portfolioDots
    );

}


/* =========================================
   GET PORTFOLIOS
========================================= */

function getPortfoliosFromStorage() {

    try {

        const savedPortfolios =
            localStorage.getItem(
                "furkanKayaPortfolios"
            );


        if (!savedPortfolios) {

            return [];

        }


        const portfolios =
            JSON.parse(
                savedPortfolios
            );


        if (
            !Array.isArray(
                portfolios
            )
        ) {

            return [];

        }


        return portfolios.filter(
            function (item) {

                if (
                    item.status === undefined
                ) {

                    return true;

                }


                return (

                    item.status === true ||

                    item.status === "active" ||

                    item.status === "aktif"

                );

            }
        );

    } catch (error) {

        console.error(
            "Portföy verisi okunamadı:",
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
   CREATE PORTFOLIO CARD
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


    article.setAttribute(
        "tabindex",
        "0"
    );


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
            "TASARIM"
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


        img.src = image;

        img.alt = title;

        img.loading = "lazy";


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
            category;


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


    const categoryElement =
        document.createElement(
            "span"
        );


    categoryElement.className =
        "portfolio-category";


    categoryElement.textContent =
        category;


    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        title;


    info.appendChild(
        categoryElement
    );


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

            if (image) {

                openPortfolioLightbox(
                    image,
                    title,
                    description
                );

            }

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
   GET VALUE
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
   PORTFOLIO SLIDER
========================================= */

function initializePortfolioSlider(
    portfolioSlider,
    portfolioPrev,
    portfolioNext,
    portfolioDots
) {

    const cards =
        Array.from(
            portfolioSlider.querySelectorAll(
                ".portfolio-card"
            )
        );


    if (
        cards.length === 0
    ) {

        return;

    }


    let currentPage = 0;


    function getCardsPerPage() {

        if (
            window.innerWidth <= 800
        ) {

            return 1;

        }


        if (
            window.innerWidth <= 1100
        ) {

            return 2;

        }


        return 4;

    }


    function getTotalPages() {

        return Math.ceil(
            cards.length /
            getCardsPerPage()
        );

    }


    function createDots() {

        if (!portfolioDots) {

            return;

        }


        portfolioDots.innerHTML = "";


        const totalPages =
            getTotalPages();


        for (
            let i = 0;
            i < totalPages;
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
                (
                    i + 1
                ) +
                ". sayfaya git"
            );


            dot.addEventListener(
                "click",
                function () {

                    currentPage = i;

                    updateSlider();

                }
            );


            portfolioDots.appendChild(
                dot
            );

        }

    }


    function updateSlider() {

        const cardsPerPage =
            getCardsPerPage();


        const totalPages =
            getTotalPages();


        if (
            currentPage >= totalPages
        ) {

            currentPage =
                totalPages - 1;

        }


        cards.forEach(
            function (
                card,
                index
            ) {

                const start =
                    currentPage *
                    cardsPerPage;


                const end =
                    start +
                    cardsPerPage;


                const visible =
                    index >= start &&
                    index < end;


                card.style.display =
                    visible
                        ? "block"
                        : "none";

            }
        );


        if (portfolioDots) {

            const dots =
                portfolioDots.querySelectorAll(
                    ".portfolio-dot"
                );


            dots.forEach(
                function (
                    dot,
                    index
                ) {

                    dot.classList.toggle(
                        "active",
                        index === currentPage
                    );

                }
            );

        }


        if (portfolioPrev) {

            portfolioPrev.style.display =
                totalPages > 1
                    ? "flex"
                    : "none";

        }


        if (portfolioNext) {

            portfolioNext.style.display =
                totalPages > 1
                    ? "flex"
                    : "none";

        }

    }


    function nextPage() {

        currentPage++;


        if (
            currentPage >= getTotalPages()
        ) {

            currentPage = 0;

        }


        updateSlider();

    }


    function previousPage() {

        currentPage--;


        if (
            currentPage < 0
        ) {

            currentPage =
                getTotalPages() - 1;

        }


        updateSlider();

    }


    if (portfolioNext) {

        portfolioNext.addEventListener(
            "click",
            nextPage
        );

    }


    if (portfolioPrev) {

        portfolioPrev.addEventListener(
            "click",
            previousPage
        );

    }


    let touchStartX = 0;


    portfolioSlider.addEventListener(
        "touchstart",
        function (event) {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    portfolioSlider.addEventListener(
        "touchend",
        function (event) {

            const touchEndX =
                event.changedTouches[0].screenX;


            const distance =
                touchEndX -
                touchStartX;


            if (
                Math.abs(distance) > 50
            ) {

                if (
                    distance < 0
                ) {

                    nextPage();

                } else {

                    previousPage();

                }

            }

        },
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function () {

            createDots();

            updateSlider();

        }
    );


    createDots();

    updateSlider();

}


/* =========================================
   LIGHTBOX
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


    lightboxImage.src = image;

    lightboxImage.alt = title;


    if (lightboxTitle) {

        lightboxTitle.textContent =
            title || "";

    }


    if (lightboxDescription) {

        lightboxDescription.textContent =
            description || "";

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
   LIGHTBOX CLOSE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

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


            document.body.style.overflow =
                "";

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
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeLightbox();

                }

            }
        );

    }
);


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
