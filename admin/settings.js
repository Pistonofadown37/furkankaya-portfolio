/* =========================================
   FURKAN KAYA ADMIN
   SITE SETTINGS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeSettingsPage();

    }
);


/* =========================================
   BAŞLAT
========================================= */

async function initializeSettingsPage() {

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


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        showSettingsStatus(
            "Supabase bağlantısı bulunamadı.",
            "error"
        );

        return;

    }


    await loadSettings();


    initializeLogoUpload();


    settingsForm.addEventListener(
        "submit",
        saveSettings
    );

}


/* =========================================
   AYARLARI YÜKLE
========================================= */

async function loadSettings() {

    showSettingsStatus(
        "Ayarlar yükleniyor...",
        "loading"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "site_settings"
                )
                .select(
                    "setting_key, setting_value"
                );


        if (error) {

            throw error;

        }


        const settings =
            convertSettingsToObject(
                data || []
            );


        setInputValue(
            "siteName",
            settings.site_name
        );


        setInputValue(
            "logoUrl",
            settings.logo_url
        );


        setInputValue(
            "heroSmallText",
            settings.hero_small_text
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
            "contactEmail",
            settings.contact_email
        );


        setInputValue(
            "contactWhatsapp",
            settings.contact_whatsapp
        );


        setInputValue(
            "contactInstagram",
            settings.contact_instagram
        );


        updateLogoPreview(
            settings.logo_url
        );


        clearSettingsStatus();


    } catch (error) {

        console.error(
            "Ayarlar yüklenirken hata:",
            error
        );


        showSettingsStatus(
            "Ayarlar yüklenemedi: " +
            getErrorMessage(
                error
            ),
            "error"
        );

    }

}


/* =========================================
   AYAR DİZİSİNİ OBJECT YAP
========================================= */

function convertSettingsToObject(
    settingsArray
) {

    const settings = {};


    settingsArray.forEach(
        function (item) {

            settings[
                item.setting_key
            ] =
                item.setting_value;

        }
    );


    return settings;

}


/* =========================================
   INPUT DEĞERİ YAZ
========================================= */

function setInputValue(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

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


    if (!logoFile) {

        return;

    }


    logoFile.addEventListener(
        "change",
        async function () {

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

                showSettingsStatus(
                    "Lütfen geçerli bir görsel dosyası seçin.",
                    "error"
                );

                logoFile.value = "";

                return;

            }


            if (
                file.size >
                10 * 1024 * 1024
            ) {

                showSettingsStatus(
                    "Logo dosyası en fazla 10 MB olabilir.",
                    "error"
                );

                logoFile.value = "";

                return;

            }


            const localPreview =
                URL.createObjectURL(
                    file
                );


            updateLogoPreview(
                localPreview
            );


            showSettingsStatus(
                "Logo Supabase Storage'a yükleniyor...",
                "loading"
            );


            try {

                const logoUrl =
                    await uploadLogo(
                        file
                    );


                setInputValue(
                    "logoUrl",
                    logoUrl
                );


                updateLogoPreview(
                    logoUrl
                );


                showSettingsStatus(
                    "Logo başarıyla yüklendi. Ayarları kaydetmeyi unutmayın.",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Logo yükleme hatası:",
                    error
                );


                showSettingsStatus(
                    "Logo yüklenemedi: " +
                    getErrorMessage(
                        error
                    ),
                    "error"
                );

            } finally {

                URL.revokeObjectURL(
                    localPreview
                );

            }

        }
    );

}


/* =========================================
   LOGOYU STORAGE'A YÜKLE
========================================= */

async function uploadLogo(
    file
) {

    const bucketName =
        "site-assets";


    const fileExtension =
        getFileExtension(
            file.name
        );


    const fileName =
        "logo-" +
        Date.now() +
        "-" +
        generateRandomString(
            8
        ) +
        "." +
        fileExtension;


    const filePath =
        "logos/" +
        fileName;


    const {
        error
    } =
        await supabaseClient
            .storage
            .from(
                bucketName
            )
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type
                }
            );


    if (error) {

        throw error;

    }


    const {
        data
    } =
        supabaseClient
            .storage
            .from(
                bucketName
            )
            .getPublicUrl(
                filePath
            );


    if (
        !data ||
        !data.publicUrl
    ) {

        throw new Error(
            "Logo için public URL oluşturulamadı."
        );

    }


    return data.publicUrl;

}


/* =========================================
   LOGO ÖNİZLEME
========================================= */

function updateLogoPreview(
    logoUrl
) {

    const logoPreview =
        document.getElementById(
            "logoPreview"
        );


    const logoPreviewWrapper =
        document.getElementById(
            "logoPreviewWrapper"
        );


    if (
        !logoPreview ||
        !logoPreviewWrapper
    ) {

        return;

    }


    if (!logoUrl) {

        logoPreview.removeAttribute(
            "src"
        );


        logoPreviewWrapper.classList.remove(
            "has-image"
        );

        return;

    }


    logoPreview.src =
        logoUrl;


    logoPreviewWrapper.classList.add(
        "has-image"
    );

}


/* =========================================
   AYARLARI KAYDET
========================================= */

async function saveSettings(
    event
) {

    event.preventDefault();


    const saveButton =
        document.getElementById(
            "saveSettingsButton"
        );


    const originalButtonText =
        saveButton ?
        saveButton.textContent :
        "Ayarları Kaydet";


    if (saveButton) {

        saveButton.disabled =
            true;


        saveButton.textContent =
            "Kaydediliyor...";

    }


    showSettingsStatus(
        "Ayarlar Supabase'e kaydediliyor...",
        "loading"
    );


    try {

        const settingsToSave = [

            {
                setting_key:
                    "site_name",

                setting_value:
                    getInputValue(
                        "siteName"
                    )
            },

            {
                setting_key:
                    "logo_url",

                setting_value:
                    getInputValue(
                        "logoUrl"
                    )
            },

            {
                setting_key:
                    "hero_small_text",

                setting_value:
                    getInputValue(
                        "heroSmallText"
                    )
            },

            {
                setting_key:
                    "hero_title",

                setting_value:
                    getInputValue(
                        "heroTitle"
                    )
            },

            {
                setting_key:
                    "hero_description",

                setting_value:
                    getInputValue(
                        "heroDescription"
                    )
            },

            {
                setting_key:
                    "contact_email",

                setting_value:
                    getInputValue(
                        "contactEmail"
                    )
            },

            {
                setting_key:
                    "contact_whatsapp",

                setting_value:
                    getInputValue(
                        "contactWhatsapp"
                    )
            },

            {
                setting_key:
                    "contact_instagram",

                setting_value:
                    getInputValue(
                        "contactInstagram"
                    )
            }

        ];


        const {
            error
        } =
            await supabaseClient
                .from(
                    "site_settings"
                )
                .upsert(
                    settingsToSave,
                    {
                        onConflict:
                            "setting_key"
                    }
                );


        if (error) {

            throw error;

        }


        showSettingsStatus(
            "✓ Tüm ayarlar başarıyla kaydedildi.",
            "success"
        );

    } catch (error) {

        console.error(
            "Ayarlar kaydedilirken hata:",
            error
        );


        showSettingsStatus(
            "Ayarlar kaydedilemedi: " +
            getErrorMessage(
                error
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
   INPUT DEĞERİ AL
========================================= */

function getInputValue(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return "";

    }


    return element.value.trim();

}


/* =========================================
   DOSYA UZANTISI
========================================= */

function getFileExtension(
    fileName
) {

    const parts =
        fileName.split(
            "."
        );


    if (
        parts.length <
        2
    ) {

        return "png";

    }


    return parts
        .pop()
        .toLowerCase();

}


/* =========================================
   RANDOM STRING
========================================= */

function generateRandomString(
    length
) {

    const characters =
        "abcdefghijklmnopqrstuvwxyz0123456789";


    let result =
        "";


    for (
        let i = 0;
        i < length;
        i++
    ) {

        result +=
            characters.charAt(
                Math.floor(
                    Math.random() *
                    characters.length
                )
            );

    }


    return result;

}


/* =========================================
   HATA MESAJI
========================================= */

function getErrorMessage(
    error
) {

    if (
        !error
    ) {

        return
            "Bilinmeyen hata.";

    }


    if (
        error.message
    ) {

        return error.message;

    }


    return String(
        error
    );

}


/* =========================================
   STATUS GÖSTER
========================================= */

function showSettingsStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "settingsStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    status.className =
        "admin-status " +
        type;


    status.style.display =
        "block";

}


/* =========================================
   STATUS TEMİZLE
========================================= */

function clearSettingsStatus() {

    const status =
        document.getElementById(
            "settingsStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        "";


    status.className =
        "admin-status";


    status.style.display =
        "none";

}
