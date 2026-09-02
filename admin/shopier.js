/* =========================================
   FURKAN KAYA
   ONLINE ÜRÜNLER YÖNETİMİ
========================================= */

(function () {
    "use strict";

    const SETTINGS_TABLE = "site_settings";
    const SETTING_KEY = "online_products";
    const STORAGE_BUCKET = "portfolio-images";

    let products = [];
    let editingId = null;

    document.addEventListener("DOMContentLoaded", initialize);

    async function initialize() {
        const client = window.supabaseClient;

        if (!client) {
            showMessage("Supabase bağlantısı bulunamadı.", "error");
            return;
        }

        try {
            const sessionResult = await client.auth.getSession();

            if (
                sessionResult.error ||
                !sessionResult.data ||
                !sessionResult.data.session
            ) {
                window.location.replace("login.html");
                return;
            }

            bindEvents();
            await loadAll(client);
        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Sayfa başlatılamadı.",
                "error"
            );
        }
    }

    function bindEvents() {
        document
            .getElementById("settingsForm")
            .addEventListener("submit", saveSettings);

        document
            .getElementById("productForm")
            .addEventListener("submit", saveProduct);

        document
            .getElementById("cancelEditButton")
            .addEventListener("click", resetForm);

        document
            .getElementById("products")
            .addEventListener("click", handleProductAction);
    }

    async function loadAll(client) {
        const settings = await loadSettings(client);

        setValue(
            "sectionTitle",
            settings.online_products_title || "Online Ürünler"
        );

        setValue(
            "sectionSubtitle",
            settings.online_products_subtitle ||
                "Online ürünlerime göz atın"
        );

        setValue(
            "sectionDescription",
            settings.online_products_description ||
                "Tasarımlarımı ve ürünlerimi Shopier mağazamdan inceleyebilirsiniz."
        );

        setValue(
            "storeButton",
            settings.online_products_button ||
                "Shopier Mağazasını Gör"
        );

        setValue(
            "storeUrl",
            settings.online_products_shop_url || ""
        );

        products = parseProducts(settings[SETTING_KEY]);
        renderProducts();
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

    async function saveSettings(event) {
        event.preventDefault();

        const client = window.supabaseClient;
        const button = event.currentTarget.querySelector(
            'button[type="submit"]'
        );

        const settings = {
            online_products_title: getValue("sectionTitle"),
            online_products_subtitle: getValue("sectionSubtitle"),
            online_products_description: getValue("sectionDescription"),
            online_products_button: getValue("storeButton"),
            online_products_shop_url: getValue("storeUrl")
        };

        try {
            button.disabled = true;
            button.textContent = "Kaydediliyor...";

            await saveSettingsObject(client, settings);

            showMessage("Vitrin ayarları kaydedildi.", "success");
        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Ayarlar kaydedilemedi.",
                "error"
            );
        } finally {
            button.disabled = false;
            button.textContent = "Ayarları Kaydet";
        }
    }

    async function saveProduct(event) {
        event.preventDefault();

        const client = window.supabaseClient;
        const button = document.getElementById("saveProductButton");

        const title = getValue("productTitle");
        const description = getValue("productDescription");
        const price = getValue("productPrice");
        const shopierUrl = getValue("productUrl");
        const active = document.getElementById("productActive").checked;
        const file = document.getElementById("productImage").files[0];

        if (!title) {
            showMessage("Ürün adı zorunludur.", "error");
            return;
        }

        if (!isSafeUrl(shopierUrl)) {
            showMessage(
                "Lütfen geçerli bir Shopier bağlantısı gir.",
                "error"
            );
            return;
        }

        try {
            button.disabled = true;
            button.textContent = "Kaydediliyor...";

            let imageUrl = "";

            if (editingId) {
                const existing = products.find(function (item) {
                    return item.id === editingId;
                });

                imageUrl = existing ? existing.image_url || "" : "";
            }

            if (file) {
                imageUrl = await uploadImage(client, file);
            }

            const item = {
                id: editingId || createId(),
                title: title,
                description: description,
                price: price,
                image_url: imageUrl,
                shopier_url: shopierUrl,
                active: active
            };

            if (editingId) {
                products = products.map(function (product) {
                    return product.id === editingId ? item : product;
                });
            } else {
                products.push(item);
            }

            await saveProducts(client);

            showMessage(
                editingId
                    ? "Ürün güncellendi."
                    : "Ürün eklendi.",
                "success"
            );

            resetForm();
            renderProducts();
        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "Ürün kaydedilemedi.",
                "error"
            );
        } finally {
            button.disabled = false;
            button.textContent = editingId
                ? "Ürünü Güncelle"
                : "Ürünü Kaydet";
        }
    }

    async function uploadImage(client, file) {
        if (!file.type.startsWith("image/")) {
            throw new Error("Lütfen geçerli bir görsel seç.");
        }

        const extension =
            file.name.includes(".")
                ? file.name.split(".").pop().toLowerCase()
                : "jpg";

        const fileName =
            "shopier/" +
            Date.now() +
            "-" +
            Math.random().toString(36).slice(2) +
            "." +
            extension;

        const { error } = await client
            .storage
            .from(STORAGE_BUCKET)
            .upload(fileName, file, {
                upsert: false,
                contentType: file.type
            });

        if (error) {
            throw error;
        }

        const { data } = client
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(fileName);

        if (!data || !data.publicUrl) {
            throw new Error("Görsel bağlantısı oluşturulamadı.");
        }

        return data.publicUrl;
    }

    async function saveProducts(client) {
        await saveSettingsObject(client, {
            [SETTING_KEY]: JSON.stringify(products)
        });
    }

    function renderProducts() {
        const container = document.getElementById("products");

        if (!products.length) {
            container.innerHTML = `
                <div class="empty">
                    Henüz ürün eklenmedi. İlk ürününü yukarıdaki formdan ekleyebilirsin.
                </div>
            `;
            return;
        }

        container.innerHTML = products
            .map(function (product, index) {
                const image = product.image_url && isSafeUrl(product.image_url)
                    ? `
                        <img
                            src="${escapeAttribute(product.image_url)}"
                            alt="${escapeAttribute(product.title)}"
                        >
                    `
                    : `<div class="product-placeholder">FK</div>`;

                return `
                    <article class="product">
                        ${image}

                        <div>
                            <h3>${escapeHtml(product.title)}</h3>
                            ${
                                product.price
                                    ? `<p>${escapeHtml(product.price)}</p>`
                                    : ""
                            }
                            <p>
                                ${product.active ? "Vitrinde aktif" : "Vitrinde gizli"}
                            </p>
                            <small>${escapeHtml(product.shopier_url)}</small>
                        </div>

                        <div class="product-actions">
                            <button
                                type="button"
                                class="secondary"
                                data-action="up"
                                data-index="${index}"
                                ${index === 0 ? "disabled" : ""}
                            >↑ Yukarı</button>

                            <button
                                type="button"
                                class="secondary"
                                data-action="down"
                                data-index="${index}"
                                ${index === products.length - 1 ? "disabled" : ""}
                            >↓ Aşağı</button>

                            <button
                                type="button"
                                class="secondary"
                                data-action="edit"
                                data-id="${escapeAttribute(product.id)}"
                            >Düzenle</button>

                            <button
                                type="button"
                                class="danger"
                                data-action="delete"
                                data-id="${escapeAttribute(product.id)}"
                            >Sil</button>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    async function handleProductAction(event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const client = window.supabaseClient;
        const action = button.dataset.action;
        const index = Number(button.dataset.index);

        try {
            if (action === "edit") {
                editProduct(button.dataset.id);
                return;
            }

            if (action === "delete") {
                if (
                    !window.confirm(
                        "Bu ürünü vitrinden silmek istediğine emin misin?"
                    )
                ) {
                    return;
                }

                products = products.filter(function (product) {
                    return product.id !== button.dataset.id;
                });

                await saveProducts(client);
                showMessage("Ürün silindi.", "success");
                renderProducts();
                return;
            }

            if (action === "up" && index > 0) {
                const temp = products[index - 1];
                products[index - 1] = products[index];
                products[index] = temp;

                await saveProducts(client);
                renderProducts();
                return;
            }

            if (
                action === "down" &&
                index >= 0 &&
                index < products.length - 1
            ) {
                const temp = products[index + 1];
                products[index + 1] = products[index];
                products[index] = temp;

                await saveProducts(client);
                renderProducts();
            }
        } catch (error) {
            console.error(error);
            showMessage(
                error.message || "İşlem gerçekleştirilemedi.",
                "error"
            );
        }
    }

    function editProduct(id) {
        const product = products.find(function (item) {
            return item.id === id;
        });

        if (!product) {
            return;
        }

        editingId = id;

        setValue("productTitle", product.title);
        setValue("productDescription", product.description);
        setValue("productPrice", product.price);
        setValue("productUrl", product.shopier_url);

        document.getElementById("productActive").checked =
            product.active !== false;

        document.getElementById("productImage").value = "";

        document.getElementById("formTitle").textContent =
            "Ürünü Düzenle";

        document.getElementById("saveProductButton").textContent =
            "Ürünü Güncelle";

        document.getElementById("cancelEditButton").style.display =
            "inline-flex";

        document
            .getElementById("formTitle")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }

    function resetForm() {
        editingId = null;

        document.getElementById("productForm").reset();
        document.getElementById("productActive").checked = true;

        document.getElementById("formTitle").textContent =
            "Yeni Ürün Ekle";

        document.getElementById("saveProductButton").textContent =
            "Ürünü Kaydet";

        document.getElementById("cancelEditButton").style.display =
            "none";
    }

    async function saveSettingsObject(client, settings) {
        const { data, error } = await client
            .from(SETTINGS_TABLE)
            .select("*");

        if (error) {
            throw error;
        }

        const existing = Array.isArray(data) ? data : [];

        for (const [key, value] of Object.entries(settings)) {
            const current = existing.find(function (item) {
                return (
                    item.setting_key === key ||
                    item.key === key
                );
            });

            if (current) {
                const updateData = {};

                if (
                    Object.prototype.hasOwnProperty.call(
                        current,
                        "setting_value"
                    )
                ) {
                    updateData.setting_value = value;
                } else {
                    updateData.value = value;
                }

                let query = client
                    .from(SETTINGS_TABLE)
                    .update(updateData);

                if (current.id !== undefined && current.id !== null) {
                    query = query.eq("id", current.id);
                } else if (
                    Object.prototype.hasOwnProperty.call(
                        current,
                        "setting_key"
                    )
                ) {
                    query = query.eq("setting_key", key);
                } else {
                    query = query.eq("key", key);
                }

                const result = await query;

                if (result.error) {
                    throw result.error;
                }

                continue;
            }

            let result = await client
                .from(SETTINGS_TABLE)
                .insert([
                    {
                        setting_key: key,
                        setting_value: value
                    }
                ]);

            if (
                result.error &&
                result.error.message &&
                (
                    result.error.message.includes("setting_key") ||
                    result.error.message.includes("setting_value")
                )
            ) {
                result = await client
                    .from(SETTINGS_TABLE)
                    .insert([
                        {
                            key: key,
                            value: value
                        }
                    ]);
            }

            if (result.error) {
                throw result.error;
            }
        }
    }

    function parseProducts(raw) {
        if (!raw) {
            return [];
        }

        try {
            const parsed =
                typeof raw === "string"
                    ? JSON.parse(raw)
                    : raw;

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed.map(function (product, index) {
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
            console.error(error);
            return [];
        }
    }

    function createId() {
        return (
            Date.now().toString(36) +
            "-" +
            Math.random().toString(36).slice(2, 10)
        );
    }

    function isSafeUrl(value) {
        try {
            const url = new URL(String(value), window.location.href);

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );
        } catch (error) {
            return false;
        }
    }

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function setValue(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.value = value ?? "";
        }
    }

    function showMessage(message, type) {
        const box = document.getElementById("message");

        box.textContent = message;
        box.className = "message show " + (
            type === "error"
                ? "error"
                : "success"
        );
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
