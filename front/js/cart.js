let panier = JSON.parse(localStorage.getItem("product"));
console.log(panier);

// Récuperer infos grâce à l'id
async function getProductDetailById(idProduct){
    let url = `http://localhost:3000/api/products/${idProduct}`;
    try {
    const response = await fetch(url,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return console.warn(error);
  }
}

// Affiche les elements stocké dans le localStorage à savoir : Nom + couleur + imageProduit + altTxt
// On effectue les calculs nécessaires pour trouver la quantité et le prix

function afficherPanier() {
  for (let product in panier){
        var produitById = panier[product].idProduit;
        getProductDetailById(produitById).then(function (productDetail){
            let ajoutHtml = document.getElementById("cart__items");
            ajoutHtml.innerHTML += 
            `
            <article class="cart__item" data-id="${productDetail._id}" data-color="${productDetail.colors}">
            <div class="cart__item__img">
              <img src="${productDetail.imageUrl}" alt="${productDetail.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${productDetail.name}</h2>
                <p>${panier[product].couleur}</p>
                <p>${productDetail.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : ${panier[product].quantite}</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${panier[product].quantite}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>
          `       
        })
    }
}

afficherPanier();


// Modifier la quantité au sein du panier
const changeQuantity = async () => {
  let choixQuantiteUtilisateur = document.getElementsByClassName("itemQuantity");
  for (let i=0; i < choixQuantiteUtilisateur.length; i++){
    choixQuantiteUtilisateur[i].addEventListener("change", async (event) => {
      let productInCart = panier[i];
      console.log(productInCart);
      const recuperationInfos = await getProductDetailById(productInCart.idProduit);
      let produitId = productInCart.idProduit;
      console.log(produitId);
      let produitCouleur = productInCart.couleur;
      console.log(produitCouleur);
      let productToUpdate = panier.find(element => element.idProduit == produitId && element.couleur == produitCouleur);
      if (productToUpdate){
        productToUpdate.quantite = choixQuantiteUtilisateur[i].valueAsNumber;
        localStorage.setItem("product",JSON.stringify(panier));
      }
      totalRefresh();
    })
  }
}

//wait until dom element created
setTimeout(() => {
  changeQuantity();
}, "500")

//get total price and total quantite from localStorage to update the modificationQuantite 
const totalRefresh = async () => {
  let panierPrixTotal = 0;
  let panierQuantiteTotal = 0;
  if (localStorage.length != 0) {
    for (let i = 0; i < panier.length; i++) {
      let produitDansPanier = panier[i];
      const produit = await getProductDetailById(produitDansPanier.idProduit);
      panierPrixTotal += parseInt(produitDansPanier.quantite) * produit.price;
      panierQuantiteTotal += parseInt(produitDansPanier.quantite);
    }
  }
  const quantiteAfficher = document.getElementById("totalQuantity");
  quantiteAfficher.innerHTML = panierQuantiteTotal;
  const prixAfficher = document.getElementById("totalPrice");
  prixAfficher.innerHTML = panierPrixTotal;
}

totalRefresh();


function deleteProduct(){
  let deleteProduct = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < deleteProduct.length; i++) {
    deleteProduct[i].addEventListener("click", (event) => {

      let findArticle = deleteProduct[i].closest("article");
      let productToDelete = panier.indexOf(panier[i]);
      panier.splice(productToDelete, 1);
      findArticle.remove();
      if (localStorage != undefined) {
        localStorage.setItem("product",JSON.stringify(panier));
      }
      else {
        localStorage.clear();
      }
      totalRefresh();
      console.log("Produit supprimé du panier");
      location.reload();
    });
  }
}

setTimeout(() => {
  deleteProduct();
}, "500")



// Création d'une regex globale a appliquer sur les champs du nom,prenom,ville
const globalRegex = new RegExp("^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$");

// Création d'une fonction qui permet d'afficher une erreur sur les champs de saisie
// Celle-ci prends en parametres l'id et le nom du champ de saisie
function erreurGlobale (idHtml,champSaisie){
  let inputSpace = document.getElementById(`${idHtml}`);
  inputSpace.innerHTML = `${champSaisie} est invalide`;
}

function firstNameVerify(prenom) {
  let champRempli = false;
  if (globalRegex.test(prenom)) {
    champRempli = true;
  }
  else {
    erreurGlobale("firstNameErrorMsg","Prénom");
  }
  return champRempli;
}

function LastNameVerify(nom) {
  let champRempli = false;
  if (globalRegex.test(nom)) {
    champRempli = true;
  }
  else {
    erreurGlobale("lastNameErrorMsg","Nom");
  }
  return champRempli;
}

function cityVerify(ville) {
  let champRempli = false;
  if (globalRegex.test(ville)) {
    champRempli = true;
  }
  else {
    erreurGlobale("cityErrorMsg","Ville");
  }
  return champRempli;
}

function adressVerify(adresse) {
  let champRempli = false;
  const regexPourAdresse = new RegExp ("([0-9]*)?([a-zA-Z]*)");
  if (regexPourAdresse.test(adresse)) {
    champRempli = true;
  }
  else {
    erreurGlobale("addressErrorMsg","Adresse");
  }
  return champRempli;
}

function emailVerify(email) {
  let champRempli = false;
  const regexPourEmail = new RegExp ("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");
  if (regexPourEmail.test(email)) {
    champRempli = true;
  }
  else {
    erreurGlobale("emailErrorMsg","Email");
  }
  return champRempli;
}

// Envoie requete vers API qui contient toutes les informations entrées par l'utilisateur et redirige l'utilisateur vers la page confirmation.html
function envoiRequeteVersApi (body) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers : {
      "Content-type": "application/json;charset=utf-8",
    },
    body : JSON.stringify(body),
  })
  .then ((response) => {
    if (response.status == 201) {
      return response.json();
    }
    else {
      console.error("Une erreur est survenue lors de la commande");
    }
  })
  .then ((order) => {
    localStorage.clear();
    id = order.orderId;
    window.location.href = `confirmation.html?id=${id}`;
  });
}

addEventListener("submit", function(event){
  event.preventDefault();
  let prenom = event.target.firstName.value;
  let nom = event.target.lastName.value;
  let adresse = event.target.address.value;
  let ville = event.target.city.value;
  let email = event.target.email.value;
  if (
    firstNameVerify(prenom) &&
    LastNameVerify(nom) &&
    adressVerify(adresse) &&
    cityVerify(ville) 
    &&emailVerify(email)
  ){
    envoiRequeteVersApi(createBodyRequest(prenom, nom , ville , adresse , email));
  }
  else {
    console.error("Les champs ne sont pas remplies de maniere correcte");
  }
});

function createBodyRequest(prenom, nom, adresse, ville, mail) {
  let idProducts = [];
  for (let i = 0; i < panier.length; i++) {
    idProducts.push(panier[i].idProduit);
  }
  const bodyContent = {
    contact: {
      firstName: prenom,
      lastName: nom,
      address: adresse,
      city: ville,
      email: mail,
    },
    products: idProducts,
  };
  return bodyContent;
}
