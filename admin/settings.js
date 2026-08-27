/* =========================================
   SETTINGS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await checkAuthentication();

        initializeSettings();

    }
);


/* =========================================
   SUPABASE
========================================= */

function getSupabaseClient() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase bağlantısı bulunamadı."
        );

        return null;

    }


    return supabaseClient;

}


/* =========================================
   AUTH CHECK
========================================= */

async function checkAuthentication() {

    const client =
        getSupabaseClient();


    if (!client) {

        return;

    }


    const {
        data,
        error
    } =
        await client.auth.getSession();


    if (error) {

        console.error(
            "Oturum kontrol hatası:",
            error
        );

    }


    if (
        !data.session
    ) {

        window.location.href =
            "login.html";

    }

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeSettings() {

    initializeLogoUpload();

    initializeSettingsForm();

    initializeLogout();

    await loadSettings();

}


/* =========================================
   LOAD SETTINGS
========================================= */

async function loadSettings() {

    const client =
        getSupabaseClient();


    if (!client) {

        return;

    }


    const {
        data,
        error
    } =
        await client
            .from("site_settings")
            .select("*");


    if (error) {

        console.error(
            "Ayarlar yüklenirken hata:",
            error
        );

        showSettingsMessage(
            "Ayarlar yüklenemedi: " +
            error.message,
            "error"
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

            const key =
                item.key ||
                item.setting_key;


            const value =
                item.value ||
                item.setting_value;


            if (key) {

                settings[key] =
                    value;

            }

        }
    );


    fillSettingsForm(
        settings
    );

}


/* =========================================
   FILL FORM
========================================= */

function fillSettingsForm(
    settings
) {

    setInputValue(
        "siteName",
        settings.site_name
    );


    setInputValue(
        "siteSubtitle",
        settings.site_subtitle
    );


    setInputValue(
        "heroTitle",
        settings.hero_title
    );


    setInputValue(
        "heroDescription",
        settings.hero_description
    );


    setInputValue(
        "aboutText",
        settings.about_text
    );


    setInputValue(
        "email",
        settings.email
    );


    setInputValue(
        "whatsapp",
        settings.whatsapp
    );


    setInputValue(
        "instagram",
        settings.instagram
    );


    if (
        settings.logo_url
    ) {

        setLogoPreview(
            settings.logo_url
        );

    }

}


/* =========================================
   INPUT VALUE
========================================= */

function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return;

    }


    element.value =
        value || "";

}


/* =========================================
   LOGO UPLOAD
========================================= */

function initializeLogoUpload() {

    const logoFile =
        document.getElementById(
            "logoFile"
        );


    const removeLogoButton =
        document.getElementById(
            "removeLogoButton"
        );


    if (
        logoFile
    ) {

        logoFile.addEventListener(
            "change",
            function () {

                const file =
                    logoFile.files[0];


                if (!file) {

                    return;

                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showSettingsMessage(
                        "Lütfen geçerli bir görsel seçin.",
                        "error"
                    );

                    return;

                }


                const imageUrl =
                    URL.createObjectURL(
                        file
                    );


                setLogoPreview(
                    imageUrl
                );


                const selectedLogoName =
                    document.getElementById(
                        "selectedLogoName"
                    );


                if (
                    selectedLogoName
                ) {

                    selectedLogoName.textContent =
                        file.name;

                }

            }
        );

    }


    if (
        removeLogoButton
    ) {

        removeLogoButton.addEventListener(
            "click",
            function () {

                removeLogoPreview();

            }
        );

    }

}


/* =========================================
   SET LOGO PREVIEW
========================================= */

function setLogoPreview(
    imageUrl
) {

    const previewImage =
        document.getElementById(
            "logoPreviewImage"
        );


    const placeholder =
        document.getElementById(
            "logoPlaceholder"
        );


    if (
        previewImage
    ) {

        previewImage.src =
            imageUrl;


        previewImage.style.display =
            "block";

    }


    if (
        placeholder
    ) {

        placeholder.style.display =
            "none";

    }

}


/* =========================================
   REMOVE LOGO
========================================= */

function removeLogoPreview() {

    const previewImage =
        document.getElementById(
            "logoPreviewImage"
        );


    const placeholder =
        document.getElementById(
            "logoPlaceholder"
        );


    const logoFile =
        document.getElementById(
            "logoFile"
        );


    const selectedLogoName =
        document.getElementById(
            "selectedLogoName"
        );


    if (
        previewImage
    ) {

        previewImage.src =
            "";

        previewImage.style.display =
            "none";

    }


    if (
        placeholder
    ) {

        placeholder.style.display =
            "block";

    }


    if (
        logoFile
    ) {

        logoFile.value =
            "";

    }


    if (
        selectedLogoName
    ) {

        selectedLogoName.textContent =
            "Logo kaldırılacak.";

    }

}


/* =========================================
   SETTINGS FORM
========================================= */

function initializeSettingsForm() {

    const settingsForm =
        document.getElementById(
            "settingsForm"
        );


    if (
        !settingsForm
    ) {

        return;

    }


    settingsForm.addEventListener(
        "submit",
        async function (
            event
        ) {

            event.preventDefault();

            await saveSettings();

        }
    );

}


/* =========================================
   SAVE SETTINGS
========================================= */

async function saveSettings() {

    const client =
        getSupabaseClient();


    if (!client) {

        return;

    }


    const saveButton =
        document.getElementById(
            "saveSettingsButton"
        );


    if (
        saveButton
    ) {

        saveButton.disabled =
            true;


        saveButton.textContent =
            "Kaydediliyor...";

    }


    showSettingsMessage(
        "",
        ""
    );


    try {

        let logoUrl =
            await getCurrentLogoUrl();


        const logoFile =
            document.getElementById(
                "logoFile"
            );


        if (
            logoFile &&
            logoFile.files &&
            logoFile.files.length > 0
        ) {

            logoUrl =
                await uploadLogo(
                    logoFile.files[0]
                );

        }


        const previewImage =
            document.getElementById(
                "logoPreviewImage"
            );


        const removeRequested =
            previewImage &&
            !previewImage.src;


        if (
            removeRequested
        ) {

            logoUrl =
                "";

        }


        const settings = {

            site_name:
                getInputValue(
                    "siteName"
                ),

            site_subtitle:
                getInputValue(
                    "siteSubtitle"
                ),

            hero_title:
                getInputValue(
                    "heroTitle"
                ),

            hero_description:
                getInputValue(
                    "heroDescription"
                ),

            about_text:
                getInputValue(
                    "aboutText"
                ),

            email:
                getInputValue(
                    "email"
                ),

            whatsapp:
                getInputValue(
                    "whatsapp"
                ),

            instagram:
                getInputValue(
                    "instagram"
                ),

            logo_url:
                logoUrl

        };


        for (
            const [
                key,
                value
            ]
            of Object.entries(
                settings
            )
        ) {

            await saveSetting(
                key,
                value
            );

        }


        showSettingsMessage(
            "Ayarlar başarıyla kaydedildi.",
            "success"
        );


        window.dispatchEvent(
            new Event(
                "settingsUpdated"
            )
        );


    } catch (
        error
    ) {

        console.error(
            "Ayarlar kaydedilirken hata:",
            error
        );


        showSettingsMessage(
            "Hata: " +
            error.message,
            "error"
        );

    } finally {

        if (
            saveButton
        ) {

            saveButton.disabled =
                false;


            saveButton.textContent =
                "Ayarları Kaydet";

        }

    }

}


/* =========================================
   GET CURRENT LOGO
========================================= */

async function getCurrentLogoUrl() {

    const client =
        getSupabaseClient();


    if (!client) {

        return "";

    }


    const {
        data,
        error
    } =
        await client
            .from("site_settings")
            .select("*")
            .or(
                "key.eq.logo_url,setting_key.eq.logo_url"
            );


    if (error) {

        return "";

    }


    if (
        !data ||
        !data.length
    ) {

        return "";

    }


    const item =
        data[0];


    return (
        item.value ||
        item.setting_value ||
        ""
    );

}


/* =========================================
   UPLOAD LOGO
========================================= */

async function uploadLogo(
    file
) {

    const client =
        getSupabaseClient();


    if (!client) {

        throw new Error(
            "Supabase bağlantısı bulunamadı."
        );

    }


    const fileExtension =
        file.name
            .split(".")
            .pop();


    const fileName =
        "site-logo-" +
        Date.now() +
        "." +
        fileExtension;


    const {
        error
    } =
        await client
            .storage
            .from("furkankaya-portfolio")
            .upload(
                fileName,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        true
                }
            );


    if (error) {

        throw error;

    }


    const {
        data
    } =
        client
            .storage
            .from("furkankaya-portfolio")
            .getPublicUrl(
                fileName
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Logo URL'si oluşturulamadı."
        );

    }


    return data.publicUrl;

}


/* =========================================
   SAVE SINGLE SETTING
========================================= */

async function saveSetting(
    key,
    value
) {

    const client =
        getSupabaseClient();


    if (!client) {

        throw new Error(
            "Supabase bağlantısı bulunamadı."
        );

    }


    /*
    Önce mevcut kaydı kontrol ediyoruz.
    Böylece site_settings tablosunun
    farklı kolon yapılarıyla uyum sağlıyoruz.
    */

    const {
        data:
            existingData,
        error:
            selectError
    } =
        await client
            .from("site_settings")
            .select("*");


    if (
        selectError
    ) {

        throw selectError;

    }


    let existingItem =
        null;


    if (
        existingData
    ) {

        existingItem =
            existingData.find(
                function (
                    item
                ) {

                    return (
                        item.key === key ||
                        item.setting_key === key
                    );

                }
            );

    }


    if (
        existingItem
    ) {

        const updateData = {};


        if (
            existingItem.key !==
            undefined
        ) {

            updateData.value =
                value;

        } else {

            updateData.setting_value =
                value;

        }


        let query =
            client
                .from("site_settings")
                .update(
                    updateData
                );


        if (
            existingItem.id
        ) {

            query =
                query.eq(
                    "id",
                    existingItem.id
                );

        } else if (
            existingItem.key !==
            undefined
        ) {

            query =
                query.eq(
                    "key",
                    key
                );

        } else {

            query =
                query.eq(
                    "setting_key",
                    key
                );

        }


        const {
            error
        } =
            await query;


        if (
            error
        ) {

            throw error;

        }


    } else {

        let insertData = {};


        /*
        Tablo önceki SQL yapısında
        setting_key kullanıyorsa bunu
        kullanır. Yeni yapıda key varsa
        Supabase hatası alınabilir.
        */

        insertData =
            {
                setting_key:
                    key,

                setting_value:
                    value
            };


        let {
            error
        } =
            await client
                .from("site_settings")
                .insert(
                    insertData
                );


        if (
            error &&
            error.message &&
            error.message.includes(
                "setting_key"
            )
        ) {

            insertData =
                {
                    key:
                        key,

                    value:
                        value
                };


            const result =
                await client
                    .from("site_settings")
                    .insert(
                        insertData
                    );


            error =
                result.error;

        }


        if (
            error
        ) {

            throw error;

        }

    }

}


/* =========================================
   GET INPUT VALUE
========================================= */

function getInputValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return "";

    }


    return element.value.trim();

}


/* =========================================
   MESSAGE
========================================= */

function showSettingsMessage(
    message,
    type
) {

    const settingsMessage =
        document.getElementById(
            "settingsMessage"
        );


    if (
        !settingsMessage
    ) {

        return;

    }


    settingsMessage.textContent =
        message;


    settingsMessage.className =
        "settings-message";


    if (
        type
    ) {

        settingsMessage.classList.add(
            type
        );

    }

}


/* =========================================
   LOGOUT
========================================= */

function initializeLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (
        !logoutButton
    ) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async function () {

            const client =
                getSupabaseClient();


            if (
                client
            ) {

                await client.auth.signOut();

            }


            window.location.href =
                "login.html";

        }
    );

}
