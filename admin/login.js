// =============================================
// FURKAN KAYA PORTFOLIO
// ADMIN LOGIN
// =============================================


document.addEventListener(
    "DOMContentLoaded",
    async function () {


        // =====================================
        // ELEMENTS
        // =====================================

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const loginEmail =
            document.getElementById(
                "loginEmail"
            );


        const loginPassword =
            document.getElementById(
                "loginPassword"
            );


        const loginButton =
            document.getElementById(
                "loginButton"
            );


        const loginMessage =
            document.getElementById(
                "loginMessage"
            );


        // =====================================
        // MESSAGE
        // =====================================

        function showMessage(
            message,
            type = "error"
        ) {

            if (!loginMessage) {
                return;
            }


            loginMessage.textContent =
                message;


            loginMessage.className =
                "admin-message show " + type;

        }


        function hideMessage() {

            if (!loginMessage) {
                return;
            }


            loginMessage.textContent =
                "";


            loginMessage.className =
                "admin-message";

        }


        // =====================================
        // CHECK EXISTING SESSION
        // =====================================

        try {

            const {
                data,
                error
            } =
                await supabaseClient.auth.getSession();


            if (error) {

                console.error(
                    "Session kontrol hatası:",
                    error
                );

            }


            if (
                data &&
                data.session
            ) {

                window.location.href =
                    "admin.html";

                return;

            }

        } catch (error) {

            console.error(
                "Session kontrolü başarısız:",
                error
            );

        }


        // =====================================
        // LOGIN FORM
        // =====================================

        if (!loginForm) {
            return;
        }


        loginForm.addEventListener(
            "submit",
            async function (
                event
            ) {

                event.preventDefault();


                hideMessage();


                const email =
                    loginEmail
                        ? loginEmail.value.trim()
                        : "";


                const password =
                    loginPassword
                        ? loginPassword.value
                        : "";


                // =============================
                // VALIDATION
                // =============================

                if (!email) {

                    showMessage(
                        "Lütfen e-posta adresinizi girin.",
                        "error"
                    );

                    return;

                }


                if (!password) {

                    showMessage(
                        "Lütfen şifrenizi girin.",
                        "error"
                    );

                    return;

                }


                // =============================
                // BUTTON LOADING
                // =============================

                const originalButtonText =
                    loginButton
                        ? loginButton.textContent
                        : "Giriş Yap";


                if (loginButton) {

                    loginButton.disabled =
                        true;


                    loginButton.textContent =
                        "Giriş yapılıyor...";

                }


                // =============================
                // SUPABASE LOGIN
                // =============================

                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signInWithPassword(
                                {
                                    email: email,
                                    password: password
                                }
                            );


                    if (error) {

                        console.error(
                            "Giriş hatası:",
                            error
                        );


                        let errorMessage =
                            "Giriş yapılırken bir hata oluştu.";


                        if (
                            error.message
                                .toLowerCase()
                                .includes(
                                    "invalid login credentials"
                                )
                        ) {

                            errorMessage =
                                "E-posta veya şifre hatalı.";

                        }


                        if (
                            error.message
                                .toLowerCase()
                                .includes(
                                    "email not confirmed"
                                )
                        ) {

                            errorMessage =
                                "E-posta adresi henüz doğrulanmamış.";

                        }


                        showMessage(
                            errorMessage,
                            "error"
                        );


                        return;

                    }


                    if (
                        !data ||
                        !data.session
                    ) {

                        showMessage(
                            "Oturum oluşturulamadı.",
                            "error"
                        );

                        return;

                    }


                    // =========================
                    // SUCCESS
                    // =========================

                    showMessage(
                        "Giriş başarılı. Yönlendiriliyorsunuz...",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "admin.html";

                        },
                        500
                    );

                } catch (error) {

                    console.error(
                        "Beklenmeyen giriş hatası:",
                        error
                    );


                    showMessage(
                        "Beklenmeyen bir hata oluştu.",
                        "error"
                    );

                } finally {

                    if (loginButton) {

                        loginButton.disabled =
                            false;


                        loginButton.textContent =
                            originalButtonText;

                    }

                }

            }
        );

    }
);
