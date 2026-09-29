// Récupère la langue choisie dans le localStorage, si pas de langue choisie fr 

function getLangueActive() {
    return localStorage.getItem("LangueChoisie") || "fr";
}

// Affiche les modèles de guitares dans la langue choisie
function afficherModeles() {
    const langue = getLangueActive();

    // Associe le type dans l'url à la clé correspondante des .json
    const typeKeys = {
        "blanca": "types.blanca.name",
        "negra": "types.negra.name",
        "pan-coupe": "types.panCoupe.name",
        "semi-electro": "types.semiElectro.name"
    };

    // Charge en même temps les .json de données et de langues
    
    Promise.all([
        fetch("../json/modeles-guitares.json?v=2").then(response => response.json()),
        fetch("../json/" + langue + ".json").then(response => response.json())
    ])
    .then(([modelesData, traductions]) => {
        
        const container = document.getElementById("modeles-container");
        const titreModeles = document.getElementById("titre-modeles");
        const soustitreModeles = document.getElementById("sousTitre-modele");
         

        const params = new URLSearchParams(window.location.search);
        const typeChoisi = params.get("type");

        //choix du titre adapté
        if (typeChoisi && typeKeys[typeChoisi]) {
            const nomType = traductions[typeKeys[typeChoisi]];
            titreModeles.textContent = traductions["modeles.titleByType"].replace("{type}", nomType);
            soustitreModeles.textContent = traductions["modeles.presentationTextByType"].replace("{type}", nomType);
            
        } else {
            // titre générale si pas de type
            titreModeles.textContent = traductions["modeles.titleAll"];
        }

        //si type choisis on filtre
        const modelesFiltres = typeChoisi && typeKeys[typeChoisi]
            ? modelesData.filter(modele => modele.type === typeChoisi)
            : modelesData;

        // map parcourt chaque modèle filtré et retourne un <article> HTML pour chacun.
        container.innerHTML = modelesFiltres.map(modele => `
            <article>
                <img src="../${modele.image}" alt="${traductions[modele.nameKey]}">
                <h3>${traductions[modele.nameKey]}</h3>
                <p>${traductions[modele.descriptionKey]}</p>
                <a href="details.html?modele=${modele.id}">${traductions["voirDetails"]}</a>
            </article>
        `).join(""); //colle tous les <article> ensemble pour pouvoir les injecter dans innerHTML.
    })
    .catch(error => {
        //erreur console si un JSON ne charge pas ou contient une erreur.
        console.error("Erreur lors du chargement des modèles :", error);
    });
}


afficherModeles();
document.addEventListener("langueChangee", afficherModeles);