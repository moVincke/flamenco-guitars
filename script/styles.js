function getCheminCss(style) { //creer le chemin correcte pour naviguer entre dossier
    const pageDansDossierHtml = window.location.pathname.includes("/html/");

    if (pageDansDossierHtml) {
        return "../css/" + style + ".css";
    } else {
        return "css/" + style + ".css";
    }
}

function changerStyle(style) { //appelée depuis onclick dans html
    const cheminCss = getCheminCss(style);

    document.getElementById("theme-link").href = cheminCss; //on change le href pur changer le ficher css correspondant au style choisi
    localStorage.setItem("StyleChoisi", style);
}

window.onload = function() { //permet de garder le style si page rechargée
    const styleSauvegarde = localStorage.getItem("StyleChoisi") || "style1";
    const cheminCss = getCheminCss(styleSauvegarde);

    document.getElementById("theme-link").href = cheminCss; //on change le href pur changer le ficher css correspondant au style choisi
};
    


