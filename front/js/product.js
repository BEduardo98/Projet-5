var url = "http://localhost:3000/api/products";

var searchParam = new URLSearchParams(document.location.search); // On cherche les parametres de l'url actuel

var produitId = searchParam.get("id"); // On lui demande de chercher l'id du produit
var newUrl = `http://localhost:3000/api/products/${produitId}`; // On lui passe un nouveau Url avec l'id du searchParam

// On récupere le produit en question grâce a son id et on l'affiche sur la page
fetch(newUrl)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data){
        var produit = data;
        ajoutImg(produit);
        ajoutTitle(produit);
        ajoutPrix(produit);
        ajoutDescription(produit);
        ajoutCouleurs(produit);
        addTitle(produit);


});

// Ces fonctions nous permettent d'afficher les détails du produit sur notre page web

// Affichage titre de la page
function addTitle (produit) {
    document.getElementsByTagName('title')[0].innerHTML = `${produit.name}`
}


// On récupere l'image et son altTxt
function ajoutImg(produit) {
    var produitImg = document.querySelector(".item__img");
        produitImg.innerHTML += `
        <img src="${produit.imageUrl}" alt="${produit.altTxt}">`;    
}

// On récupere le titre du produit
function ajoutTitle(produit) {
    var produitName = document.getElementById("title");
        produitName.innerHTML += `${produit.name}`;
}

// On récupere le prix du produit
function ajoutPrix(produit) {
    var produitPrice = document.getElementById("price");
        produitPrice.innerHTML += `${produit.price}`;
}

// On récupere la description du produit
function ajoutDescription(produit) {
    var produitDescription = document.getElementById("description");
        produitDescription.innerHTML += `${produit.description}`;
}

// On utilise la boucle for pour récuperer les couleurs du produit, pour eviter des lignes de code inutiles
function ajoutCouleurs(produit) {
     for (i in produit.colors) {
        var produitCouleur = document.getElementById("colors");
        produitCouleur.innerHTML += `<option value="${produit.colors[i]}">${produit.colors[i]}</option>`;
    }
}


// Fonction qui vérifie que les données envoyés au localStorage sont ok
function verificationInput(){
    var quantiteVerification = document.getElementById("quantity").value;
    var couleurVerification = document.getElementById("colors").value;    
    if(couleurVerification == '' || quantiteVerification == 0){
        alert("Vérifier vos valeurs");
    }
    else{
        console.log("Tout est bon");
    }
}

//Fonction pour récupérer la quantité, la couleur et l'Id
function recuperationData(){

    verificationInput();
    let quantiteChoisie = document.getElementById("quantity").value;
    let couleurProduit = document.getElementById("colors").value;
    
    console.log(`Product id : ${produitId} , quantité : ${quantiteChoisie} , couleur : ${couleurProduit} `);
    //clé : valeur
    let selectedProduct = {
        idProduit : produitId,
        quantite : quantiteChoisie,
        couleur : couleurProduit, 
    }
    //init localstorage or get exisiting value
    productInLocalStorage = JSON.parse(localStorage.getItem("product"));
    console.log(productInLocalStorage);
    // Si le résultat est null dans ce cas la on crée un localStorage vide
    if(productInLocalStorage == null){
        productInLocalStorage = [];
    }
    //Vérifier si on a dejà un produit dans le localstorage avec la même couleur si oui on rajoute juste la quantité sinon on crée un nouveau produit
    let resultat = productInLocalStorage.find((item) => item.idProduit === produitId && item.couleur === couleurProduit);
    // La variable resultat nous permet de chercher et de trouver le idProduit et la couleur dans notre local storage
    if(resultat) {
        let nouvelleQuantité = parseInt(selectedProduct.quantite) + parseInt(resultat.quantite);
        resultat.quantite = nouvelleQuantité;
        localStorage.setItem("product",JSON.stringify(productInLocalStorage))
        // Dans cet if on declare une nouvelle quantité, pour la trouver on va transformer les resultats en nombre et on va les additionner
        // Ensuite on vient push notre localStorage
    }
    else {
        //add new product
        productInLocalStorage.push(selectedProduct);
        //Set the new json product
        localStorage.setItem("product",JSON.stringify(productInLocalStorage));
    }
    
}

// Mettre button Ajouter au panier sur écoute
let button = document.getElementById("addToCart");
button.addEventListener("click",recuperationData);




 
  
