/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI + İÇERİK RUNTIME
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8X5KQfD0VIMkc-j-Lw_k-_XG8Ie";

if (!window.supabase) {
    console.error("Supabase kütüphanesi yüklenemedi.");
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
       İçerik runtime sadece ana sitede çalışır.
       Admin sayfalarında ise içerik sekmesini ekler.
    */
    const isMainSite =
        document.querySelector(".site-header") !== null;

    const isAdminPage =
        document.body &&
        document.body.classList.contains("admin-page");

    function loadScript(src, marker) {
        if (document.querySelector('script[data-fk-loader="' + marker + '"]')) {
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.defer = true;
        script.dataset.fkLoader = marker;
        document.head.appendChild(script);
    }

    if (isMainSite) {
        loadScript(
            new URL("./content-runtime.js?v=1", document.baseURI).href,
            "content-runtime"
        );
    }

    if (isAdminPage) {
        loadScript(
            new URL("./admin/content-tab.js?v=1", document.baseURI).href,
            "content-tab"
        );
    }
}
