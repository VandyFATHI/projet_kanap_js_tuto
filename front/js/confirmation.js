const orderId = new URL(window.location).searchParams.get("orderId");

let orderIdHtmlElement = document.getElementById("orderId");
orderIdHtmlElement.textContent = orderId;