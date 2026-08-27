/* =========================================
   FURKAN KAYA PORTFOLIO
   ANA SITE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeCurrentYear();

    initializeNavigation();

    initializePortfolio();

});


/* =========================================
   CURRENT YEAR
========================================= */

function initializeCurrentYear() {

    const currentYear =
        document.getElementById("currentYear");


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
        document.querySelectorAll(".nav-link");


    if (!navLinks.length) {
        return;
    }


    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(function (item) {

                    item.classList.remove("active");

                });


                link.classList.add("active");

            }
        );

    });

}


/* =========================================
   PORTFOLIO
========================================= */

function initializePortfolio() {

    const portfolioSlider =
        document.getElementById("portfolioSlider");

    const portfolioPrev =
        document.getElementById("portfolioPrev");

    const portfolioNext =
        document.getElementById("portfolioNext");

    const portfolioDots =
        document.getElementById("portfolioDots");


    if (!portfolioSlider) {

        console.error(
            "portfolioSlider bulunamadı."
        );

        return;

    }


    const portfolios =
        getPortfoliosFromStorage();


    if (portfolios.length === 0) {

        portfolioSlider.innerHTML = `

            <div
                class="portfolio-loading"
            >
                Henüz portföy çalışması eklenmedi.
            </div>

        `;


        if (portfolioDots) {

            portfolioDots.innerHTML = "";

        }


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


    createPortfolioDots(
        portfolioDots,
        portfolios
    );


    initializePortfolioSlider(
        portfolioSlider,
        portfolioPrev,
        portfolioNext,
        portfolioDots,
        portfolios
    );

}


/* =========================================
   LOCAL STORAGE'DAN PORTFÖYLERİ AL
========================================= */

function getPortfoliosFromStorage() {

    let portfolios = [];


    try {

        const savedPortfolios =
            localStorage.getItem(
                "furkanKayaPortfolios"
            );


        if (!savedPortfolios) {

            console.log(
                "LocalStorage içerisinde furkanKayaPortfolios bulunamadı."
            );

            return [];

        }


        const parsedPortfolios =
            JSON.parse(
                savedPortfolios
            );


        if (!Array.isArray(parsedPortfolios)) {

            console.error(
                "Portföy verisi dizi formatında değil."
            );

            return [];

        }


        portfolios =
            parsedPortfolios.filter(
                function (item) {

                    /*
                    Yönetim panelinde status alanı
                    yoksa da çalışmayı göster.
                    */

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
            "Portföy verileri okunurken hata oluştu:",
            error
        );

    }


    return portfolios;

}


/* =========================================
   PORTFÖYLERİ HTML'E YAZ
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

            const portfolioCard =
                createPortfolioCard(
                    portfolio,
                    index
                );


            portfolioSlider.appendChild(
                portfolioCard
            );

        }
    );

}


/* =========================================
   PORTFÖY KARTI OLUŞTUR
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


        const placeholderTitle =
            document.createElement(
                "span"
            );


        placeholderTitle.textContent =
            category ||
            "TASARIM";


        const placeholderNumber =
            document.createElement(
                "strong"
            );


        placeholderNumber.textContent =
            String(
                index + 1
            ).padStart(
                2,
                "0"
            );


        placeholder.appendChild(
            placeholderTitle
        );


        placeholder.appendChild(
            placeholderNumber
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


    /*
    Kart tıklandığında
    görseli lightbox içerisinde aç.
    */

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


                if (!image) {
                    return;
                }


                openPortfolioLightbox(
                    image,
                    title,
                    description
                );

            }

        }
    );


    return article;

}


/* =========================================
   PORTFÖY DEĞERİ BUL
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
   PORTFÖY GÖRSELİ BUL
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
   DOTS OLUŞTUR
========================================= */

function createPortfolioDots(
    portfolioDots,
    portfolios
) {

    if (!portfolioDots) {
        return;
    }


    portfolioDots.innerHTML = "";


    portfolios.forEach(
        function (
            portfolio,
            index
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
                    index + 1
                ) +
                ". çalışmaya git"
            );


            dot.dataset.index =
                index;


            portfolioDots.appendChild(
                dot
            );

        }
    );

}


/* =========================================
   PORTFÖY SLIDER
========================================= */

function initializePortfolioSlider(
    portfolioSlider,
    portfolioPrev,
    portfolioNext,
    portfolioDots,
    portfolios
) {

    const cards =
        portfolioSlider.querySelectorAll(
            ".portfolio-card"
        );


    if (!cards.length) {
        return;
    }


    let currentIndex = 0;


    function updateSlider() {

        cards.forEach(
            function (
                card,
                index
            ) {

                if (
                    index === currentIndex
                ) {

                    card.style.display =
                        "block";


                    card.classList.add(
                        "active"
                    );

                } else {

                    card.style.display =
                        "none";


                    card.classList.remove(
                        "active"
                    );

                }

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
                        index === currentIndex
                    );

                }
            );

        }

    }


    function goToSlide(
        index
    ) {

        currentIndex =
            index;


        if (
            currentIndex <
            0
        ) {

            currentIndex =
                cards.length - 1;

        }


        if (
            currentIndex >=
            cards.length
        ) {

            currentIndex =
                0;

        }


        updateSlider();

    }


    if (
        portfolioPrev
    ) {

        if (
            cards.length <= 1
        ) {

            portfolioPrev.style.display =
                "none";

        } else {

            portfolioPrev.style.display =
                "flex";

        }


        portfolioPrev.addEventListener(
            "click",
            function () {

                goToSlide(
                    currentIndex - 1
                );

            }
        );

    }


    if (
        portfolioNext
    ) {

        if (
            cards.length <= 1
        ) {

            portfolioNext.style.display =
                "none";

        } else {

            portfolioNext.style.display =
                "flex";

        }


        portfolioNext.addEventListener(
            "click",
            function () {

                goToSlide(
                    currentIndex + 1
                );

            }
        );

    }


    if (
        portfolioDots
    ) {

        const dots =
            portfolioDots.querySelectorAll(
                ".portfolio-dot"
            );


        dots.forEach(
            function (
                dot,
                index
            ) {

                dot.addEventListener(
                    "click",
                    function () {

                        goToSlide(
                            index
                        );

                    }
                );

            }
        );

    }


    /*
    Klavye yön tuşları
    */

    document.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key ===
                "ArrowLeft"
            ) {

                goToSlide(
                    currentIndex - 1
                );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                goToSlide(
                    currentIndex + 1
                );

            }

        }
    );


    /*
    Mobil swipe
    */

    let touchStartX = 0;

    let touchEndX = 0;


    portfolioSlider.addEventListener(
        "touchstart",
        function (
            event
        ) {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );


    portfolioSlider.addEventListener(
        "touchend",
        function (
            event
        ) {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            handleSwipe();

        },
        {
            passive: true
        }
    );


    function handleSwipe() {

        const swipeDistance =
            touchEndX -
            touchStartX;


        if (
            Math.abs(
                swipeDistance
            ) <
            50
        ) {

            return;

        }


        if (
            swipeDistance <
            0
        ) {

            goToSlide(
                currentIndex + 1
            );

        } else {

            goToSlide(
                currentIndex - 1
            );

        }

    }


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


    lightboxImage.src =
        image;


    lightboxImage.alt =
        title ||
        "Portföy çalışması";


    if (
        lightboxTitle
    ) {

        lightboxTitle.textContent =
            title ||
            "";

    }


    if (
        lightboxDescription
    ) {

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
   LIGHTBOX BAŞLAT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const lightbox =
            document.getElementById(
                "lightbox"
            );


        const lightboxClose =
            document.getElementById(
                "lightboxClose"
            );


        if (
            !lightbox
        ) {

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


        if (
            lightboxClose
        ) {

            lightboxClose.addEventListener(
                "click",
                closeLightbox
            );

        }


        lightbox.addEventListener(
            "click",
            function (
                event
            ) {

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
            function (
                event
            ) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }

            }
        );

    }
);


/* =========================================
   STORAGE DEĞİŞİKLİĞİNİ DİNLE
========================================= */

window.addEventListener(
    "storage",
    function (
        event
    ) {

        if (
            event.key ===
            "furkanKayaPortfolios"
        ) {

            window.location.reload();

        }

    }
);
