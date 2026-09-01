/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";

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

    /* Ana siteye tasarım çalışma zamanını yükle.
       Yönetim panelinde çalışmaz; yalnızca gerçek site DOM'u varsa yüklenir. */
    if (document.querySelector(".site-header")) {
        const script = document.createElement("script");
        script.src = "design-runtime.js?v=1";
        script.defer = true;
        document.head.appendChild(script);
    }
}
