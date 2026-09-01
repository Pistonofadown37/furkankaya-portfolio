/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI
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

    if (document.querySelector(".site-header")) {
        const script = document.createElement("script");

        // v8: mobil düzeltme + cache bust
        script.src = new URL(
            "./design-runtime.js?v=8",
            document.baseURI
        ).href;

        script.defer = true;
        document.head.appendChild(script);
    }
}
