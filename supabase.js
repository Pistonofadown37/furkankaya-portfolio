/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


if (!window.supabase) {

    console.error(
        "Supabase kütüphanesi yüklenemedi."
    );

} else {

    window.supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false
                }
            }
        );


    window.SUPABASE_URL = SUPABASE_URL;


    /*
    ==================================================
    TASARIM RUNTIME
    ==================================================

    Sadece gerçek ana site çalışırken yüklenir.

    design.html üzerinde çalışmaz.

    Dosya ana dizinde bulunmalıdır:

        /design-runtime.js

    GitHub Pages altında da doğru URL otomatik
    olarak oluşturulur.
    */

    const isMainSite =
        document.querySelector(
            ".site-header"
        ) !== null;


    if (isMainSite) {

        const runtimeUrl =
            new URL(
                "./design-runtime.js?v=3",
                document.baseURI
            ).href;


        /*
        Aynı script'in birden fazla kez
        yüklenmesini engelle.
        */

        if (
            !document.querySelector(
                'script[data-fk-design-runtime="true"]'
            )
        ) {

            const runtimeScript =
                document.createElement("script");


            runtimeScript.src =
                runtimeUrl;


            runtimeScript.defer =
                true;


            runtimeScript.dataset.fkDesignRuntime =
                "true";


            runtimeScript.onload =
                function () {

                    console.log(
                        "FK Tasarım Runtime başarıyla yüklendi."
                    );

                };


            runtimeScript.onerror =
                function () {

                    console.error(
                        "FK Tasarım Runtime yüklenemedi:",
                        runtimeUrl
                    );

                };


            document.head.appendChild(
                runtimeScript
            );

        }

    }

}
