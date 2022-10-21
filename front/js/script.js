// récupération des produits sur l'API
function getProducts() {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/products")
            .then(res => res.json())
            .then(resolve)
            .catch(reject)
    })
};

getProducts()
    .then(displayProducts)
    .catch(error => {
        console.log('erreur fetch: ', error);
    });

function displayProducts(products) {
    // récupération de la balise <section>
    const itemContainer = document.getElementById("items");
    // création de la boucle pour affiché le DOM avec les produits 
    for (let product of products) {
        itemContainer.innerHTML += `
        <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
        </a>`;
    }
};
