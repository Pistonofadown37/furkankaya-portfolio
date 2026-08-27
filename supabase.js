// =============================================
// SUPABASE BAĞLANTISI
// =============================================

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable__hwI8XK5QfD0VIMkc-j-Lw_k-_XG8Ie";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
