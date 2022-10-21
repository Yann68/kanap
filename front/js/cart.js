// récupération du localStorage
let cart = JSON.parse(localStorage.getItem("products"));
const contenair = document.getElementById("cart__items");
// fonction pour indiqué un panier vide si le localStorage est vide
// sinon appel de la fonction getdisplayCart() si y'a un produit dans le localStorage
function arrayNull() {
  if (!cart || cart == 0) {
    const titleCart = document.querySelector("h1");
    const sectionCart = document.querySelector(".cart");
    titleCart.innerHTML = "Votre panier est vide !";
    sectionCart.style.display = "none";
  }
  else {
    getdisplayCart();
  }
};
arrayNull();

// fonction  pour récupéré et affiché le DOM 
// boucle for pour les produits a affiché 
// récupération des produits par l'id avec une demande fetch a l'API 
async function getdisplayCart() {
  for (let product of cart) {
    await fetch(`http://localhost:3000/api/products/${product.id}`)
      .then((res) => res.json())
      .then((productsAPI) => {
        contenair.innerHTML += ` 
            <article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
            <div class="cart__item__img">
              <img src="${productsAPI.imageUrl}" alt="${productsAPI.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${productsAPI.name}</h2>
                <p>${product.colors}</p>
                <p>${productsAPI.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
        // fonction appelée pour le changement de quantité
        changeQuantity();
        // fonction appelée pour la suppression d'un article
        deleteCart();
      })
      .catch((error) => {
        console.log("fetch error :", error)
      })
  }
  // fonction appelée pour l'affichage du prix et de la quantité
  TotalQuantityAndPrice();

};

//fonction pour le calcul du prix multiplier par les quantités.
function TotalQuantityAndPrice() {
  // récupération des éléments du DOM
  const totalQuantityDiv = document.getElementById("totalQuantity");
  const totalPriceDiv = document.getElementById("totalPrice");
  let totalQuantity = 0, totalPrice = 0;
  let articles = document.getElementsByClassName("cart__item");
  // création d'une boucle sur les articles pour calculé la quantité * le prix 
  // utilisation de split pour récupéré juste le prix 
  for (let i = 0; i < articles.length; i++) {
    let quantity = Number(articles[i].querySelector("input").value);
    totalQuantity += quantity;
    totalPrice += quantity * Number(articles[i].querySelector(".cart__item__content__description").querySelectorAll("p")[1].innerHTML.split(" ")[0]);
  }
  totalQuantityDiv.innerText = totalQuantity;
  totalPriceDiv.innerText = totalPrice;
};

//fonction pour la modification des valeurs de l'input quantité
function changeQuantity() {
  const changeQuantity = document.querySelectorAll(".itemQuantity");
  const regNumber = new RegExp("^[0-9]{0,3}$");
  // création d'une boucle pour ecouter le change sur l'input 
  // utilisation de event.target.valueAsNumber pour changer la quantité de l'input
  // Utilisation de regex pour autorisé juste les chiffres
  // alert si plus de 100 articles
  // sinon ajout au localStorage
  // raffraichissement du prix et de la quantité avec l'appel de la fonction TotalQuantityAndPrice()
  for (let i = 0; i < changeQuantity.length; i++) {
    changeQuantity[i].addEventListener("change", (event) => {
      event.preventDefault();
      if (!regNumber.test(changeQuantity[i].value)) {
        alert("quantité invalide")
        return;
      } if (changeQuantity[i].value > 100) {
        alert("maximum de 100 articles pour la même couleurs")
        return;
      } else {
        cart[i].quantity = event.target.valueAsNumber;
        localStorage.setItem("products", JSON.stringify(cart));
        TotalQuantityAndPrice();
      };
    });
  };
};

//fonction pour supprimer des produits
function deleteCart() {
  const deleteButton = document.querySelectorAll(".deleteItem");
  // création d'une boucle pour ecouter le click sur le bouton supprimer de l'article choisis
  // utilisation de filter pour trouver le bon article
  for (let i = 0; i < deleteButton.length; i++) {
    deleteButton[i].addEventListener("click", (event) => {
      event.preventDefault();
      let article = deleteButton[i].closest("article");
      let id = article.getAttribute("data-id");
      let color = article.getAttribute("data-color");
      cart = cart.filter((item) => item.id !== id || item.colors !== color)
      // suppression de l'article avec remove 
      // raffraichissement du prix et de la quantité avec la fonction TotalQuantityAndPrice()
      // ajout au localStorage
      article.remove();
      localStorage.setItem("products", JSON.stringify(cart));
      // si il ya plus d'article dans le localStorage 
      // suppression du tableau vide et appel de la fonction arrayNull()
      if (cart == 0 || !cart) {
        localStorage.removeItem("products");
        arrayNull();
      }
      TotalQuantityAndPrice();
    })
  }
};
//************* fin des fonctions pour les articles *************** //

//***************** formulaire ******************* //

// Récupération des éléments du formulaire
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");

const errorMsgFirstName = document.getElementById("firstNameErrorMsg");
const errorMsgLastName = document.getElementById("lastNameErrorMsg");
const errorMsgAddress = document.getElementById("addressErrorMsg");
const errorMsgCity = document.getElementById("cityErrorMsg");
const errorMsgEmail = document.getElementById("emailErrorMsg");

// RegExp firstName, lastName et city qui autorise les lettres, certains signes et des espaces entre 2 et 40 caractéres
const regNameCity = new RegExp("^[a-zA-Zà-ÿ \\-']{2,60}$");
// RegExpAddress qui autorise les lettres et les numero
const regAddress = new RegExp("^[a-zA-Zà-ÿ \\-'0-9 ]{2,80}$");
// RegExpEmail qui autorise que si l'utilisateur tape des lettres ou numero suivi d'un @ puis de lettres suivi d'un point et à nouveau des lettres
const regEmail = new RegExp("^[a-zA-Zà-ÿ\\-' _0-9]{2,40}[@]{1}[a-zA-Zà-ÿ ]{2,40}[.]{1}[a-zA-Zà-ÿ ]{1,25}$");

// fonction pour les input du formulaire
// utilisation de addEventListener pour ecouté le changement sur chaque input
// affichage d'un message d'erreur en cas de mauvaise saisie
function validForm() {
  firstName.addEventListener("change", (event) => {
    event.preventDefault();
    if (regNameCity.test(firstName.value))
      errorMsgFirstName.innerHTML = "";
    else {
      errorMsgFirstName.innerHTML = "votre prénom est invalide"
    }
  });
  lastName.addEventListener("change", (event) => {
    event.preventDefault();
    if (regNameCity.test(lastName.value))
      errorMsgLastName.innerHTML = "";
    else {
      errorMsgLastName.innerHTML = "votre nom est invalide"
    }
  });
  address.addEventListener("change", (event) => {
    event.preventDefault();
    if (regAddress.test(address.value))
      errorMsgAddress.innerHTML = "";
    else {
      errorMsgAddress.innerHTML = "Votre adresse est invalide"
    }
  });
  city.addEventListener("change", (event) => {
    event.preventDefault();
    if (regNameCity.test(city.value))
      errorMsgCity.innerHTML = "";
    else {
      errorMsgCity.innerHTML = "Votre ville est invalide"
    }
  });
  email.addEventListener("change", (event) => {
    event.preventDefault();
    if (regEmail.test(email.value))
      errorMsgEmail.innerHTML = "";
    else {
      errorMsgEmail.innerHTML = "Votre adresse email est invalide"
    }
  });
};
validForm();

// function pour l'ecoute sur le click du bouton commander
function buttonAddForm() {
  const buttonComfirm = document.getElementById("order");
  buttonComfirm.addEventListener("click", (event) => {
    event.preventDefault();
    // Création d'un tableau vide pour récupéré l'id du produit avec une boucle
    const products = [];
    for (let i = 0; i < cart.length; i++) {
      products.push(cart[i].id);
    };
    // Création d'un tableau pour les information du formulaire
    const contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value
    };
    // création d'un tableau pour inséré le tableau id et contact
    const send = {
      products, contact
    }
    // si le formulaire est pas correctement remplis il y a un message d'erreur
    // sinon appel de la fonction postFetch()
    if (
      !regNameCity.test(firstName.value)
      || !regNameCity.test(lastName.value)
      || !regAddress.test(address.value)
      || !regNameCity.test(city.value)
      || !regEmail.test(email.value)) {
      alert("le formulaire est incomplet");
    } else {
      postFetch(send);
    };
  });
};
buttonAddForm();

// function pour la methode POST fetch 
// suppression du localStorage
// promesse qui renvoie sur la page confirmation 
function postFetch(send) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(send),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
    .then((res) => res.json())
    .then((promise) => {
      localStorage.clear();
      window.location.href = `confirmation.html?orderId=${promise.orderId}`;
    })
    .catch((error) => {
      console.log("fetch error", error)
    });
};



