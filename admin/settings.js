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

        await initializeSettings();

    }
);


/* =========================================
   SUPABASE
========================================= */

function getSupabaseClient() {

    if (
        typeof supabaseClient ===
        "undefined" ||
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
   INITIALIZE
========================================= */

async function initializeSettings() {

    initializeLogoUpload();

    initializeSettingsForm();

    initializeLogout();

    await loadSettings();

}


/* =========================================
   SETTINGS STATE
========================================= */

let currentLogoUrl =
    "";

let logoRemovalRequested =
    false;


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
                "id, setting_key, setting_value"
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


    if (
        !data ||
        data.length === 0
    ) {

        return;

    }


    const settings = {};


    data.forEach(
        function (item) {

            if (
                item.setting_key
            ) {

                settings[
                    item.setting_key
                ] =
                    item.setting_value ?? "";

            }

        }
    );


    fillSettingsForm(
        settings
    );

}


/* =========================================
   FILL SETTINGS FORM
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
        settings.logo_url || "";


    if (
        currentLogoUrl
    ) {

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
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.value =
        value ?? "";

}


/* =========================================
   LOGO UPLOAD INITIALIZE
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


                    logoFile.value =
                        "";

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
   REMOVE LOGO PREVIEW
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

        logoFile.value =
            "";

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

        showSettingsMessage(
            "Supabase bağlantısı bulunamadı.",
            "error"
        );

        return;

    }


    const saveButton =
        document.getElementById(
            "saveSettingsButton"
        );


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


    try {

        let logoUrl =
            currentLogoUrl;


        const logoFile =
            document.getElementById(
                "logoFile"
            );


        if (
            logoRemovalRequested
        ) {

            logoUrl =
                "";

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
                settingKey,
                settingValue
            ]
            of Object.entries(
                settings
            )
        ) {

            await saveSetting(
                settingKey,
                settingValue
            );

        }


        currentLogoUrl =
            logoUrl;


        logoRemovalRequested =
            false;


        if (logoFile) {

            logoFile.value =
                "";

        }


        await loadSettings();


        showSettingsMessage(
            "Ayarlar başarıyla kaydedildi.",
            "success"
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
            "Hata: " +
            (
                error.message ||
                "Ayarlar kaydedilemedi."
            ),
            "error"
        );


    } finally {

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Ayarları Kaydet";

        }

    }

}


/* =========================================
   SAVE SINGLE SETTING
========================================= */

async function saveSetting(
    settingKey,
    settingValue
) {

    const client =
        getSupabaseClient();


    if (!client) {

        throw new Error(
            "Supabase bağlantısı bulunamadı."
        );

    }


    /*
       Önce sadece setting_key ile
       mevcut kayıt aranır.

       Burada kesinlikle "key"
       kolonu kullanılmaz.
    */

    const {
        data: existingData,
        error: selectError
    } =
        await client
            .from("site_settings")
            .select(
                "id, setting_key, setting_value"
            )
            .eq(
                "setting_key",
                settingKey
            )
            .maybeSingle();


    if (selectError) {

        throw selectError;

    }


    /*
       Kayıt varsa güncelle
    */

    if (existingData) {

        const {
            data: updatedData,
            error: updateError
        } =
            await client
                .from("site_settings")
                .update(
                    {
                        setting_value:
                            settingValue
                    }
                )
                .eq(
                    "id",
                    existingData.id
                )
                .select(
                    "id, setting_key, setting_value"
                );


        if (updateError) {

            throw updateError;

        }


        if (
            !updatedData ||
            updatedData.length === 0
        ) {

            throw new Error(
                settingKey +
                " ayarı güncellenemedi."
            );

        }


        return;

    }


    /*
       Kayıt yoksa yeni kayıt ekle
    */

    const {
        data: insertedData,
        error: insertError
    } =
        await client
            .from("site_settings")
            .insert(
                {
                    setting_key:
                        settingKey,

                    setting_value:
                        settingValue
                }
            )
            .select(
                "id, setting_key, setting_value"
            );


    if (insertError) {

        throw insertError;

    }


    if (
        !insertedData ||
        insertedData.length === 0
    ) {

        throw new Error(
            settingKey +
            " ayarı eklenemedi."
        );

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


    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        "site-logo-" +
        Date.now() +
        "." +
        fileExtension;


    const {
        error: uploadError
    } =
        await client
            .storage
            .from("portfolio-images")
            .upload(
                fileName,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false
                }
            );


    if (uploadError) {

        throw uploadError;

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
        document.getElementById(
            id
        );


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =========================================
   SHOW MESSAGE
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
                    await client
                        .auth
                        .signOut();


                if (error) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );

                    return;

                }

            }


            window.location.href =
                "login.html";

        }
    );

}
