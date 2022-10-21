// Récupération de orderId avec searchParams
// Récupération de l'élément orderId
// affichage de orderId sur la page
const orderId = new URL(window.location.href).searchParams.get("orderId");
const order = document.getElementById("orderId")
order.innerText = orderId;

