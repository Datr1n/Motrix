document.addEventListener("DOMContentLoaded", function () {

    document.addEventListener("click", function (e) {
        const eyeBtn = e.target.closest(".eye-btn");
        if (!eyeBtn) return;

        const inputGroup = eyeBtn.closest(".input-group");
        if (!inputGroup) return;

        const passwordInput = inputGroup.querySelector("input[type='password'], input[type='text']");
        if (!passwordInput) return;

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeBtn.querySelector("img").setAttribute("src", "./Assets/Icons/eye.png");
        } else {
            passwordInput.type = "password";
            eyeBtn.querySelector("img").setAttribute("src", "./Assets/Icons/close-eye.png");
        }
    });

    const loginBtn = document.getElementById("login-submit");
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");

    if (loginBtn) {
        loginBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const email = loginEmail ? loginEmail.value.trim() : "";
            const password = loginPassword ? loginPassword.value.trim() : "";

            if (email === "" || password === "") {
                showToast("Te rog completează toate câmpurile!", "error");
                return;
            }

            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showToast("Te rog introdu o adresă de email validă!", "error");
                return;
            }

            const userData = localStorage.getItem("motrix_user");

            if (!userData) {
                showToast("Nu ai un cont. Te rog înregistrează-te mai întâi!", "error");
                return;
            }

            const user = JSON.parse(userData);

            if (user.email === email && user.password === password) {
                localStorage.setItem("motrix_logged_in", "true");
                showToast("Autentificare reușită! Bine ai revenit!", "success");

                setTimeout(function () {
                    window.location.href = "index.html";
                }, 1000);
            } else if (user.email !== email) {
                showToast("Nu există un cont cu această adresă de email!", "error");
            } else {
                showToast("Parola este incorectă!", "error");
            }
        });
    }

    const regBtn = document.getElementById("reg-submit");
    const regName = document.getElementById("reg-name");
    const regEmail = document.getElementById("reg-email");
    const regPassword = document.getElementById("reg-password");
    const regConfirm = document.getElementById("reg-confirm");
    const regTerms = document.getElementById("reg-terms");

    if (regBtn) {
        regBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const nume = regName ? regName.value.trim() : "";
            const email = regEmail ? regEmail.value.trim() : "";
            const parola = regPassword ? regPassword.value.trim() : "";
            const confirmare = regConfirm ? regConfirm.value.trim() : "";

            if (nume === "" || email === "" || parola === "" || confirmare === "") {
                showToast("Toate câmpurile sunt obligatorii!", "error");
                return;
            }

            if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
                showToast("Te rog introdu o adresă de email validă!", "error");
                return;
            }

            if (parola.length < 6) {
                showToast("Parola trebuie să aibă cel puțin 6 caractere!", "error");
                return;
            }

            if (parola !== confirmare) {
                showToast("Parolele nu coincid!", "error");
                return;
            }

            if (regTerms && !regTerms.checked) {
                showToast("Trebuie să accepți Termenii și condițiile!", "error");
                return;
            }

            const existingData = localStorage.getItem("motrix_user");
            if (existingData) {
                const existingUser = JSON.parse(existingData);
                if (existingUser.email === email) {
                    showToast("Există deja un cont cu această adresă de email!", "error");
                    return;
                }
            }

            const utilizator = {
                name: nume,
                email: email,
                password: parola
            };
            localStorage.setItem("motrix_user", JSON.stringify(utilizator));

            showToast("Cont creat cu succes! Te poți autentifica.", "success");

            setTimeout(function () {
                window.location.href = "login.html";
            }, 1500);
        });
    }

});
