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

        showSettingsMessage(
            "Oturum kontrolü sırasında hata oluştu: " +
            error.message,
            "error"
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

            let key = null;
            let value = "";


            if (
                Object.prototype.hasOwnProperty.call(
                    item,
                    "setting_key"
                )
            ) {

                key =
                    item.setting_key;

            }
            else if (
                Object.prototype.hasOwnProperty.call(
                    item,
                    "key"
                )
            ) {

                key =
                    item.key;

            }


            if (
                Object.prototype.hasOwnProperty.call(
                    item,
                    "setting_value"
                )
            ) {

                value =
                    item.setting_value;

            }
            else if (
                Object.prototype.hasOwnProperty.call(
                    item,
                    "value"
                )
            ) {

                value =
                    item.value;

            }


            if (
                key !== null &&
                key !== undefined
            ) {

                settings[key] =
                    value ?? "";

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
        value ?? "";

}


/* =========================================
   LOGO STATE
========================================= */

let logoRemovalRequested =
    false;

let currentLogoUrl =
    "";


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
            function (
                event
            ) {

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

        previewImage.removeAttribute(
            "src"
        );

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

        console.error(
            "settingsForm bulunamadı."
        );

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

        const {
            data: existingSettings,
            error: existingSettingsError
        } =
            await client
                .from("site_settings")
                .select("*");


        if (
            existingSettingsError
        ) {

            throw existingSettingsError;

        }


        const tableStructure =
            detectSettingsTableStructure(
                existingSettings
            );


        let logoUrl =
            currentLogoUrl;


        if (
            logoRemovalRequested
        ) {

            logoUrl =
                "";

        }


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


        const results =
            await Promise.all(
                Object.entries(
                    settings
                ).map(
                    async function (
                        entry
                    ) {

                        const key =
                            entry[0];

                        const value =
                            entry[1];

                        await saveSetting(
                            key,
                            value,
                            existingSettings,
                            tableStructure
                        );

                    }
                )
            );


        if (
            results
        ) {

            await loadSettings();

        }


        currentLogoUrl =
            logoUrl;

        logoRemovalRequested =
            false;


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
            (
                error.message ||
                "Ayarlar kaydedilemedi."
            ),
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
   DETECT TABLE STRUCTURE
========================================= */

function detectSettingsTableStructure(
    existingSettings
) {

    if (
        existingSettings &&
        existingSettings.length > 0
    ) {

        const firstItem =
            existingSettings[0];


        if (
            Object.prototype.hasOwnProperty.call(
                firstItem,
                "setting_key"
            )
        ) {

            return {
                keyColumn:
                    "setting_key",

                valueColumn:
                    "setting_value"
            };

        }


        if (
            Object.prototype.hasOwnProperty.call(
                firstItem,
                "key"
            )
        ) {

            return {
                keyColumn:
                    "key",

                valueColumn:
                    "value"
            };

        }

    }


    return {
        keyColumn:
            "setting_key",

        valueColumn:
            "setting_value"
    };

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
            .select("*");


    if (
        error ||
        !data ||
        !data.length
    ) {

        return "";

    }


    const logoItem =
        data.find(
            function (
                item
            ) {

                return (
                    item.setting_key ===
                    "logo_url"
                ) ||
                (
                    item.key ===
                    "logo_url"
                );

            }
        );


    if (
        !logoItem
    ) {

        return "";

    }


    return (
        logoItem.setting_value ??
        logoItem.value ??
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
            .pop()
            .toLowerCase();


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
            .from("portfolio-images")
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


    if (
        error
    ) {

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
   SAVE SINGLE SETTING
========================================= */

async function saveSetting(
    key,
    value,
    existingSettings,
    tableStructure
) {

    const client =
        getSupabaseClient();


    if (!client) {

        throw new Error(
            "Supabase bağlantısı bulunamadı."
        );

    }


    const existingItem =
        existingSettings.find(
            function (
                item
            ) {

                return (
                    item.setting_key ===
                    key
                ) ||
                (
                    item.key ===
                    key
                );

            }
        );


    if (
        existingItem
    ) {

        const updateData =
            {
                [
                    tableStructure.valueColumn
                ]:
                    value
            };


        let query =
            client
                .from("site_settings")
                .update(
                    updateData
                );


        if (
            existingItem.id !==
            undefined &&
            existingItem.id !==
            null
        ) {

            query =
                query.eq(
                    "id",
                    existingItem.id
                );

        }
        else {

            query =
                query.eq(
                    tableStructure.keyColumn,
                    key
                );

        }


        const {
            data,
            error
        } =
            await query
                .select();


        if (
            error
        ) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            throw new Error(
                key +
                " ayarı güncellenemedi."
            );

        }


    }
    else {

        const insertData =
            {
                [
                    tableStructure.keyColumn
                ]:
                    key,

                [
                    tableStructure.valueColumn
                ]:
                    value
            };


        let {
            data,
            error
        } =
            await client
                .from("site_settings")
                .insert(
                    insertData
                )
                .select();


        /*
           Eğer tablo boşsa ve kolon yapısı
           yanlış tahmin edilmişse diğer
           olası kolon yapısını da dene.
        */

        if (
            error &&
            tableStructure.keyColumn ===
            "setting_key"
        ) {

            const alternativeInsertData =
                {
                    key:
                        key,

                    value:
                        value
                };


            const alternativeResult =
                await client
                    .from("site_settings")
                    .insert(
                        alternativeInsertData
                    )
                    .select();


            data =
                alternativeResult.data;

            error =
                alternativeResult.error;

        }
        else if (
            error &&
            tableStructure.keyColumn ===
            "key"
        ) {

            const alternativeInsertData =
                {
                    setting_key:
                        key,

                    setting_value:
                        value
                };


            const alternativeResult =
                await client
                    .from("site_settings")
                    .insert(
                        alternativeInsertData
                    )
                    .select();


            data =
                alternativeResult.data;

            error =
                alternativeResult.error;

        }


        if (
            error
        ) {

            throw error;

        }


        if (
            !data ||
            data.length === 0
        ) {

            throw new Error(
                key +
                " ayarı eklenemedi."
            );

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

                const {
                    error
                } =
                    await client
                        .auth
                        .signOut();


                if (
                    error
                ) {

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
