/* =========================================
   FURKAN KAYA PORTFOLIO
   ONLINE ÜRÜNLER / SHOPIER VİTRİNİ
   Bu dosya mevcut site dosyalarını değiştirmeden
   online ürünler bölümünü dinamik olarak oluşturur.
========================================= */

(function () {
    "use strict";

    const SETTINGS_TABLE = "site_settings";
    const SETTING_KEY = "online_products";
    const STORAGE_BUCKET = "portfolio-images";

    const FALLBACK = {
        title: "Online Ürünler",
        subtitle: "Online ürünlerime göz atın",
        description:
            "Tasarımlarımı ve ürünlerimi Shopier mağazamdan inceleyebilirsiniz.",
        button: "Shopier Mağazasını Gör"
    };

    document.addEventListener("DOMContentLoaded", init);

    async function init() {
        const client = window.supabaseClient;

        if (!client) {
            console.warn("Online ürünler: Supabase bağlantısı bulunamadı.");
            return;
        }

        try {
            const settings = await loadSettings(client);
            const products = parseProducts(settings[SETTING_KEY]);

            renderSection(
                settings.online_products_title || FALLBACK.title,
                settings.online_products_subtitle || FALLBACK.subtitle,
                settings.online_products_description || FALLBACK.description,
                settings.online_products_button || FALLBACK.button,
                settings.online_products_shop_url || "",
                products
            );
        } catch (error) {
            console.warn("Online ürünler yüklenemedi:", error);
        }
    }

    async function loadSettings(client) {
        const { data, error } = await client
            .from(SETTINGS_TABLE)
            .select("*");

        if (error) {
            throw error;
        }

        const settings = {};

        (data || []).forEach(function (item) {
            const key = item.setting_key ?? item.key;
            const value = item.setting_value ?? item.value ?? "";

            if (key) {
                settings[key] = value;
            }
        });

        return settings;
    }

    function parseProducts(raw) {
        if (!raw) {
            return [];
        }

        try {
            const parsed = typeof raw === "string"
                ? JSON.parse(raw)
                : raw;

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed
                .filter(function (product) {
                    return product &&
                        product.active !== false &&
                        product.title &&
                        product.shopier_url;
                })
                .map(function (product, index) {
                    return {
                        id: product.id || String(index + 1),
                        title: String(product.title || ""),
                        description: String(product.description || ""),
                        price: String(product.price || ""),
                        image_url: String(product.image_url || ""),
                        shopier_url: String(product.shopier_url || ""),
                        active: product.active !== false
                    };
                });
        } catch (error) {
            console.warn("Online ürün verisi okunamadı:", error);
            return [];
        }
    }

    function renderSection(
        title,
        subtitle,
        description,
        buttonText,
        shopUrl,
        products
    ) {
        const contact = document.getElementById("contact");
        const main = document.querySelector("main");

        if (!main || !contact || !products.length) {
            return;
        }

        const old = document.getElementById("online-products");
        if (old) {
            old.remove();
        }

        const section = document.createElement("section");
        section.className = "online-products-section";
        section.id = "online-products";

        section.innerHTML = `
            <div class="section-container">
                <div class="online-products-heading">
                    <div>
                        <span class="section-small-title">
                            ${escapeHtml(title)}
                        </span>

                        <h2>
                            ${escapeHtml(subtitle)}
                        </h2>
                    </div>

                    <div class="online-products-intro">
                        <p>${escapeHtml(description)}</p>

                        ${
                            isSafeUrl(shopUrl)
                                ? `
                                    <a
                                        class="online-products-store-button"
                                        href="${escapeAttribute(shopUrl)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        ${escapeHtml(buttonText)}
                                        <span>↗</span>
                                    </a>
                                `
                                : ""
                        }
                    </div>
                </div>

                <div class="online-products-slider-wrapper">
                    <button
                        type="button"
                        class="online-products-arrow online-products-prev"
                        aria-label="Önceki ürün"
                    >←</button>

                    <div class="online-products-viewport">
                        <div class="online-products-slider">
                            ${products.map(createProductCard).join("")}
                        </div>
                    </div>

                    <button
                        type="button"
                        class="online-products-arrow online-products-next"
                        aria-label="Sonraki ürün"
                    >→</button>
                </div>

                <div class="online-products-dots" aria-label="Ürün sayfaları"></div>
            </div>
        `;

        main.insertBefore(section, contact);

        injectStyles();
        initializeSlider(section);
    }

    function createProductCard(product) {
        const image = product.image_url && isSafeUrl(product.image_url)
            ? `
                <div class="online-product-image">
                    <img
                        src="${escapeAttribute(product.image_url)}"
                        alt="${escapeAttribute(product.title)}"
                        loading="lazy"
                    >
                </div>
            `
            : `
                <div class="online-product-image online-product-image-empty">
                    <span>FK</span>
                </div>
            `;

        const price = product.price
            ? `<strong class="online-product-price">${escapeHtml(product.price)}</strong>`
            : "";

        return `
            <article class="online-product-card">
                ${image}

                <div class="online-product-content">
                    <div class="online-product-top">
                        <h3>${escapeHtml(product.title)}</h3>
                        ${price}
                    </div>

                    ${
                        product.description
                            ? `<p>${escapeHtml(product.description)}</p>`
                            : ""
                    }

                    <a
                        class="online-product-button"
                        href="${escapeAttribute(product.shopier_url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Shopier'de İncele
                        <span>→</span>
                    </a>
                </div>
            </article>
        `;
    }

    function initializeSlider(section) {
        const viewport = section.querySelector(".online-products-viewport");
        const slider = section.querySelector(".online-products-slider");
        const cards = Array.from(
            section.querySelectorAll(".online-product-card")
        );
        const previous = section.querySelector(".online-products-prev");
        const next = section.querySelector(".online-products-next");
        const dots = section.querySelector(".online-products-dots");

        if (!viewport || !slider || !cards.length) {
            return;
        }

        let page = 0;
        let timer = null;

        function perPage() {
            if (window.innerWidth <= 700) {
                return 1;
            }

            if (window.innerWidth <= 1050) {
                return 2;
            }

            return 3;
        }

        function pages() {
            return Math.max(1, Math.ceil(cards.length / perPage()));
        }

        function renderDots() {
            if (!dots) {
                return;
            }

            dots.innerHTML = "";

            for (let i = 0; i < pages(); i++) {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "online-products-dot";
                dot.setAttribute("aria-label", "Ürün sayfası " + (i + 1));

                dot.addEventListener("click", function () {
                    page = i;
                    update();
                    restartAuto();
                });

                dots.appendChild(dot);
            }
        }

        function update() {
            const count = perPage();
            const total = pages();

            if (page >= total) {
                page = total - 1;
            }

            const offset = page * (100 / count);

            slider.style.transform = `translateX(-${offset}%)`;

            cards.forEach(function (card) {
                card.style.flexBasis = `calc(${100 / count}% - ${count === 1 ? 0 : 16}px)`;
            });

            if (previous) {
                previous.style.display = total > 1 ? "flex" : "none";
            }

            if (next) {
                next.style.display = total > 1 ? "flex" : "none";
            }

            if (dots) {
                dots.querySelectorAll(".online-products-dot").forEach(
                    function (dot, index) {
                        dot.classList.toggle("active", index === page);
                    }
                );
            }
        }

        function move(direction) {
            const total = pages();

            page += direction;

            if (page < 0) {
                page = total - 1;
            }

            if (page >= total) {
                page = 0;
            }

            update();
            restartAuto();
        }

        function restartAuto() {
            clearInterval(timer);

            if (pages() > 1) {
                timer = setInterval(function () {
                    move(1);
                }, 5000);
            }
        }

        if (previous) {
            previous.addEventListener("click", function () {
                move(-1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                move(1);
            });
        }

        viewport.addEventListener("mouseenter", function () {
            clearInterval(timer);
        });

        viewport.addEventListener("mouseleave", restartAuto);

        window.addEventListener("resize", function () {
            renderDots();
            update();
            restartAuto();
        });

        renderDots();
        update();
        restartAuto();
    }

    function injectStyles() {
        if (document.getElementById("fkOnlineProductsStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "fkOnlineProductsStyles";

        style.textContent = `
            .online-products-section {
                position: relative;
                padding: 110px 0;
                background: #0b0b0b;
                overflow: hidden;
            }

            .online-products-heading {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(280px, 460px);
                gap: 60px;
                align-items: end;
                margin-bottom: 55px;
            }

            .online-products-heading h2 {
                margin: 12px 0 0;
            }

            .online-products-intro {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 22px;
            }

            .online-products-intro p {
                margin: 0;
                line-height: 1.7;
                opacity: .72;
            }

            .online-products-store-button,
            .online-product-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
                text-decoration: none;
                transition: .25s ease;
            }

            .online-products-store-button {
                min-height: 52px;
                padding: 0 22px;
                border: 1px solid rgba(255,255,255,.22);
                color: inherit;
            }

            .online-products-store-button:hover {
                border-color: currentColor;
                transform: translateY(-2px);
            }

            .online-products-slider-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                gap: 18px;
            }

            .online-products-viewport {
                min-width: 0;
                width: 100%;
                overflow: hidden;
            }

            .online-products-slider {
                display: flex;
                gap: 16px;
                transition: transform .45s cubic-bezier(.2,.8,.2,1);
                will-change: transform;
            }

            .online-product-card {
                flex: 0 0 calc(33.333% - 11px);
                min-width: 0;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,.12);
                background: rgba(255,255,255,.025);
            }

            .online-product-image {
                position: relative;
                aspect-ratio: 1 / 1;
                overflow: hidden;
                background: #141414;
            }

            .online-product-image img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
                transition: transform .5s ease;
            }

            .online-product-card:hover .online-product-image img {
                transform: scale(1.035);
            }

            .online-product-image-empty {
                display: grid;
                place-items: center;
                font-size: 54px;
                font-weight: 800;
                letter-spacing: -4px;
                opacity: .45;
            }

            .online-product-content {
                padding: 24px;
            }

            .online-product-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 16px;
            }

            .online-product-top h3 {
                margin: 0;
                font-size: 20px;
                line-height: 1.2;
            }

            .online-product-price {
                white-space: nowrap;
                font-size: 16px;
            }

            .online-product-content p {
                margin: 12px 0 22px;
                line-height: 1.6;
                opacity: .65;
                font-size: 14px;
            }

            .online-product-button {
                width: 100%;
                min-height: 50px;
                padding: 0 16px;
                border: 1px solid rgba(255,255,255,.16);
                color: inherit;
                font-size: 13px;
                font-weight: 600;
            }

            .online-product-button:hover {
                background: rgba(255,255,255,.06);
                border-color: rgba(255,255,255,.35);
            }

            .online-products-arrow {
                flex: 0 0 48px;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid rgba(255,255,255,.16);
                background: transparent;
                color: inherit;
                cursor: pointer;
                font-size: 20px;
                transition: .25s ease;
                z-index: 2;
            }

            .online-products-arrow:hover {
                border-color: rgba(255,255,255,.5);
                transform: translateY(-2px);
            }

            .online-products-dots {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 28px;
            }

            .online-products-dot {
                width: 7px;
                height: 7px;
                padding: 0;
                border: 0;
                border-radius: 50%;
                background: currentColor;
                opacity: .22;
                cursor: pointer;
            }

            .online-products-dot.active {
                opacity: 1;
            }

            @media (max-width: 1050px) {
                .online-product-card {
                    flex-basis: calc(50% - 8px);
                }

                .online-products-heading {
                    gap: 35px;
                }
            }

            @media (max-width: 800px) {
                .online-products-section {
                    padding: 72px 0;
                }

                .online-products-heading {
                    grid-template-columns: 1fr;
                    gap: 25px;
                    margin-bottom: 35px;
                }

                .online-products-slider-wrapper {
                    gap: 8px;
                }

                .online-product-card {
                    flex-basis: 100%;
                }

                .online-products-arrow {
                    flex: 0 0 42px;
                    width: 42px;
                    height: 42px;
                    font-size: 17px;
                }

                .online-product-content {
                    padding: 20px;
                }
            }

            @media (max-width: 500px) {
                .online-products-section {
                    padding: 60px 0;
                }

                .online-products-slider-wrapper {
                    gap: 6px;
                }

                .online-products-arrow {
                    flex-basis: 38px;
                    width: 38px;
                    height: 38px;
                }

                .online-product-top h3 {
                    font-size: 18px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function isSafeUrl(value) {
        try {
            const url = new URL(String(value), window.location.href);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (error) {
            return false;
        }
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }
})();
