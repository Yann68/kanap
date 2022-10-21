// récupération du produit par l'ID
const productID = new URL(window.location.href).searchParams.get("id");

// Fonction pour l'appel et la reponse de l'API pour récupérer les produits par leurs ID
function getProductsCart() {
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:3000/api/products/${productID}`)
      .then(res => res.json())
      .then(resolve)
      .catch(reject)
  })
};
getProductsCart()
  .then(displayProductsCart)
  .catch(error => {
    console.log('Fetch error:. ', error);
  });

// fonction pour crée un tableau dans le localstorage
function getLocalStorageProducts() {
  let products = localStorage.getItem("products");
  if (!products)
    return [];
  return JSON.parse(products);
};
// fonction pour enregistré les produits dans le localstorage
function addProductToLocalStorage(product) {
  let products = getLocalStorageProducts();
  products.push(product);
  localStorage.setItem("products", JSON.stringify(product));
};
// fonction pour affiché les produits dans le DOM
function displayProductsCart(product) {
  //récupération de la <div> item__img
  const itemImage = document.querySelector(".item__img");
  itemImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  // récupération de la balise <h1> titre
  const itemTitle = document.getElementById("title");
  itemTitle.innerHTML = `${product.name}`;
  // récupération de la balise <p> prix
  const itemPrice = document.getElementById("price");
  itemPrice.innerHTML = `${product.price}`;
  // récupération de la balise <p> description
  const itemDescription = document.getElementById("description");
  itemDescription.innerHTML = `${product.description}`;
  // récupération de la balise <select> couleurs 
  const itemColor = document.getElementById("colors");
  // création de la boucle pour récupérer les couleurs sur l'API
  for (i = 0; i < product.colors.length; i++) {
    // création de la balise <option> couleurs
    const itemOption = document.createElement("option");
    itemOption.value = product.colors[i];
    itemOption.innerText = product.colors[i];
    itemColor.appendChild(itemOption);
  }
};
// fonction du bouton ajouter au panier avec une ecoute au clic 
function buttonAddProductCart() {
// Utilisation de regex pour autorisé juste les chiffres 
// Création de plusieurs alertes 
  const regNumber = new RegExp("^[0-9]{0,3}$");
  const button = document.getElementById("addToCart");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const color = document.getElementById("colors").value
    const quantity = document.getElementById("quantity").value
    if (!regNumber.test(quantity)) {
      alert("Quantité invalide !")
      return;
    } if (color == "" && quantity < 1) {
      alert("veuillez choisir une couleur et une quantité !")
      return;
    } if (color == "") {
      alert("veuillez choisir une couleur !")
      return;
    } if (quantity < 1) {
      alert("veuillez choisir une quantité supérieur à 0 !")
      return;
    } if (quantity > 100) {
      alert("veuillez choisir une quantité inférieur à 100 !")
      return;
    }
    // création du tableau pour les produits a envoyer dans le localstorage
    else {
      const product = {
        id: productID,
        colors: color,
        quantity: Number(quantity)
      }
      addCart(product);
    }
  })
};
buttonAddProductCart();
// fonction pour repérer si un article est deja present dans le localstorage 
// Si oui on le rajoute au produit deja present en comparant les id et les couleurs avec find
// sinon on l'ajoute dans le localstorage
function addCart(product) {
  const itemTitle = document.getElementById("title");
  const productName = itemTitle.innerHTML;
  let products = getLocalStorageProducts();
  let found = products.find((element) => element.id === product.id && element.colors === product.colors);
  if (found) {
    found.quantity += product.quantity;
    if (found.quantity > 100) {
      alert("Quantité maximum de 100 articles pour la même couleur");
      return;
    } else {
      alert(`${product.quantity} ${productName} de couleur ${product.colors} a nouveau ajouté dans le panier `);
    }
  } else {
    products.push(product);
    alert(`${product.quantity} ${productName} de couleur ${product.colors} ajouté dans le panier  `);
  }
  addProductToLocalStorage(products);
};














