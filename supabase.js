/* =============================================
   FURKAN KAYA PORTFOLIO
   SUPABASE BAĞLANTISI
============================================= */

const SUPABASE_URL =
    "https://fwlanmbmintingmruzty.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3bGFubWJtaW50aW5nbXJ1enR5IiwiaWF0IjoxNzg3Nzc4MTAyLCJleHAiOjIxMDMzNTQxMDJ9.y8aGhcHc6JfRihm2rokyKvIlwwPCKqEVB0JKSSiQx4E";

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
        const runtime = document.createElement("script");

        /*
         * v9 = cache bust.
         * The existing desktop design-runtime remains unchanged.
         */
        runtime.src = new URL(
            "./design-runtime.js?v=9",
            document.baseURI
        ).href;

        runtime.defer = true;

        runtime.onload = function () {
            const mobileFix =
                document.createElement("script");

            mobileFix.src = new URL(
                "./mobile-fix.js?v=1",
                document.baseURI
            ).href;

            mobileFix.defer = true;

            document.head.appendChild(mobileFix);
        };

        document.head.appendChild(runtime);
    }
}
