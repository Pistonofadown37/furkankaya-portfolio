document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const loginForm =
            document.getElementById("loginForm");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const passwordToggle =
            document.getElementById("passwordToggle");

        const loginButton =
            document.getElementById("loginButton");

        const formMessage =
            document.getElementById("formMessage");


        /* =====================================
           ZATEN GİRİŞ YAPILMIŞSA
        ===================================== */

        try {

            const {
                data
            } = await supabaseClient
                .auth
                .getUser();


            if (data.user) {

                window.location.href =
                    "admin.html";

                return;

            }

        } catch (error) {

            console.error(
                "Oturum kontrol hatası:",
                error
            );

        }


        /* =====================================
           ŞİFRE GÖSTER / GİZLE
        ===================================== */

        if (passwordToggle) {

            passwordToggle.addEventListener(
                "click",
                () => {

                    const isPassword =
                        passwordInput.type ===
                        "password";


                    passwordInput.type =
                        isPassword
                            ? "text"
                            : "password";


                    passwordToggle.textContent =
                        isPassword
                            ? "🙈"
                            : "👁";


                    passwordToggle.setAttribute(
                        "aria-label",
                        isPassword
                            ? "Şifreyi gizle"
                            : "Şifreyi göster"
                    );

                }
            );

        }


        /* =====================================
           FORM MESAJI
        ===================================== */

        function showMessage(
            message,
            type = "error"
        ) {

            if (!formMessage) {
                return;
            }


            formMessage.textContent =
                message;


            formMessage.className =
                `form-message ${type} show`;

        }


        function clearMessage() {

            if (!formMessage) {
                return;
            }


            formMessage.textContent =
                "";


            formMessage.className =
                "form-message";

        }


        /* =====================================
           GİRİŞ FORMU
        ===================================== */

        if (!loginForm) {
            return;
        }


        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                clearMessage();


                const email =
                    emailInput.value
                        .trim();


                const password =
                    passwordInput.value;


                if (!email) {

                    showMessage(
                        "E-posta adresinizi girin."
                    );

                    emailInput.focus();

                    return;

                }


                if (!password) {

                    showMessage(
                        "Şifrenizi girin."
                    );

                    passwordInput.focus();

                    return;

                }


                try {

                    loginButton.disabled =
                        true;


                    loginButton.classList.add(
                        "loading"
                    );


                    const {
                        data,
                        error
                    } = await supabaseClient
                        .auth
                        .signInWithPassword(
                            {
                                email:
                                    email,

                                password:
                                    password
                            }
                        );


                    if (error) {
                        throw error;
                    }


                    if (!data.user) {

                        throw new Error(
                            "Kullanıcı oturumu oluşturulamadı."
                        );

                    }


                    showMessage(
                        "Giriş başarılı. Yönlendiriliyorsunuz...",
                        "success"
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "admin.html";

                        },
                        700
                    );

                } catch (error) {

                    console.error(
                        "Giriş hatası:",
                        error
                    );


                    let errorMessage =
                        "Giriş yapılırken bir hata oluştu.";


                    if (
                        error.message ===
                        "Invalid login credentials"
                    ) {

                        errorMessage =
                            "E-posta veya şifre hatalı.";

                    }


                    showMessage(
                        errorMessage,
                        "error"
                    );


                    loginButton.disabled =
                        false;


                    loginButton.classList.remove(
                        "loading"
                    );

                }

            }
        );

    }
);