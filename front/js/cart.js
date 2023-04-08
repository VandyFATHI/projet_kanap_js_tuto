var panier = JSON.parse(localStorage.getItem("panier"));
const cartItems = document.getElementById("cart__items");
var articles = [];
var sumPrices = 0;
const quantityNb = /^[1-9]$|^[1-9][0-9]$|^100$/;
let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const regexName = /^([^0-9]*)$/;


function displayCart() {
    if (panier) {
        panier.forEach(async article => {
            await fetch(`http://localhost:3000/api/products/${article.id}`)
                .then((reponse) => reponse.json())
                .then((data) => {
                    if (!articles.includes(data)) { articles.push(data); }
                    let tagArticle = document.createElement("article");
                    tagArticle.className = "cart__item";
                    tagArticle.setAttribute("data-id", article.id);
                    tagArticle.setAttribute("data-color", article.color);

                    // image
                    let cart_item_img = document.createElement("div");
                    cart_item_img.className = "cart__item__img";

                    let img = document.createElement("img");
                    img.src = data.imageUrl;
                    img.alt = data.altTxt;

                    cart_item_img.appendChild(img);

                    // content
                    let content = document.createElement("div");
                    content.className = "cart__item__content";

                    // content description
                    let contentDescription = document.createElement("div");
                    contentDescription.className = "cart__item__content__description";
                    let name = document.createElement("h2");
                    name.textContent = data.name;
                    let color = document.createElement("p");
                    color.textContent = article.color;
                    let price = document.createElement("p");
                    price.textContent = data.price;

                    contentDescription.appendChild(name);
                    contentDescription.appendChild(color);
                    contentDescription.appendChild(price);


                    // settings quantity
                    let contentSettings = document.createElement("div");
                    contentSettings.className = "cart__item__content__settings";

                    let settingsQuantity = document.createElement("div");
                    settingsQuantity.className = "cart__item__content__settings__quantity";
                    let qte = document.createElement("p");
                    qte.textContent = "Qte : ";
                    let input = document.createElement("input");
                    input.type = "number";
                    input.className = "itemQuantity";
                    input.name = "itemQuantity";
                    input.min = "1";
                    input.max = "100";
                    input.value = article.quantite;
                    input.addEventListener("change", () => { UpdatePanier(input); });

                    settingsQuantity.appendChild(qte);
                    settingsQuantity.appendChild(input);

                    //settings delete
                    let settingsDelete = document.createElement("div");
                    settingsDelete.className = "cart__item__content__settings__delete";
                    let supprimer = document.createElement("p");
                    supprimer.className = "deleteItem";
                    supprimer.textContent = "Supprimer";
                    supprimer.addEventListener("click", () => { DeleteArticle(supprimer) });

                    settingsDelete.appendChild(supprimer);

                    contentSettings.appendChild(settingsQuantity);
                    contentSettings.appendChild(settingsDelete);

                    content.appendChild(contentDescription);
                    content.appendChild(contentSettings);


                    tagArticle.appendChild(cart_item_img);
                    tagArticle.appendChild(content);

                    cartItems.appendChild(tagArticle);

                })
                .then(() => {
                    SetTotalPrice();
                });
        });
    }
};

function CalculTotalPrice() {
    sumPrices = 0;

    panier.forEach(article => {
        let art = articles.find(a => { return a._id == article.id });
        // Je sais pas pourquoi art peut etre undefined ici
        if (art != undefined) {
            sumPrices = parseInt(sumPrices) +
                parseInt(article.quantite) * parseInt(art.price);
        }
    })
}


function SetTotalPrice() {

    CalculTotalPrice();
    //total price
    let total = document.getElementById("totalQuantity");
    total.textContent = panier.length.toString();

    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = sumPrices.toString();
};


function UpdatePanier(htmlElement) {
    if (quantityNb.test(htmlElement.value)) {
        //recuperer l'element html
        var tagArticle = htmlElement.closest(".cart__item");

        //mettre a jour le bon element du panier
        let articleIndex = panier.findIndex((localStorageArticle) => {
            if (localStorageArticle.id == tagArticle.getAttribute("data-id") &&
                localStorageArticle.color == tagArticle.getAttribute("data-color")) {
                return localStorageArticle;
            }
        });

        if (articleIndex != -1) {
            // mettre a jour l'article avec la nouvelle quantite
            panier[articleIndex].quantite = htmlElement.value;

            // mettre a jour le localStorage
            localStorage.setItem("panier", JSON.stringify(panier));

            SetTotalPrice();
        }
    } else {
        alert(
            "Veuillez selectionner une quantite entre 1-100 et une couleur SVP"
        );
    }
}

function DeleteArticle(htmlElement) {
    var tagArticle = htmlElement.closest(".cart__item");

    let newPanier = panier.filter(article => article.id != tagArticle.getAttribute("data-id")
        || article.color != tagArticle.getAttribute("data-color"));

    // mise a jour du panier dans le local storage
    localStorage.setItem("panier", JSON.stringify(newPanier));

    panier = JSON.parse(localStorage.getItem("panier"));

    // retirer l'element de la page
    tagArticle.remove();

    SetTotalPrice();
}

// Commander
let btnOrder = document.getElementById("order");
btnOrder.addEventListener("click", (e) => {
    e.preventDefault();
    validateOrder(e);
});

async function validateOrder(event) {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email");

    let firstNameError = document.getElementById("firstNameErrorMsg");
    let lastNameError = document.getElementById("lastNameErrorMsg");
    let error = document.getElementById("emailErrorMsg");

    if (!firstName
        || !lastName
        || !address
        || !city
        || !email) {
        alert("Please fill up all the fields");
    } else if (/\d/.test(firstName) || /\d/.test(lastName)) {
        firstName.style = "color: light-red";
        lastName.style = "color: light-red"
        firstNameError.textContent = "Please enter only text";
        lastNameError.textContent = "Please enter only text";

    } else if (regexEmail.test(email.value)) {
        firstNameError.textContent = "";
        lastNameError.textContent = "";
        var contact = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email.value
        }

        // Creer la liste d'Id products
        var products = panier.map(article => article.id);

        // Recuperation d'orderId avec la requete post
        let response = await fetch(`http://localhost:3000/api/products/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ contact, products })
        });

        // Formatter en JSON
        let result = await response.json();

        // Redirection vers la page confirmation en ajouter orderId dans l'url
        if (result.orderId != undefined && result.orderId != null) {
            window.location = './confirmation.html?orderId=' + result.orderId;
        }

    } else {
        // on retire le message d'erreur si il y en avait
        firstNameError.textContent = "";
        lastNameError.textContent = "";

        // Affichage du message d'erreur pour le mail
        error.style = "color: light-red"
        error.textContent = "Enter a valid email";
    }
}


function init() {
    displayCart();
}

init();
