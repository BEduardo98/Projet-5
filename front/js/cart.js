let productInLocalStorage = JSON.parse(localStorage.getItem("product"));
console.log(productInLocalStorage);


function panier () {

    let totalPrecedent = 0 ;
    let quantiteTotal = calculTotalQuantité();
    let prixTotal =  calculTotalAchatV2();
    console.log("quantité produit :" +quantiteTotal);
    console.log("total achat :" +prixTotal);

    var finalPrice = 0;
    for (let product in productInLocalStorage){
        //récupérer les détails produits
        console.log(productInLocalStorage[product]);
        var produitId = productInLocalStorage[product].idProduit;
         getProductDetailById(produitId).then(function (detailProduit){
            let ajoutHtml = document.getElementById("cart__items");
            ajoutHtml.innerHTML += `
            <article class="cart__item" data-id="${detailProduit._id}" data-color="${detailProduit.colors}">
            <div class="cart__item__img">
              <img src="${detailProduit.imageUrl}" alt="${detailProduit.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${detailProduit.name}</h2>
                <p>${productInLocalStorage[product].couleur}</p>
                <p>${detailProduit.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : ${productInLocalStorage[product].quantite}</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[product].quantite}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
          var quantiteCourante = productInLocalStorage[product].quantite;
          var prixActuel = detailProduit.price;
          totalPrecedent = calculTotalAchat(totalPrecedent, quantiteCourante, prixActuel);

          finalPrice += prixActuel*quantiteCourante;
        });
    }
setTimeout(() => {
  //console.log("Retardée d'une seconde.");
}, 3000)
    console.log("finalPrice "+finalPrice)
}

panier();

/**
 * Récupère les détails d'un produit
 * 
 * @param idProduct
 */

 async function getProductDetailById(idProduct) {
  //const response = await fetch('/movies');
  // waits until the request completes...

  let url = `http://localhost:3000/api/products/${idProduct}`;
  const response = await fetch(url,
    {
    	method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      return responseData;
    })
    .catch(error => console.warn(error));

    return response;
  }




 /*function getProductDetailById2(idProduct){
    let url = `http://localhost:3000/api/products/${idProduct}`;
    return  fetch(url,
    {
    	method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      return responseData;
    })
    .catch(error => console.warn(error));
  }*/

//Calcul de la quantité totale
  function calculTotalQuantité(){
    let quantityProduct = 0;
    for (let i = 0; i < productInLocalStorage.length; i++){
      var productQuantity = productInLocalStorage[i].quantite;
      quantityProduct += parseInt(productQuantity);
      //console.log(quantityProduct);
    }
    return quantityProduct ;
    //Récupération des produits
   // let prooduct = localStorage.getItem("product");
}

//Calcul du prix total 
  function calculTotalAchat(totalPrecedent, quantiteCourante, prixActuel){
    let total = document.getElementById("totalPrice");
    total.innerHTML = totalPrecedent;
    return totalPrecedent + quantiteCourante * prixActuel;    
}

//Calcul du prix total 
 
   function calculTotalAchatV2(){
    var total = 0 ;
    for (let i = 0; i < productInLocalStorage.length; i++){
      let productQuantity = productInLocalStorage[i].quantite;
      let currentId = productInLocalStorage[i].idProduit;

      //Récupérer le prix du produit
      let prix =  getProductDetailById(currentId).then(function (detailProduit){
         // console.log("quantite "+productQuantity+" prix ="+detailProduit.price)
          return detailProduit._price; 
        }).then(function(price){
          console.log(prix)
          return price ; 
        })
        console.log(prix)
      //total += currentTotal;
    }
      
    
    return total ;
  }


//Supprimer les articles
function supressionProduit(id, couleur) {
  let produitAsupprimer = productInLocalStorage;
  for (i = 0; i < produitAsupprimer.length; i++) {
    if ( id === produitAsupprimer[i][0] && couleur === produitAsupprimer[i][1]) {
      produitAsupprimer.splice(i , 1)
      localStorage.setItem("product", JSON.stringify(produitAsupprimer));
      window.location.reload();
    }
  }
}





  