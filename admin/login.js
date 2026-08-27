document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");

    const loginButton =
        document.getElementById("loginButton");

    const formMessage =
        document.getElementById("formMessage");


    function showMessage(message, type = "error") {

        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;

        formMessage.className =
            `form-message show ${type}`;

    }


    function setLoading(isLoading) {

        if (!loginButton) {
            return;
        }

        loginButton.disabled = isLoading;

        loginButton.classList.toggle(
            "loading",
            isLoading
        );

    }


    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";

                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";

                passwordToggle.textContent =
                    isPassword
                        ? "🙈"
                        : "👁";

            }
        );

    }


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showMessage(
                    "E-posta ve şifre giriniz."
                );

                return;

            }


            if (
                !window.supabaseClient &&
                !window.supabase
            ) {

                showMessage(
                    "Supabase bağlantısı bulunamadı."
                );

                return;

            }


            const client =
                window.supabaseClient;


            if (!client) {

                showMessage(
                    "Supabase istemcisi oluşturulamadı."
                );

                return;

            }


            try {

                setLoading(true);

                showMessage(
                    "Giriş yapılıyor...",
                    "success"
                );


                const {
                    data,
                    error
                } =
                    await client.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                if (error) {
                    throw error;
                }


                if (!data.user) {

                    throw new Error(
                        "Kullanıcı bulunamadı."
                    );

                }


                showMessage(
                    "Giriş başarılı. Yönlendiriliyorsunuz...",
                    "success"
                );


                setTimeout(() => {

                    window.location.href =
                        "admin.html";

                }, 500);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                showMessage(
                    error.message ||
                    "Giriş sırasında hata oluştu."
                );

                setLoading(false);

            }

        }
    );

});
