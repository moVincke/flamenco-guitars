function getLangueActive() {
    return localStorage.getItem("LangueChoisie") || "fr"; //je sélectionne la langue dans le local storage, si vide => fr
}

function afficherTypes() {
    const langue = getLangueActive();

    Promise.all([                                                              
        fetch("json/types-guitares.json").then(response => response.json()),
        fetch("json/" + langue + ".json").then(response => response.json())
    ])
        .then(([typesData, traductions]) => {
            const container = document.getElementById("types-container");

            container.innerHTML = typesData.map(type => `
              <article>
                <img src="${type.image}" alt="${traductions[type.nameKey]}">
                <h3>${traductions[type.nameKey]}</h3>
                <p>${traductions[type.descriptionKey]}</p>
                <a href="html/modeles.html?type=${type.id}">${traductions["voirModeles"]}</a>
              </article>
`).join("");
        })
        .catch(error => {
            console.error("Erreur lors du chargement des types :", error);
        });
}

afficherTypes();
document.addEventListener("langueChangee", afficherTypes); // "écoute" si un évenement est lancé par dispatchevent"languechangée" et actualise le contenu dynamique

    //j'utilise map au lieu d'un forEach pour ne pas modifier le html plusieurs fois 
    //le join sert a creer une seule chaine à inserer dans la page via innerHTML