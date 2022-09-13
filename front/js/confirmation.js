/*
  * Get the confirmation id from the url
*/
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

/*
  * Displays the confirmation id on the page
*/
function showOrderId() {
  const idContainer = document.getElementById("orderId");
  idContainer.innerText = id;
}

showOrderId();
