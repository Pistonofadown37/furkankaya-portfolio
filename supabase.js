/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


/* =============================================
   SUPABASE KÜTÜPHANESİ KONTROLÜ
============================================= */

if (!window.supabase) {

    console.error(
        "Supabase kütüphanesi yüklenemedi."
    );

} else {

    /* =============================================
       SUPABASE CLIENT
    ============================================= */

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


    /* =============================================
       GLOBAL ERİŞİM
    ============================================= */

    window.SUPABASE_URL =
        SUPABASE_URL;

}
