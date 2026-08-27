/* =========================================
   FURKAN KAYA ADMIN PANEL
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        if (
            typeof supabaseClient === "undefined"
        ) {
            console.error(
                "Supabase bağlantısı bulunamadı."
            );

            alert(
                "Supabase bağlantısı bulunamadı."
            );

            return;
        }


        /* =====================================
           ELEMENTLER
        ====================================== */

        const navButtons =
            document.querySelectorAll(
                ".admin-nav-button"
            );

        const sections =
            document.querySelectorAll(
                ".admin-panel-section"
            );

        const pageTitle =
            document.getElementById(
                "pageTitle"
            );

        const pageEyebrow =
            document.getElementById(
                "pageEyebrow"
            );

        const adminMessage =
            document.getElementById(
                "adminMessage"
            );

        const adminUserEmail =
            document.getElementById(
                "adminUserEmail"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        /* =====================================
           PORTFOLYO ELEMENTLERİ
        ====================================== */

        const newPortfolioButton =
            document.getElementById(
                "newPortfolioButton"
            );

        const portfolioFormCard =
            document.getElementById(
                "portfolioFormCard"
            );

        const portfolioForm =
            document.getElementById(
                "portfolioForm"
            );

        const portfolioFormTitle =
            document.getElementById(
                "portfolioFormTitle"
            );

        const portfolioId =
            document.getElementById(
                "portfolioId"
            );

        const portfolioTitle =
            document.getElementById(
                "portfolioTitle"
            );

        const portfolioDescription =
            document.getElementById(
                "portfolioDescription"
            );

        const portfolioImage =
            document.getElementById(
                "portfolioImage"
            );

        const imagePreviewContainer =
            document.getElementById(
                "imagePreviewContainer"
            );

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );

        const removeImageButton =
            document.getElementById(
                "removeImageButton"
            );

        const existingImageUrl =
            document.getElementById(
                "existingImageUrl"
            );

        const portfolioOrder =
            document.getElementById(
                "portfolioOrder"
            );

        const portfolioActive =
            document.getElementById(
                "portfolioActive"
            );

        const cancelPortfolioButton =
            document.getElementById(
                "cancelPortfolioButton"
            );

        const savePortfolioButton =
            document.getElementById(
                "savePortfolioButton"
            );

        const adminPortfolioList =
            document.getElementById(
                "adminPortfolioList"
            );


        /* =====================================
           SITE SETTINGS ELEMENTLERİ
        ====================================== */

        const siteSettingsForm =
            document.getElementById(
                "siteSettingsForm"
            );

        const siteTitle =
            document.getElementById(
                "siteTitle"
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


        /* =====================================
           CONTACT ELEMENTLERİ
        ====================================== */

        const contactSettingsForm =
            document.getElementById(
                "contactSettingsForm"
            );

        const contactEmail =
            document.getElementById(
                "contactEmail"
            );

        const contactWhatsapp =
            document.getElementById(
                "contactWhatsapp"
            );

        const contactInstagram =
            document.getElementById(
                "contactInstagram"
            );


        /* =====================================
           MESAJ GÖSTER
        ====================================== */

        function showMessage(
            message,
            type = "success"
        ) {

            if (!adminMessage) {
                return;
            }

            adminMessage.textContent =
                message;

            adminMessage.className =
                `admin-message show ${type}`;

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            setTimeout(
                () => {

                    adminMessage.className =
                        "admin-message";

                },
                5000
            );

        }


        /* =====================================
           OTURUM KONTROLÜ
        ====================================== */

        async function checkSession() {

            const {
                data,
                error
            } = await supabaseClient
                .auth
                .getUser();

            if (
                error ||
                !data.user
            ) {

                window.location.href =
                    "login.html";

                return false;

            }

            if (adminUserEmail) {

                adminUserEmail.textContent =
                    data.user.email;

            }

            return true;

        }


        const isLoggedIn =
            await checkSession();

        if (!isLoggedIn) {
            return;
        }


        /* =====================================
           MENÜ GEÇİŞLERİ
        ====================================== */

        const sectionTitles = {

            dashboard: {
                title: "Genel Bakış",
                eyebrow: "YÖNETİM PANELİ"
            },

            portfolio: {
                title: "Portföy",
                eyebrow: "PORTFÖY YÖNETİMİ"
            },

            settings: {
                title: "Site Ayarları",
                eyebrow: "İÇERİK YÖNETİMİ"
            },

            contact: {
                title: "İletişim",
                eyebrow: "İLETİŞİM YÖNETİMİ"
            }

        };


        function switchSection(
            sectionName
        ) {

            navButtons.forEach(
                (button) => {

                    button.classList.toggle(
                        "active",
                        button.dataset.section ===
                        sectionName
                    );

                }
            );


            sections.forEach(
                (section) => {

                    const isTarget =
                        section.id ===
                        `${sectionName}Section`;

                    section.classList.toggle(
                        "active",
                        isTarget
                    );

                }
            );


            const sectionInfo =
                sectionTitles[
                    sectionName
                ];

            if (
                sectionInfo &&
                pageTitle &&
                pageEyebrow
            ) {

                pageTitle.textContent =
                    sectionInfo.title;

                pageEyebrow.textContent =
                    sectionInfo.eyebrow;

            }

        }


        navButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        switchSection(
                            button.dataset.section
                        );

                    }
                );

            }
        );


        /* =====================================
           ÇIKIŞ
        ====================================== */

        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    const {
                        error
                    } = await supabaseClient
                        .auth
                        .signOut();

                    if (error) {

                        showMessage(
                            "Çıkış yapılırken hata oluştu.",
                            "error"
                        );

                        return;

                    }

                    window.location.href =
                        "login.html";

                }
            );

        }


        /* =====================================
           PORTFÖY FORMUNU AÇ
        ====================================== */

        function openPortfolioForm(
            item = null
        ) {

            if (
                !portfolioFormCard ||
                !portfolioForm
            ) {
                return;
            }


            portfolioForm.reset();


            portfolioId.value =
                item
                    ? item.id
                    : "";


            portfolioFormTitle.textContent =
                item
                    ? "Çalışmayı Düzenle"
                    : "Yeni Çalışma";


            if (item) {

                portfolioTitle.value =
                    item.title || "";

                portfolioDescription.value =
                    item.description || "";

                portfolioOrder.value =
                    item.sort_order ?? 0;

                portfolioActive.checked =
                    item.is_active !== false;

                existingImageUrl.value =
                    item.image_url || "";


                if (item.image_url) {

                    imagePreview.src =
                        item.image_url;

                    imagePreviewContainer.hidden =
                        false;

                } else {

                    imagePreview.src =
                        "";

                    imagePreviewContainer.hidden =
                        true;

                }

            } else {

                portfolioOrder.value = 0;

                portfolioActive.checked = true;

                existingImageUrl.value = "";

                imagePreview.src = "";

                imagePreviewContainer.hidden =
                    true;

            }


            portfolioFormCard.hidden = false;


            setTimeout(
                () => {

                    portfolioFormCard.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "start"
                        }
                    );

                },
                100
            );

        }


        function closePortfolioForm() {

            if (!portfolioFormCard) {
                return;
            }

            portfolioFormCard.hidden = true;

            portfolioForm.reset();

            portfolioId.value = "";

            existingImageUrl.value = "";

            imagePreview.src = "";

            imagePreviewContainer.hidden = true;

        }


        if (newPortfolioButton) {

            newPortfolioButton.addEventListener(
                "click",
                () => {

                    openPortfolioForm();

                }
            );

        }


        if (cancelPortfolioButton) {

            cancelPortfolioButton.addEventListener(
                "click",
                closePortfolioForm
            );

        }


        /* =====================================
           GÖRSEL ÖNİZLEME
        ====================================== */

        if (portfolioImage) {

            portfolioImage.addEventListener(
                "change",
                () => {

                    const file =
                        portfolioImage.files[0];

                    if (!file) {
                        return;
                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        showMessage(
                            "Lütfen geçerli bir görsel seçin.",
                            "error"
                        );

                        portfolioImage.value =
                            "";

                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        (event) => {

                            imagePreview.src =
                                event.target.result;

                            imagePreviewContainer.hidden =
                                false;

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }


        /* =====================================
           GÖRSELİ KALDIR
        ====================================== */

        if (removeImageButton) {

            removeImageButton.addEventListener(
                "click",
                () => {

                    portfolioImage.value = "";

                    existingImageUrl.value = "";

                    imagePreview.src = "";

                    imagePreviewContainer.hidden =
                        true;

                }
            );

        }


        /* =====================================
           STORAGE'A GÖRSEL YÜKLE
        ====================================== */

        async function uploadPortfolioImage(
            file
        ) {

            if (!file) {
                return null;
            }


            const fileExtension =
                file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


            const fileName =
                `portfolio/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;


            const {
                error: uploadError
            } = await supabaseClient
                .storage
                .from("portfolio-images")
                .upload(
                    fileName,
                    file,
                    {
                        cacheControl: "3600",
                        upsert: false
                    }
                );


            if (uploadError) {
                throw uploadError;
            }


            const {
                data
            } = supabaseClient
                .storage
                .from("portfolio-images")
                .getPublicUrl(
                    fileName
                );


            return data.publicUrl;

        }


        /* =====================================
           STORAGE'DAN GÖRSEL SİL
        ====================================== */

        async function deletePortfolioImage(
            imageUrl
        ) {

            if (!imageUrl) {
                return;
            }


            try {

                const marker =
                    "/storage/v1/object/public/portfolio-images/";


                const index =
                    imageUrl.indexOf(
                        marker
                    );


                if (index === -1) {
                    return;
                }


                const filePath =
                    imageUrl.substring(
                        index + marker.length
                    );


                await supabaseClient
                    .storage
                    .from("portfolio-images")
                    .remove([
                        filePath
                    ]);

            } catch (error) {

                console.warn(
                    "Eski görsel silinemedi:",
                    error
                );

            }

        }


        /* =====================================
           PORTFÖY LİSTESİNİ YÜKLE
        ====================================== */

        async function loadPortfolio() {

            if (!adminPortfolioList) {
                return;
            }


            adminPortfolioList.innerHTML =
                `
                    <div class="admin-loading">
                        Portföy çalışmaları yükleniyor...
                    </div>
                `;


            try {

                const {
                    data,
                    error
                } = await supabaseClient
                    .from("portfolio")
                    .select("*")
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


                updatePortfolioStats(
                    data || []
                );


                if (
                    !data ||
                    data.length === 0
                ) {

                    adminPortfolioList.innerHTML =
                        `
                            <div class="admin-empty">
                                Henüz portföy çalışması bulunmuyor.
                            </div>
                        `;

                    return;

                }


                adminPortfolioList.innerHTML =
                    data
                        .map(
                            createPortfolioCard
                        )
                        .join("");


                attachPortfolioCardEvents();

            } catch (error) {

                console.error(
                    "Portföy yükleme hatası:",
                    error
                );


                adminPortfolioList.innerHTML =
                    `
                        <div class="admin-empty">
                            Portföy yüklenirken hata oluştu.
                        </div>
                    `;


                showMessage(
                    error.message ||
                    "Portföy yüklenemedi.",
                    "error"
                );

            }

        }


        /* =====================================
           PORTFÖY KARTI
        ====================================== */

        function createPortfolioCard(
            item
        ) {

            const image =
                item.image_url
                    ? `
                        <img
                            src="${escapeHtmlAttribute(item.image_url)}"
                            alt="${escapeHtml(item.title)}"
                        >
                    `
                    : `
                        <div class="admin-portfolio-placeholder">
                            Görsel Yok
                        </div>
                    `;


            const status =
                item.is_active !== false
                    ? `
                        <span class="portfolio-status active">
                            Aktif
                        </span>
                    `
                    : `
                        <span class="portfolio-status inactive">
                            Gizli
                        </span>
                    `;


            return `
                <article
                    class="admin-portfolio-item"
                    data-id="${item.id}"
                >

                    <div class="admin-portfolio-image">
                        ${image}
                    </div>

                    <div class="admin-portfolio-content">

                        <h3>
                            ${escapeHtml(item.title || "")}
                        </h3>

                        <p>
                            ${escapeHtml(item.description || "Açıklama yok.")}
                        </p>

                        <div class="admin-portfolio-meta">

                            ${status}

                            <span>
                                Sıra: ${item.sort_order ?? 0}
                            </span>

                        </div>

                        <div class="admin-portfolio-actions">

                            <button
                                type="button"
                                class="admin-edit-button"
                                data-edit-id="${item.id}"
                            >
                                Düzenle
                            </button>

                            <button
                                type="button"
                                class="admin-delete-button"
                                data-delete-id="${item.id}"
                                data-image-url="${escapeHtmlAttribute(item.image_url || "")}"
                            >
                                Sil
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }


        /* =====================================
           PORTFÖY KART BUTONLARI
        ====================================== */

        function attachPortfolioCardEvents() {

            const editButtons =
                document.querySelectorAll(
                    ".admin-edit-button"
                );


            editButtons.forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const id =
                                button.dataset.editId;


                            try {

                                const {
                                    data,
                                    error
                                } = await supabaseClient
                                    .from("portfolio")
                                    .select("*")
                                    .eq(
                                        "id",
                                        id
                                    )
                                    .single();


                                if (error) {
                                    throw error;
                                }


                                openPortfolioForm(
                                    data
                                );

                            } catch (error) {

                                showMessage(
                                    "Çalışma bilgileri alınamadı.",
                                    "error"
                                );

                            }

                        }
                    );

                }
            );


            const deleteButtons =
                document.querySelectorAll(
                    ".admin-delete-button"
                );


            deleteButtons.forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const confirmed =
                                confirm(
                                    "Bu portföy çalışmasını silmek istediğinizden emin misiniz?"
                                );


                            if (!confirmed) {
                                return;
                            }


                            const id =
                                button.dataset.deleteId;

                            const imageUrl =
                                button.dataset.imageUrl;


                            button.disabled = true;

                            button.textContent =
                                "Siliniyor...";


                            try {

                                const {
                                    error
                                } = await supabaseClient
                                    .from("portfolio")
                                    .delete()
                                    .eq(
                                        "id",
                                        id
                                    );


                                if (error) {
                                    throw error;
                                }


                                await deletePortfolioImage(
                                    imageUrl
                                );


                                showMessage(
                                    "Portföy çalışması silindi."
                                );


                                await loadPortfolio();

                            } catch (error) {

                                console.error(
                                    error
                                );


                                showMessage(
                                    error.message ||
                                    "Silme işlemi başarısız oldu.",
                                    "error"
                                );


                                button.disabled =
                                    false;

                                button.textContent =
                                    "Sil";

                            }

                        }
                    );

                }
            );

        }


        /* =====================================
           PORTFÖY KAYDET
        ====================================== */

        if (portfolioForm) {

            portfolioForm.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const title =
                        portfolioTitle.value.trim();


                    if (!title) {

                        showMessage(
                            "Çalışma başlığı zorunludur.",
                            "error"
                        );

                        portfolioTitle.focus();

                        return;

                    }


                    const id =
                        portfolioId.value;


                    const selectedFile =
                        portfolioImage.files[0];


                    const oldImageUrl =
                        existingImageUrl.value;


                    let imageUrl =
                        oldImageUrl || null;


                    savePortfolioButton.disabled =
                        true;

                    savePortfolioButton.textContent =
                        "Kaydediliyor...";


                    try {

                        if (selectedFile) {

                            imageUrl =
                                await uploadPortfolioImage(
                                    selectedFile
                                );

                        }


                        const portfolioData = {

                            title:
                                title,

                            description:
                                portfolioDescription.value.trim(),

                            image_url:
                                imageUrl,

                            sort_order:
                                Number(
                                    portfolioOrder.value
                                ) || 0,

                            is_active:
                                portfolioActive.checked

                        };


                        if (id) {

                            const {
                                error
                            } = await supabaseClient
                                .from("portfolio")
                                .update(
                                    portfolioData
                                )
                                .eq(
                                    "id",
                                    id
                                );


                            if (error) {
                                throw error;
                            }


                            if (
                                selectedFile &&
                                oldImageUrl &&
                                oldImageUrl !== imageUrl
                            ) {

                                await deletePortfolioImage(
                                    oldImageUrl
                                );

                            }


                            showMessage(
                                "Portföy çalışması güncellendi."
                            );

                        } else {

                            const {
                                error
                            } = await supabaseClient
                                .from("portfolio")
                                .insert([
                                    portfolioData
                                ]);


                            if (error) {
                                throw error;
                            }


                            showMessage(
                                "Yeni portföy çalışması eklendi."
                            );

                        }


                        closePortfolioForm();

                        await loadPortfolio();

                    } catch (error) {

                        console.error(
                            "Portföy kayıt hatası:",
                            error
                        );


                        /*
                           YENİ GÖRSEL YÜKLENDİ
                           AMA VERİTABANI KAYDI
                           BAŞARISIZ OLDUYSA
                           STORAGE'DAN SİL
                        */

                        if (
                            selectedFile &&
                            imageUrl &&
                            imageUrl !== oldImageUrl
                        ) {

                            await deletePortfolioImage(
                                imageUrl
                            );

                        }


                        showMessage(
                            error.message ||
                            "Portföy kaydedilemedi.",
                            "error"
                        );

                    } finally {

                        savePortfolioButton.disabled =
                            false;

                        savePortfolioButton.textContent =
                            "Kaydet";

                    }

                }
            );

        }


        /* =====================================
           PORTFÖY İSTATİSTİKLERİ
        ====================================== */

        function updatePortfolioStats(
            portfolioItems
        ) {

            const total =
                portfolioItems.length;


            const active =
                portfolioItems.filter(
                    (item) =>
                        item.is_active !== false
                ).length;


            const inactive =
                total - active;


            const totalElement =
                document.getElementById(
                    "totalPortfolioCount"
                );

            const activeElement =
                document.getElementById(
                    "activePortfolioCount"
                );

            const inactiveElement =
                document.getElementById(
                    "inactivePortfolioCount"
                );


            if (totalElement) {

                totalElement.textContent =
                    total;

            }


            if (activeElement) {

                activeElement.textContent =
                    active;

            }


            if (inactiveElement) {

                inactiveElement.textContent =
                    inactive;

            }

        }


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


                siteTitle.value =
                    data.site_title || "";

                heroSmallText.value =
                    data.hero_small_text || "";

                heroTitle.value =
                    data.hero_title || "";

                heroDescription.value =
                    data.hero_description || "";

                aboutText.value =
                    data.about_text || "";

            } catch (error) {

                console.error(
                    "Site ayarları yüklenemedi:",
                    error
                );

            }

        }


        /* =====================================
           SITE AYARLARINI KAYDET
        ====================================== */

        if (siteSettingsForm) {

            siteSettingsForm.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const button =
                        document.getElementById(
                            "saveSiteSettingsButton"
                        );


                    button.disabled = true;

                    button.textContent =
                        "Kaydediliyor...";


                    const settingsData = {

                        site_title:
                            siteTitle.value.trim(),

                        hero_small_text:
                            heroSmallText.value.trim(),

                        hero_title:
                            heroTitle.value.trim(),

                        hero_description:
                            heroDescription.value.trim(),

                        about_text:
                            aboutText.value.trim()

                    };


                    try {

                        const {
                            data: existing,
                            error: checkError
                        } = await supabaseClient
                            .from("site_settings")
                            .select("id")
                            .limit(1)
                            .maybeSingle();


                        if (checkError) {
                            throw checkError;
                        }


                        let error;


                        if (existing) {

                            const result =
                                await supabaseClient
                                    .from(
                                        "site_settings"
                                    )
                                    .update(
                                        settingsData
                                    )
                                    .eq(
                                        "id",
                                        existing.id
                                    );


                            error =
                                result.error;

                        } else {

                            const result =
                                await supabaseClient
                                    .from(
                                        "site_settings"
                                    )
                                    .insert([
                                        settingsData
                                    ]);


                            error =
                                result.error;

                        }


                        if (error) {
                            throw error;
                        }


                        showMessage(
                            "Site ayarları kaydedildi."
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showMessage(
                            error.message ||
                            "Site ayarları kaydedilemedi.",
                            "error"
                        );

                    } finally {

                        button.disabled = false;

                        button.textContent =
                            "Site Ayarlarını Kaydet";

                    }

                }
            );

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


                contactEmail.value =
                    data.email || "";

                contactWhatsapp.value =
                    data.whatsapp || "";

                contactInstagram.value =
                    data.instagram || "";

            } catch (error) {

                console.error(
                    "İletişim bilgileri yüklenemedi:",
                    error
                );

            }

        }


        /* =====================================
           İLETİŞİM BİLGİLERİNİ KAYDET
        ====================================== */

        if (contactSettingsForm) {

            contactSettingsForm.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    const button =
                        document.getElementById(
                            "saveContactSettingsButton"
                        );


                    button.disabled = true;

                    button.textContent =
                        "Kaydediliyor...";


                    const contactData = {

                        email:
                            contactEmail.value.trim(),

                        whatsapp:
                            contactWhatsapp.value.trim(),

                        instagram:
                            contactInstagram.value
                                .trim()
                                .replace(
                                    /^@/,
                                    ""
                                )

                    };


                    try {

                        const {
                            data: existing,
                            error: checkError
                        } = await supabaseClient
                            .from("contact_settings")
                            .select("id")
                            .limit(1)
                            .maybeSingle();


                        if (checkError) {
                            throw checkError;
                        }


                        let error;


                        if (existing) {

                            const result =
                                await supabaseClient
                                    .from(
                                        "contact_settings"
                                    )
                                    .update(
                                        contactData
                                    )
                                    .eq(
                                        "id",
                                        existing.id
                                    );


                            error =
                                result.error;

                        } else {

                            const result =
                                await supabaseClient
                                    .from(
                                        "contact_settings"
                                    )
                                    .insert([
                                        contactData
                                    ]);


                            error =
                                result.error;

                        }


                        if (error) {
                            throw error;
                        }


                        showMessage(
                            "İletişim bilgileri kaydedildi."
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showMessage(
                            error.message ||
                            "İletişim bilgileri kaydedilemedi.",
                            "error"
                        );

                    } finally {

                        button.disabled = false;

                        button.textContent =
                            "İletişim Bilgilerini Kaydet";

                    }

                }
            );

        }


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
           İLK VERİLERİ YÜKLE
        ====================================== */

        await Promise.all([

            loadPortfolio(),

            loadSiteSettings(),

            loadContactSettings()

        ]);

    }
);