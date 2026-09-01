/* =========================================
   FURKAN KAYA PORTFOLIO
   MAIN JAVASCRIPT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {
        initializeCurrentYear();
        initializeNavigation();
        initializeMobileMenu();
        initializeLightbox();

        await Promise.all([
            initializeSiteSettings(),
            initializePortfolio()
        ]);
    }
);


/* =========================================
   CURRENT YEAR
========================================= */

function initializeCurrentYear() {
    const element =
        document.getElementById("currentYear");

    if (element) {
        element.textContent =
            new Date().getFullYear();
    }
}


/* =========================================
   NAVIGATION
========================================= */

function initializeNavigation() {
    const links =
        document.querySelectorAll(".nav-link");

    const sections =
        document.querySelectorAll("section[id]");

    links.forEach(function (link) {
        link.addEventListener(
            "click",
            function () {
                links.forEach(function (item) {
                    item.classList.remove("active");
                });

                link.classList.add("active");
            }
        );
    });

    if (!sections.length) {
        return;
    }

    window.addEventListener(
        "scroll",
        function () {
            let current = "";

            sections.forEach(function (section) {
                const top =
                    section.offsetTop - 150;

                const height =
                    section.offsetHeight;

                if (
                    window.scrollY >= top &&
                    window.scrollY <
                        top + height
                ) {
                    current =
                        section.id;
                }
            });

            links.forEach(function (link) {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                        "#" + current
                );
            });
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
                menu.classList.toggle("open");

            button.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        }
    );

    menu
        .querySelectorAll(".mobile-nav-link")
        .forEach(function (link) {
            link.addEventListener(
                "click",
                function () {
                    menu.classList.remove("open");

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );
        });
}


/* =========================================
   SITE SETTINGS
========================================= */

async function initializeSiteSettings() {
    const client =
        window.supabaseClient;

    if (!client) {
        console.warn(
            "Supabase bağlantısı bulunamadı."
        );
        return;
    }

    try {
        const {
            data,
            error
        } =
            await client
                .from("site_settings")
                .select("*");

        if (error) {
            throw error;
        }

        const settings = {};

        (data || []).forEach(
            function (item) {
                const key =
                    item.setting_key ??
                    item.key;

                const value =
                    item.setting_value ??
                    item.value ??
                    "";

                if (key) {
                    settings[key] = value;
                }
            }
        );

        applySiteSettings(settings);

    } catch (error) {
        console.error(
            "Site ayarları yüklenirken hata:",
            error
        );
    }
}


function applySiteSettings(settings) {

    const siteTitle =
        settings.site_title ||
        settings.site_name ||
        "";

    const heroTitle =
        settings.hero_title || "";

    const heroText =
        settings.hero_text ||
        settings.hero_description ||
        "";

    const instagram =
        settings.instagram_link ||
        settings.instagram ||
        "";

    const email =
        settings.contact_email ||
        settings.email_address ||
        settings.email ||
        "";

    const phone =
        settings.contact_phone ||
        settings.whatsapp ||
        "";

    /* SITE TITLE */

    if (siteTitle) {
        document.title =
            siteTitle +
            " | Grafik Tasarım";

        document
            .querySelectorAll(
                ".site-logo strong"
            )
            .forEach(
                function (element) {
                    const words =
                        siteTitle
                            .trim()
                            .split(/\s+/);

                    element.textContent =
                        words[0] || siteTitle;
                }
            );

        document
            .querySelectorAll(
                ".site-logo span"
            )
            .forEach(
                function (element) {
                    const words =
                        siteTitle
                            .trim()
                            .split(/\s+/);

                    if (words.length > 1) {
                        element.textContent =
                            words
                                .slice(1)
                                .join(" ") + ".";
                    }
                }
            );
    }

    /* HERO TITLE */

    if (heroTitle) {
        const element =
            document.querySelector(
                ".hero-title"
            );

        if (element) {
            element.textContent =
                heroTitle;
        }
    }

    /* HERO TEXT */

    if (heroText) {
        const element =
            document.querySelector(
                ".hero-description"
            );

        if (element) {
            element.textContent =
                heroText;
        }
    }

    /* EMAIL */

    if (email) {
        const emailLink =
            document.getElementById(
                "contactEmail"
            );

        const emailText =
            document.getElementById(
                "contactEmailText"
            );

        if (emailLink) {
            emailLink.href =
                "mailto:" + email;
        }

        if (emailText) {
            emailText.textContent =
                email;
        }
    }

    /* PHONE / WHATSAPP */

    if (phone) {
        const whatsappLink =
            document.getElementById(
                "contactWhatsapp"
            );

        const whatsappText =
            document.getElementById(
                "contactWhatsappText"
            );

        const cleanPhone =
            phone.replace(/\D/g, "");

        if (whatsappLink) {
            whatsappLink.href =
                "https://wa.me/" +
                cleanPhone;
        }

        if (whatsappText) {
            whatsappText.textContent =
                phone;
        }
    }

    /* INSTAGRAM */

    if (instagram) {
        const instagramLink =
            document.getElementById(
                "contactInstagram"
            );

        const instagramText =
            document.getElementById(
                "contactInstagramText"
            );

        if (instagramLink) {
            instagramLink.href =
                instagram;
        }

        if (instagramText) {
            try {
                const url =
                    new URL(instagram);

                instagramText.textContent =
                    url.pathname
                        .replace(/\//g, "") ||
                    instagram;

            } catch (error) {
                instagramText.textContent =
                    instagram;
            }
        }
    }
}


/* =========================================
   PORTFOLIO
========================================= */

async function initializePortfolio() {
    const slider =
        document.getElementById(
            "portfolioSlider"
        );

    if (!slider) {
        return;
    }

    const previous =
        document.getElementById(
            "portfolioPrev"
        );

    const next =
        document.getElementById(
            "portfolioNext"
        );

    const dots =
        document.getElementById(
            "portfolioDots"
        );

    slider.innerHTML =
        "<div class=\"portfolio-loading\">Çalışmalar yükleniyor...</div>";

    try {
        const portfolios =
            await getPortfolios();

        if (!portfolios.length) {
            slider.innerHTML =
                "<div class=\"portfolio-loading\">Henüz portföy çalışması bulunmuyor.</div>";

            if (previous) {
                previous.style.display = "none";
            }

            if (next) {
                next.style.display = "none";
            }

            if (dots) {
                dots.innerHTML = "";
            }

            return;
        }

        slider.innerHTML = "";

        portfolios.forEach(
            function (portfolio) {
                slider.appendChild(
                    createPortfolioCard(
                        portfolio
                    )
                );
            }
        );

        initializePortfolioSlider(
            slider,
            previous,
            next,
            dots
        );

    } catch (error) {
        console.error(error);

        slider.innerHTML =
            "<div class=\"portfolio-loading\">Portföyler yüklenemedi.</div>";
    }
}


async function getPortfolios() {
    const client =
        window.supabaseClient;

    if (!client) {
        throw new Error(
            "Supabase bağlantısı bulunamadı."
        );
    }

    let result =
        await client
            .from("portfolios")
            .select("*")
            .order(
                "created_at",
                { ascending: false }
            );

    if (result.error) {
        result =
            await client
                .from("portfolios")
                .select("*");
    }

    if (result.error) {
        throw result.error;
    }

    return (result.data || [])
        .filter(function (item) {
            return (
                !item.status ||
                item.status === "active" ||
                item.status === "aktif"
            );
        });
}


function createPortfolioCard(portfolio) {
    const card =
        document.createElement("article");

    card.className =
        "portfolio-card";

    const image =
        portfolio.image_url || "";

    const title =
        portfolio.title ||
        "İsimsiz Çalışma";

    const category =
        portfolio.category ||
        "TASARIM";

    const description =
        portfolio.description || "";

    card.innerHTML = `
        <div class="portfolio-image">
            ${
                image
                    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">`
                    : `<div class="portfolio-placeholder"><span>${escapeHtml(category)}</span></div>`
            }
        </div>

        <div class="portfolio-info">
            <span class="portfolio-category">
                ${escapeHtml(category)}
            </span>

            <h3>
                ${escapeHtml(title)}
            </h3>

            ${
                description
                    ? `<p>${escapeHtml(description)}</p>`
                    : ""
            }
        </div>
    `;

    if (image) {
        card.addEventListener(
            "click",
            function () {
                openPortfolioLightbox(
                    image,
                    title,
                    description
                );
            }
        );
    }

    return card;
}


/* =========================================
   PORTFOLIO SLIDER
========================================= */

function initializePortfolioSlider(
    slider,
    previous,
    next,
    dotsContainer
) {
    const cards =
        Array.from(
            slider.querySelectorAll(
                ".portfolio-card"
            )
        );

    let currentPage = 0;

    function cardsPerPage() {
        if (window.innerWidth <= 800) {
            return 1;
        }

        if (window.innerWidth <= 1100) {
            return 2;
        }

        return 4;
    }

    function totalPages() {
        return Math.max(
            1,
            Math.ceil(
                cards.length /
                cardsPerPage()
            )
        );
    }

    function renderDots() {
        if (!dotsContainer) {
            return;
        }

        dotsContainer.innerHTML = "";

        for (
            let i = 0;
            i < totalPages();
            i++
        ) {
            const dot =
                document.createElement(
                    "button"
                );

            dot.type = "button";
            dot.className =
                "portfolio-dot";

            dot.addEventListener(
                "click",
                function () {
                    currentPage = i;
                    update();
                }
            );

            dotsContainer.appendChild(dot);
        }
    }

    function update() {
        const perPage =
            cardsPerPage();

        const pages =
            totalPages();

        if (currentPage >= pages) {
            currentPage = pages - 1;
        }

        cards.forEach(
            function (card, index) {
                const start =
                    currentPage * perPage;

                const end =
                    start + perPage;

                card.style.display =
                    index >= start &&
                    index < end
                        ? "block"
                        : "none";
            }
        );

        if (dotsContainer) {
            dotsContainer
                .querySelectorAll(
                    ".portfolio-dot"
                )
                .forEach(
                    function (dot, index) {
                        dot.classList.toggle(
                            "active",
                            index === currentPage
                        );
                    }
                );
        }

        const show =
            pages > 1;

        if (previous) {
            previous.style.display =
                show ? "flex" : "none";
        }

        if (next) {
            next.style.display =
                show ? "flex" : "none";
        }
    }

    if (previous) {
        previous.onclick =
            function () {
                currentPage--;

                if (currentPage < 0) {
                    currentPage =
                        totalPages() - 1;
                }

                update();
            };
    }

    if (next) {
        next.onclick =
            function () {
                currentPage++;

                if (
                    currentPage >=
                    totalPages()
                ) {
                    currentPage = 0;
                }

                update();
            };
    }

    window.addEventListener(
        "resize",
        function () {
            renderDots();
            update();
        }
    );

    renderDots();
    update();
}


/* =========================================
   LIGHTBOX
========================================= */

function initializeLightbox() {
    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const close =
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

    if (close) {
        close.addEventListener(
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


function openPortfolioLightbox(
    image,
    title,
    description
) {
    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const imageElement =
        document.getElementById(
            "lightboxImage"
        );

    const titleElement =
        document.getElementById(
            "lightboxTitle"
        );

    const descriptionElement =
        document.getElementById(
            "lightboxDescription"
        );

    if (!lightbox || !imageElement) {
        return;
    }

    imageElement.src = image;
    imageElement.alt = title || "";

    if (titleElement) {
        titleElement.textContent =
            title || "";
    }

    if (descriptionElement) {
        descriptionElement.textContent =
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
   ESCAPE
========================================= */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
