/* =========================================
   FURKAN KAYA PORTFOLYO SİTESİ
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* =====================================
           SUPABASE KONTROL
        ====================================== */

        if (
            typeof supabaseClient === "undefined"
        ) {

            console.error(
                "Supabase bağlantısı bulunamadı."
            );

            return;

        }


        /* =====================================
           ELEMENTLER
        ====================================== */

        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );

        const mobileMenu =
            document.getElementById(
                "mobileMenu"
            );

        const mobileNavLinks =
            document.querySelectorAll(
                ".mobile-nav-link"
            );


        const portfolioSlider =
            document.getElementById(
                "portfolioSlider"
            );

        const portfolioDots =
            document.getElementById(
                "portfolioDots"
            );

        const portfolioPrev =
            document.getElementById(
                "portfolioPrev"
            );

        const portfolioNext =
            document.getElementById(
                "portfolioNext"
            );


        const heroSmallText =
            document.getElementById(
                "heroSmallText"
            );

        const heroTitle =
            document.getElementById(
                "heroTitle"
            );

        const heroDescription =
            document.getElementById(
                "heroDescription"
            );

        const aboutText =
            document.getElementById(
                "aboutText"
            );


        const contactEmail =
            document.getElementById(
                "contactEmail"
            );

        const contactEmailText =
            document.getElementById(
                "contactEmailText"
            );

        const contactWhatsapp =
            document.getElementById(
                "contactWhatsapp"
            );

        const contactWhatsappText =
            document.getElementById(
                "contactWhatsappText"
            );

        const contactInstagram =
            document.getElementById(
                "contactInstagram"
            );

        const contactInstagramText =
            document.getElementById(
                "contactInstagramText"
            );


        /* =====================================
           FOOTER YILI
        ====================================== */

        const currentYear =
            document.getElementById(
                "currentYear"
            );

        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();

        }


        /* =====================================
           MOBİL MENÜ
        ====================================== */

        if (
            mobileMenuButton &&
            mobileMenu
        ) {

            mobileMenuButton.addEventListener(
                "click",
                () => {

                    const isOpen =
                        mobileMenu.classList.toggle(
                            "active"
                        );


                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        isOpen
                    );


                    mobileMenuButton.setAttribute(
                        "aria-label",
                        isOpen
                            ? "Menüyü kapat"
                            : "Menüyü aç"
                    );

                }
            );

        }


        mobileNavLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        if (
                            mobileMenu &&
                            mobileMenuButton
                        ) {

                            mobileMenu.classList.remove(
                                "active"
                            );


                            mobileMenuButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );


                            mobileMenuButton.setAttribute(
                                "aria-label",
                                "Menüyü aç"
                            );

                        }

                    }
                );

            }
        );


        /* =====================================
           SITE AYARLARINI YÜKLE
        ====================================== */

        async function loadSiteSettings() {

            try {

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("site_settings")
                    .select("*")
                    .limit(1)
                    .maybeSingle();


                if (error) {
                    throw error;
                }


                if (!data) {
                    return;
                }


                if (
                    heroSmallText &&
                    data.hero_small_text
                ) {

                    heroSmallText.textContent =
                        data.hero_small_text;

                }


                if (
                    heroTitle &&
                    data.hero_title
                ) {

                    /*
                       Admin panelinden gelen başlık
                       normal metin olarak gösterilir.
                    */

                    heroTitle.textContent =
                        data.hero_title;

                }


                if (
                    heroDescription &&
                    data.hero_description
                ) {

                    heroDescription.textContent =
                        data.hero_description;

                }


                if (
                    aboutText &&
                    data.about_text
                ) {

                    aboutText.textContent =
                        data.about_text;

                }


                if (
                    data.site_title
                ) {

                    document.title =
                        data.site_title;

                }

            } catch (error) {

                console.error(
                    "Site ayarları yüklenemedi:",
                    error
                );

            }

        }


        /* =====================================
           İLETİŞİM BİLGİLERİNİ YÜKLE
        ====================================== */

        async function loadContactSettings() {

            try {

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("contact_settings")
                    .select("*")
                    .limit(1)
                    .maybeSingle();


                if (error) {
                    throw error;
                }


                if (!data) {
                    return;
                }


                /* E-POSTA */

                if (data.email) {

                    if (contactEmail) {

                        contactEmail.href =
                            `mailto:${data.email}`;

                    }


                    if (contactEmailText) {

                        contactEmailText.textContent =
                            data.email;

                    }

                }


                /* WHATSAPP */

                if (data.whatsapp) {

                    const whatsappNumber =
                        data.whatsapp
                            .replace(
                                /\D/g,
                                ""
                            );


                    if (contactWhatsapp) {

                        contactWhatsapp.href =
                            `https://wa.me/${whatsappNumber}`;

                    }


                    if (contactWhatsappText) {

                        contactWhatsappText.textContent =
                            data.whatsapp;

                    }

                }


                /* INSTAGRAM */

                if (data.instagram) {

                    const instagramUsername =
                        data.instagram
                            .replace(
                                /^@/,
                                ""
                            )
                            .trim();


                    if (contactInstagram) {

                        contactInstagram.href =
                            `https://instagram.com/${instagramUsername}`;

                    }


                    if (contactInstagramText) {

                        contactInstagramText.textContent =
                            `@${instagramUsername}`;

                    }

                }

            } catch (error) {

                console.error(
                    "İletişim bilgileri yüklenemedi:",
                    error
                );

            }

        }


        /* =====================================
           PORTFÖY VERİLERİNİ YÜKLE
        ====================================== */

        async function loadPortfolio() {

            if (!portfolioSlider) {
                return;
            }


            try {

                portfolioSlider.innerHTML =
                    `
                        <div class="portfolio-loading">
                            Çalışmalar yükleniyor...
                        </div>
                    `;


                const {
                    data,
                    error
                } = await supabaseClient
                    .from("portfolio")
                    .select("*")
                    .eq(
                        "is_active",
                        true
                    )
                    .order(
                        "sort_order",
                        {
                            ascending: true
                        }
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

                    portfolioSlider.innerHTML =
                        `
                            <div class="portfolio-empty">
                                Henüz portföy çalışması eklenmedi.
                            </div>
                        `;


                    if (portfolioDots) {

                        portfolioDots.innerHTML =
                            "";

                    }


                    return;

                }


                portfolioSlider.innerHTML =
                    data
                        .map(
                            (item) =>
                                createPortfolioItem(
                                    item
                                )
                        )
                        .join("");


                createPortfolioDots(
                    data.length
                );


                initializePortfolioSlider(
                    data.length
                );

            } catch (error) {

                console.error(
                    "Portföy yükleme hatası:",
                    error
                );


                portfolioSlider.innerHTML =
                    `
                        <div class="portfolio-empty">
                            Portföy çalışmaları yüklenirken
                            bir hata oluştu.
                        </div>
                    `;

            }

        }


        /* =====================================
           PORTFÖY HTML
        ====================================== */

        function createPortfolioItem(
            item
        ) {

            const image =
                item.image_url
                    ? `
                        <img
                            src="${escapeHtmlAttribute(item.image_url)}"
                            alt="${escapeHtmlAttribute(item.title || "Portföy çalışması")}"
                            loading="lazy"
                        >
                    `
                    : `
                        <div class="portfolio-image-placeholder">
                            Görsel bulunamadı
                        </div>
                    `;


            return `
                <article
                    class="portfolio-item"
                >

                    <div class="portfolio-image">
                        ${image}
                    </div>


                    <div class="portfolio-content">

                        <span class="portfolio-number">
                            ${String(
                                item.sort_order || 0
                            ).padStart(
                                2,
                                "0"
                            )}
                        </span>


                        <h3>
                            ${escapeHtml(
                                item.title || ""
                            )}
                        </h3>


                        <p>
                            ${escapeHtml(
                                item.description || ""
                            )}
                        </p>

                    </div>

                </article>
            `;

        }


        /* =====================================
           PORTFÖY NOKTALARI
        ====================================== */

        function createPortfolioDots(
            total
        ) {

            if (!portfolioDots) {
                return;
            }


            portfolioDots.innerHTML =
                "";


            for (
                let index = 0;
                index < total;
                index++
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
                    `${index + 1}. çalışmaya git`
                );


                dot.dataset.index =
                    index;


                portfolioDots.appendChild(
                    dot
                );

            }

        }


        /* =====================================
           PORTFÖY SLIDER
        ====================================== */

        function initializePortfolioSlider(
            total
        ) {

            if (
                !portfolioSlider ||
                total === 0
            ) {
                return;
            }


            let currentIndex = 0;


            const items =
                portfolioSlider.querySelectorAll(
                    ".portfolio-item"
                );


            const dots =
                portfolioDots
                    ? portfolioDots.querySelectorAll(
                        ".portfolio-dot"
                    )
                    : [];


            function updateSlider() {

                if (!items.length) {
                    return;
                }


                const itemWidth =
                    items[0].offsetWidth;


                const gap =
                    getSliderGap();


                portfolioSlider.scrollTo(
                    {
                        left:
                            currentIndex *
                            (
                                itemWidth +
                                gap
                            ),

                        behavior: "smooth"
                    }
                );


                dots.forEach(
                    (
                        dot,
                        index
                    ) => {

                        dot.classList.toggle(
                            "active",
                            index ===
                            currentIndex
                        );

                    }
                );

            }


            function getSliderGap() {

                const sliderStyle =
                    window.getComputedStyle(
                        portfolioSlider
                    );


                const gap =
                    parseFloat(
                        sliderStyle.gap ||
                        sliderStyle.columnGap ||
                        0
                    );


                return isNaN(gap)
                    ? 0
                    : gap;

            }


            function nextSlide() {

                currentIndex =
                    currentIndex >=
                    total - 1
                        ? 0
                        : currentIndex + 1;


                updateSlider();

            }


            function previousSlide() {

                currentIndex =
                    currentIndex <= 0
                        ? total - 1
                        : currentIndex - 1;


                updateSlider();

            }


            if (portfolioNext) {

                portfolioNext.onclick =
                    nextSlide;

            }


            if (portfolioPrev) {

                portfolioPrev.onclick =
                    previousSlide;

            }


            dots.forEach(
                (
                    dot,
                    index
                ) => {

                    dot.addEventListener(
                        "click",
                        () => {

                            currentIndex =
                                index;

                            updateSlider();

                        }
                    );

                }
            );


            /*
               Kullanıcı manuel olarak
               slider'ı kaydırırsa aktif
               noktayı güncelle.
            */

            portfolioSlider.addEventListener(
                "scroll",
                () => {

                    if (!items.length) {
                        return;
                    }


                    const itemWidth =
                        items[0].offsetWidth;


                    const gap =
                        getSliderGap();


                    const position =
                        portfolioSlider.scrollLeft;


                    const newIndex =
                        Math.round(
                            position /
                            (
                                itemWidth +
                                gap
                            )
                        );


                    if (
                        newIndex >= 0 &&
                        newIndex < total
                    ) {

                        currentIndex =
                            newIndex;


                        dots.forEach(
                            (
                                dot,
                                index
                            ) => {

                                dot.classList.toggle(
                                    "active",
                                    index ===
                                    currentIndex
                                );

                            }
                        );

                    }

                }
            );


            updateSlider();

        }


        /* =====================================
           NAVIGATION ACTIVE STATE
        ====================================== */

        const navLinks =
            document.querySelectorAll(
                ".nav-link"
            );


        const sections =
            document.querySelectorAll(
                "main section[id]"
            );


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            navLinks.forEach(
                                (link) => {

                                    link.classList.toggle(
                                        "active",
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        `#${entry.target.id}`
                                    );

                                }
                            );

                        }
                    );

                },
                {
                    threshold: 0.4
                }
            );


        sections.forEach(
            (section) => {

                observer.observe(
                    section
                );

            }
        );


        /* =====================================
           HTML GÜVENLİK
        ====================================== */

        function escapeHtml(
            value
        ) {

            if (
                value === null ||
                value === undefined
            ) {
                return "";
            }


            return String(value)

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
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


        function escapeHtmlAttribute(
            value
        ) {

            return escapeHtml(
                value
            );

        }


        /* =====================================
           SAYFA VERİLERİNİ YÜKLE
        ====================================== */

        await Promise.all([

            loadSiteSettings(),

            loadContactSettings(),

            loadPortfolio()

        ]);

    }
);