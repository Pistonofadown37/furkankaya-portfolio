// =============================================
// SUPABASE BAĞLANTISI
// =============================================

// Supabase CDN yüklü mü kontrol et
if (typeof supabase === "undefined") {
    console.error(
        "Supabase kütüphanesi yüklenemedi."
    );
} else {

    const SUPABASE_URL =
        "https://fwlanmbmintingmruzty.supabase.co";

    const SUPABASE_ANON_KEY =
        "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


    // Global olarak oluştur
    window.supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );


    console.log(
        "Supabase bağlantısı hazır:",
        window.supabaseClient
    );

}
