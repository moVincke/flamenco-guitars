function getCheminLangue(langue) {
    const pageDansDossierHtml = window.location.pathname.includes("/html/");

    if (pageDansDossierHtml) {
        return "../json/" + langue + ".json";
    } else {
        return "json/" + langue + ".json";
    }
}

function chargerLangue(langue) {
    fetch(getCheminLangue(langue))
        .then(response => response.json())
        .then(traductions => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const cle = element.getAttribute("data-i18n");

                if (traductions[cle]) {
                    element.textContent = traductions[cle];
                }
            });

            document.documentElement.lang = langue;
            localStorage.setItem("LangueChoisie", langue);

            document.dispatchEvent(new Event("langueChangee")); //indique au site que la langue a été modifiée
        })
        .catch(error => {
            console.error("Erreur lors du chargement de la langue :", error);
        });
}

window.addEventListener("load", function() {
    const selectLangue = document.getElementById("langue-select");
    const langueSauvegardee = localStorage.getItem("LangueChoisie") || "fr";

    chargerLangue(langueSauvegardee);

    if (selectLangue) {
        selectLangue.value = langueSauvegardee;

        selectLangue.addEventListener("change", function() {
            chargerLangue(selectLangue.value);
        });
    }
});