// =============================================
// FURKAN KAYA PORTFOLIO
// SUPABASE BAĞLANTISI
// =============================================


// =============================================
// SUPABASE PROJE BİLGİLERİ
// =============================================

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";


const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


// =============================================
// SUPABASE CLIENT
// =============================================

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
