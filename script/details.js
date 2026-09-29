// Récupère la langue choisie dans le localStorage, si pas fr d'office

function getLangueActive() {
    return localStorage.getItem("LangueChoisie") || "fr";
}

// Affiche les détails du modèle sélectionné dans la langue active.
function afficherDetails() {
    const langue = getLangueActive();

    // Récupère le modèle choisi dans l'URL.
    const params = new URLSearchParams(window.location.search);
    const modeleChoisi = params.get("modele");

    // Charge en même temps le json details,modèle pour l'image,traductions
    Promise.all([
        fetch("../json/details-guitares.json").then(response => response.json()),
        fetch("../json/modeles-guitares.json?v=2").then(response => response.json()),
        fetch("../json/" + langue + ".json").then(response => response.json())         //fetch = je demande de charger le fichier dans response puis response.json transforme la reponse en objet/tab javascript
    ]).then(([detailsData, modelesData, traductions]) => {  //je stocke le contenu exploitable des fichiers recupéré grace au fetch dans les 3 variables 
        const detailsContainer = document.getElementById("details-container"); //je stocke dans detailscontainer l'elements html qui a l'id 'details container' (ou on va écrire dans la page)
        const evolutionContainer = document.getElementById("evolution-container");

        if (!modeleChoisi) {  //si pas de modele choisis, on remplace le html de detailscontainer par le bout de html ci dessous dont les balises servent a integrer la bonne traduction
            detailsContainer.innerHTML = `           
        <article>
            <h3>${traductions["details.noModelSelected"]}</h3>
            <p>${traductions["details.chooseModelMessage"]}</p>
            <a href="modeles.html">${traductions["details.backToModels"]}</a>
        </article>
    `;
            evolutionContainer.innerHTML = "";
            return;
}

        const modele = detailsData.find(guitare => guitare.id === modeleChoisi);  //je cherche et stocke dans modele les donnes dans detailsdata correspondant au modele stocké dans modelechoisis trouvé via parms url

        const modeleImage = modelesData.find(guitare => guitare.id === modeleChoisi);

        // Si aucun modèle ne correspond à l'id dans l'URL erreur affichée
        if (!modele) {
            detailsContainer.innerHTML = `<p>${traductions["details.modelNotFound"]}</p>`;
            evolutionContainer.innerHTML = "";
            return;
        }

        // Si une image existe dans modeles-guitares.json on la met sinon rien d'afficher
         const imageHtml = modeleImage && modeleImage.image
            ? `<img src="../${modeleImage.image}" alt="${traductions[modele.nameKey]}">`
            : "";

        // Affiche les informations détaillées du modèle.  //charge le html a l'endroit indiqué par la const detailscontainer
            detailsContainer.innerHTML = `
            <article>
                ${imageHtml}

                <h3>${traductions[modele.nameKey]}</h3>

                <p>
                    <strong>${traductions["details.typeLabel"]} :</strong>
                    ${traductions[modele.typeKey]}
                </p>

                <p>
                    <strong>${traductions["details.descriptionLabel"]} :</strong>
                    ${traductions[modele.descriptionKey]}
                </p>

                <p>
                    <strong>${traductions["details.woodLabel"]} :</strong>
                    ${traductions[modele.woodKey]}
                </p>

                <p>
                    <strong>${traductions["details.soundLabel"]} :</strong>
                    ${traductions[modele.soundKey]}
                </p>

                <p>
                    <strong>${traductions["details.usageLabel"]} :</strong>
                    ${traductions[modele.usageKey]}
                </p>

                <p>
                    <strong>${traductions["details.averagePriceLabel"]} :</strong>
                    ${traductions[modele.averagePriceKey]}
                </p>
            </article>
        `;

        // Génère le tableau d'évolution + traduction colonne
    
        evolutionContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>${traductions["details.yearLabel"]}</th>
                        <th>${traductions["details.estimatedPriceLabel"]}</th>
                    </tr>
                </thead>
                <tbody>
                    ${modele.evolution.map(ligne => `
                        <tr>
                            <td>${ligne.annee}</td>
                            <td>${ligne.prix} €</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    })
    .catch(error => {
        console.error("Erreur lors du chargement des détails :", error);
    });
}


afficherDetails();
document.addEventListener("langueChangee", afficherDetails); //evenement déclanché si la langue est modifiée, on recharge les détails via la fct afficherDetails dans la langue choisie