/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI + İÇERİK RUNTIME
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bGFubWJtaW50aW5nbXJ1enR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzgxMDIsImV4cCI6MjEwMzM1NDEwMn0.y8aGhcHc6JfRihm2rokyKvIlwwPCKqEVB0JKSSiQx4E";

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
