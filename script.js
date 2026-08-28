/* =========================================
   FURKAN KAYA PORTFOLIO
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", async function () {
    initializeCurrentYear();
    initializeNavigation();
    initializeMobileMenu();
    initializeLightbox();

    await initializePortfolio();
});


/* =========================================
   CURRENT YEAR
========================================= */

function initializeCurrentYear() {
    const currentYear = document.getElementById("currentYear");

    if (!currentYear) {
        return;
    }

    currentYear.textContent = new Date().getFullYear();
}


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    if (!sections.length) {
        return;
    }

    window.addEventListener("scroll", function () {
        let currentSection = "";

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === "#" + currentSection
            );
        });
    });
}


/* =========================================
   MOBILE MENU
========================================= */

function initializeMobileMenu() {
    const button = document.getElementById("mobileMenuButton");
    const menu = document.getElementById("mobileMenu");

    if (!button || !menu) {
        return;
    }

    button.addEventListener("click", function () {
        const isOpen = menu.classList.toggle("open");

        button.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );
    });

    const mobileLinks = menu.querySelectorAll(".mobile-nav-link");

    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            menu.classList.remove("open");

            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}


/* =========================================
   PORTFOLIO INITIALIZE
========================================= */

async function initializePortfolio() {
    const portfolioSlider =
        document.getElementById("portfolioSlider");

    const portfolioPrev =
        document.getElementById("portfolioPrev");

    const portfolioNext =
        document.getElementById("portfolioNext");

    const portfolioDots =
        document.getElementById("portfolioDots");

    if (!portfolioSlider) {
        return;
    }

    portfolioSlider.innerHTML = `
        <div class="portfolio-loading">
            Çalışmalar yükleniyor...
        </div>
    `;

    try {
        const portfolios =
            await getPortfoliosFromSupabase();

        if (!portfolios.length) {
            portfolioSlider.innerHTML = `
                <div class="portfolio-loading">
                    Henüz portföy çalışması eklenmedi.
                </div>
            `;

            if (portfolioPrev) {
                portfolioPrev.style.display = "none";
            }

            if (portfolioNext) {
                portfolioNext.style.display = "none";
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
            portfolioPrev,
            portfolioNext,
            portfolioDots
        );

    } catch (error) {
        console.error(
            "Portföyler yüklenirken hata oluştu:",
            error
        );

        portfolioSlider.innerHTML = `
            <div class="portfolio-loading">
                Portföy çalışmaları yüklenemedi.
            </div>
        `;

        if (portfolioPrev) {
            portfolioPrev.style.display = "none";
        }

        if (portfolioNext) {
            portfolioNext.style.display = "none";
        }

        if (portfolioDots) {
            portfolioDots.innerHTML = "";
        }
    }
}


/* =========================================
   GET PORTFOLIOS FROM SUPABASE
========================================= */

async function getPortfoliosFromSupabase() {
    const client =
        window.supabaseClient;

    if (!client) {
        throw new Error(
            "Supabase bağlantısı bulunamadı. supabase.js dosyasını kontrol edin."
        );
    }

    const response = await client
        .from("portfolios")
        .select("*");

    if (response.error) {
        throw response.error;
    }

    const portfolios = Array.isArray(response.data)
        ? response.data
        : [];

    return portfolios
        .filter(function (portfolio) {
            return isPortfolioActive(portfolio);
        })
        .sort(function (a, b) {
            return getPortfolioSortValue(b) -
                getPortfolioSortValue(a);
        });
}


/* =========================================
   PORTFOLIO STATUS
========================================= */

function isPortfolioActive(portfolio) {
    const status = portfolio.status;

    if (
        status === undefined ||
        status === null ||
        status === ""
    ) {
        return true;
    }

    if (status === true || status === 1) {
        return true;
    }

    const normalizedStatus =
        String(status)
            .trim()
            .toLowerCase();

    return (
        normalizedStatus === "active" ||
        normalizedStatus === "aktif" ||
        normalizedStatus === "published" ||
        normalizedStatus === "true" ||
        normalizedStatus === "1"
    );
}


/* =========================================
   PORTFOLIO SORT
========================================= */

function getPortfolioSortValue(portfolio) {
    const possibleDateFields = [
        "created_at",
        "updated_at",
        "date"
    ];

    for (let i = 0; i < possibleDateFields.length; i++) {
        const value =
            portfolio[possibleDateFields[i]];

        if (value) {
            const time =
                new Date(value).getTime();

            if (!Number.isNaN(time)) {
                return time;
            }
        }
    }

    const numericId =
        Number(portfolio.id);

    if (!Number.isNaN(numericId)) {
        return numericId;
    }

    return 0;
}


/* =========================================
   RENDER PORTFOLIOS
========================================= */

function renderPortfolios(
    portfolioSlider,
    portfolios
) {
    portfolioSlider.innerHTML = "";

    portfolios.forEach(function (
        portfolio,
        index
    ) {
        const card =
            createPortfolioCard(
                portfolio,
                index
            );

        portfolioSlider.appendChild(card);
    });
}


/* =========================================
   CREATE PORTFOLIO CARD
========================================= */

function createPortfolioCard(
    portfolio,
    index
) {
    const article =
        document.createElement("article");

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
        getPortfolioImage(portfolio);

    const imageContainer =
        document.createElement("div");

    imageContainer.className =
        "portfolio-image";

    if (image) {
        const img =
            document.createElement("img");

        img.src = image;
        img.alt = title;
        img.loading = "lazy";

        img.addEventListener(
            "error",
            function () {
                imageContainer.innerHTML = "";

                const placeholder =
                    createPortfolioPlaceholder(
                        category,
                        index
                    );

                imageContainer.appendChild(
                    placeholder
                );
            }
        );

        imageContainer.appendChild(img);

    } else {
        const placeholder =
            createPortfolioPlaceholder(
                category,
                index
            );

        imageContainer.appendChild(
            placeholder
        );
    }

    const info =
        document.createElement("div");

    info.className =
        "portfolio-info";

    const categoryElement =
        document.createElement("span");

    categoryElement.className =
        "portfolio-category";

    categoryElement.textContent =
        category;

    const heading =
        document.createElement("h3");

    heading.textContent =
        title;

    info.appendChild(categoryElement);
    info.appendChild(heading);

    if (description) {
        const paragraph =
            document.createElement("p");

        paragraph.textContent =
            description;

        info.appendChild(paragraph);
    }

    article.appendChild(imageContainer);
    article.appendChild(info);

    function openCard() {
        if (!image) {
            return;
        }

        openPortfolioLightbox(
            image,
            title,
            description
        );
    }

    article.addEventListener(
        "click",
        openCard
    );

    article.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                openCard();
            }
        }
    );

    return article;
}


/* =========================================
   PORTFOLIO PLACEHOLDER
========================================= */

function createPortfolioPlaceholder(
    category,
    index
) {
    const placeholder =
        document.createElement("div");

    placeholder.className =
        "portfolio-placeholder";

    const categoryText =
        document.createElement("span");

    categoryText.textContent =
        category;

    const number =
        document.createElement("strong");

    number.textContent =
        String(index + 1).padStart(
            2,
            "0"
        );

    placeholder.appendChild(categoryText);
    placeholder.appendChild(number);

    return placeholder;
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

        const value =
            portfolio[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return String(value);
        }
    }

    return defaultValue;
}


/* =========================================
   GET PORTFOLIO IMAGE
========================================= */

function getPortfolioImage(
    portfolio
) {
    const possibleKeys = [
        "image_url",
        "image",
        "imageUrl",
        "image_data",
        "imageData",
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

        const value =
            portfolio[key];

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return String(value);
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

    if (!cards.length) {
        return;
    }

    let currentPage = 0;

    function getCardsPerPage() {
        if (window.innerWidth <= 800) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 4;
    }

    function getTotalPages() {
        return Math.max(
            1,
            Math.ceil(
                cards.length /
                getCardsPerPage()
            )
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
                document.createElement("button");

            dot.type = "button";

            dot.className =
                "portfolio-dot";

            dot.setAttribute(
                "aria-label",
                (i + 1) +
                ". sayfaya git"
            );

            dot.addEventListener(
                "click",
                function () {
                    currentPage = i;

                    updateSlider();
                }
            );

            portfolioDots.appendChild(dot);
        }
    }

    function updateSlider() {
        const cardsPerPage =
            getCardsPerPage();

        const totalPages =
            getTotalPages();

        if (currentPage >= totalPages) {
            currentPage =
                totalPages - 1;
        }

        if (currentPage < 0) {
            currentPage = 0;
        }

        const start =
            currentPage *
            cardsPerPage;

        const end =
            start +
            cardsPerPage;

        cards.forEach(function (
            card,
            index
        ) {
            const visible =
                index >= start &&
                index < end;

            card.style.display =
                visible
                    ? "block"
                    : "none";
        });

        if (portfolioDots) {
            const dots =
                portfolioDots.querySelectorAll(
                    ".portfolio-dot"
                );

            dots.forEach(function (
                dot,
                index
            ) {
                dot.classList.toggle(
                    "active",
                    index === currentPage
                );
            });
        }

        const showNavigation =
            totalPages > 1;

        if (portfolioPrev) {
            portfolioPrev.style.display =
                showNavigation
                    ? "flex"
                    : "none";
        }

        if (portfolioNext) {
            portfolioNext.style.display =
                showNavigation
                    ? "flex"
                    : "none";
        }
    }

    function nextPage() {
        currentPage++;

        if (
            currentPage >=
            getTotalPages()
        ) {
            currentPage = 0;
        }

        updateSlider();
    }

    function previousPage() {
        currentPage--;

        if (currentPage < 0) {
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
            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {
                return;
            }

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
            if (
                !event.changedTouches ||
                !event.changedTouches.length
            ) {
                return;
            }

            const touchEndX =
                event.changedTouches[0].screenX;

            const distance =
                touchEndX -
                touchStartX;

            if (Math.abs(distance) <= 50) {
                return;
            }

            if (distance < 0) {
                nextPage();
            } else {
                previousPage();
            }
        },
        {
            passive: true
        }
    );

    let resizeTimer = null;

    window.addEventListener(
        "resize",
        function () {
            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(
                    function () {
                        const totalPages =
                            getTotalPages();

                        if (
                            currentPage >=
                            totalPages
                        ) {
                            currentPage =
                                totalPages - 1;
                        }

                        createDots();
                        updateSlider();
                    },
                    150
                );
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
    lightboxImage.alt = title || "";

    if (lightboxTitle) {
        lightboxTitle.textContent =
            title || "";
    }

    if (lightboxDescription) {
        lightboxDescription.textContent =
            description || "";
    }

    lightbox.classList.add("active");

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
        lightbox.classList.remove("active");

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
                event.key === "Escape" &&
                lightbox.classList.contains(
                    "active"
                )
            ) {
                closeLightbox();
            }
        }
    );
}


/* =========================================
   OPTIONAL REALTIME PORTFOLIO REFRESH
========================================= */

function initializePortfolioRealtime() {
    const client =
        window.supabaseClient;

    if (
        !client ||
        typeof client.channel !== "function"
    ) {
        return;
    }

    try {
        client
            .channel(
                "portfolio-realtime-channel"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "portfolios"
                },
                function () {
                    initializePortfolio();
                }
            )
            .subscribe();

    } catch (error) {
        console.warn(
            "Portföy gerçek zamanlı yenileme başlatılamadı:",
            error
        );
    }
}


/* =========================================
   START REALTIME AFTER PAGE LOAD
========================================= */

window.addEventListener(
    "load",
    function () {
        initializePortfolioRealtime();
    }
);
