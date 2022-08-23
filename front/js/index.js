// Fonction pour réquete API pour l'ensemble des produits
let url = "http://localhost:3000/api/products"
fetch(url)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function(data){
        load(data);
        console.log(data);
});

// Fonction pour récuperer les données et les transmettre au code HTML
function load(data) {
    for(produit of data) {
        let productElement = document.getElementById("items");
        productElement.innerHTML += `
            <a href="./product.html?id=${produit._id}">
                <article>
                    <img src="${produit.imageUrl}" alt="${produit.altTxt}">
                    <h3 class="productName">${produit.name}</h3>
                    <p class="productDescription">${produit.description}</p>
                </article>
            </a>`
    }

}