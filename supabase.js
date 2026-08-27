// =============================================
// SUPABASE BAĞLANTISI
// FURKAN KAYA PORTFOLIO
// =============================================


// Supabase proje adresi
const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";


// Supabase Publishable / Anon Key
const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


// Supabase client oluştur
const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
