/* =========================================
   SETTINGS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        const authenticated =
            await checkAuthentication();

        if (!authenticated) {

            return;

        }

        initializeLogoUpload();
        initializeSettingsForm();
        initializeLogout();

        await loadSettings();

    }
);


/* =========================================
   SETTINGS STATE
========================================= */

let currentLogoUrl = "";
let logoRemovalRequested = false;


/* =========================================
   SUPABASE
========================================= */

function getSupabaseClient() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
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

        return false;

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

        window.location.href =
            "login.html";

        return false;

    }

    if (
        !data ||
        !data.session
    ) {

        window.location.href =
            "login.html";

        return false;

    }

    return true;

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
            .select(
                "setting_key, setting_value"
            );

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

    const settings = {};

    if (data) {

        data.forEach(
            function (item) {

                if (item.setting_key) {

                    settings[
                        item.setting_key
                    ] =
                        item.setting_value ?? "";

                }

            }
        );

    }

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

    currentLogoUrl =
        settings.logo_url ?? "";

    if (currentLogoUrl) {

        setLogoPreview(
            currentLogoUrl
        );

    }

}


/* =========================================
   SET INPUT VALUE
========================================= */

function setInputValue(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {

        return;

    }

    element.value =
        value ?? "";

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

    if (logoFile) {

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

                    logoFile.value = "";

                    return;

                }

                logoRemovalRequested =
                    false;

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

                if (selectedLogoName) {

                    selectedLogoName.textContent =
                        file.name;

                }

            }
        );

    }

    if (removeLogoButton) {

        removeLogoButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                logoRemovalRequested =
                    true;

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

    if (previewImage) {

        previewImage.src =
            imageUrl;

        previewImage.style.display =
            "block";

    }

    if (placeholder) {

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

    if (previewImage) {

        previewImage.removeAttribute(
            "src"
        );

        previewImage.style.display =
            "none";

    }

    if (placeholder) {

        placeholder.style.display =
            "block";

    }

    if (logoFile) {

        logoFile.value = "";

    }

    if (selectedLogoName) {

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

    if (!settingsForm) {

        console.error(
            "settingsForm bulunamadı."
        );

        return;

    }

    settingsForm.addEventListener(
        "submit",
        async function (event) {

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

    const originalButtonText =
        saveButton
            ? saveButton.textContent
            : "Ayarları Kaydet";

    try {

        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Kaydediliyor...";

        }

        showSettingsMessage(
            "",
            ""
        );


        let logoUrl =
            currentLogoUrl;


        const logoFile =
            document.getElementById(
                "logoFile"
            );


        if (logoRemovalRequested) {

            logoUrl = "";

        }


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


        const settings = [

            {
                setting_key: "site_name",
                setting_value:
                    getInputValue("siteName")
            },

            {
                setting_key: "site_subtitle",
                setting_value:
                    getInputValue("siteSubtitle")
            },

            {
                setting_key: "hero_title",
                setting_value:
                    getInputValue("heroTitle")
            },

            {
                setting_key: "hero_description",
                setting_value:
                    getInputValue("heroDescription")
            },

            {
                setting_key: "about_text",
                setting_value:
                    getInputValue("aboutText")
            },

            {
                setting_key: "email",
                setting_value:
                    getInputValue("email")
            },

            {
                setting_key: "whatsapp",
                setting_value:
                    getInputValue("whatsapp")
            },

            {
                setting_key: "instagram",
                setting_value:
                    getInputValue("instagram")
            },

            {
                setting_key: "logo_url",
                setting_value:
                    logoUrl
            }

        ];


        const {
            data,
            error
        } =
            await client
                .from("site_settings")
                .upsert(
                    settings,
                    {
                        onConflict:
                            "setting_key"
                    }
                )
                .select(
                    "setting_key, setting_value"
                );


        if (error) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            throw new Error(
                "Ayarlar kaydedildi ancak Supabase kayıt sonucunu döndürmedi."
            );

        }


        currentLogoUrl =
            logoUrl;

        logoRemovalRequested =
            false;


        if (logoFile) {

            logoFile.value = "";

        }


        showSettingsMessage(
            "Ayarlar başarıyla kaydedildi.",
            "success"
        );


        console.log(
            "Kayıt başarılı:",
            data
        );


        window.dispatchEvent(
            new Event(
                "settingsUpdated"
            )
        );


    } catch (error) {

        console.error(
            "Ayarlar kaydedilirken hata:",
            error
        );


        showSettingsMessage(
            "Kaydetme hatası: " +
            (
                error.message ||
                error.code ||
                "Bilinmeyen hata"
            ),
            "error"
        );

    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                originalButtonText;

        }

    }

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

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "site-logo-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10) +
        "." +
        extension;


    const {
        error
    } =
        await client
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


    if (error) {

        throw error;

    }


    const {
        data
    } =
        client
            .storage
            .from("portfolio-images")
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
   GET INPUT VALUE
========================================= */

function getInputValue(
    id
) {

    const element =
        document.getElementById(id);

    if (!element) {

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

    if (!settingsMessage) {

        return;

    }

    settingsMessage.textContent =
        message;

    settingsMessage.className =
        "settings-message";

    if (type) {

        settingsMessage.classList.add(type);

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

    if (!logoutButton) {

        return;

    }

    logoutButton.addEventListener(
        "click",
        async function () {

            const client =
                getSupabaseClient();

            if (client) {

                const {
                    error
                } =
                    await client.auth.signOut();

                if (error) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );

                }

            }

            window.location.href =
                "login.html";

        }
    );

}
