document.addEventListener("DOMContentLoaded", function () {

    const submitBtn = document.getElementById("contact-submit");
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");

    if (submitBtn) {
        submitBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const nume = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const subiect = subjectInput ? subjectInput.value.trim() : "";
            const mesaj = messageInput ? messageInput.value.trim() : "";

            if (nume === "" || subiect === "" || mesaj === "") {
                showToast("Toate câmpurile obligatorii trebuie completate!", "error");
                return;
            }

            if (email !== "" && (email.indexOf("@") === -1 || email.indexOf(".") === -1)) {
                showToast("Te rog introdu o adresă de email validă!", "error");
                return;
            }

            showToast("Mesajul tău a fost trimis cu succes!", "success");

            if (nameInput) nameInput.value = "";
            if (emailInput) emailInput.value = "";
            if (subjectInput) subjectInput.value = "";
            if (messageInput) messageInput.value = "";
        });
    }

    const faqItems = document.querySelectorAll(".faq-item");

    for (let i = 0; i < faqItems.length; i++) {
        const questionBtn = faqItems[i].querySelector(".faq-question");

        if (questionBtn) {
            (function (item, btn) {
                btn.addEventListener("click", function () {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                        btn.classList.remove("active");
                    } else {
                        item.classList.add("active");
                        btn.classList.add("active");
                    }
                });
            })(faqItems[i], questionBtn);
        }
    }

});
