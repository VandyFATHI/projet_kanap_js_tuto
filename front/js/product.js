// constante qui va récuperer l'adresse affichée
const location = window.location;
console.log("location", location);
// constante qui va afficher une nouvelle URL "copiée"
const url = new URL(location);
console.log("url", url);
// constante qui va afficher l'id du produit
const id = url.searchParams.get("id");
console.log("id", id);

let itemImage = document.getElementsByClassName("item__img")[0];
// obligation de mettre le 0 pour pouvoir accéder aux données de la class
console.log("itemImage", itemImage);

let price = document.getElementById("price");
console.log("price", price);

let title = document.getElementById("title");
console.log("name", title);

let description = document.getElementById("description");

let colors = document.getElementById("colors"); // l'id quantity dans le DOM (l'input)
let quantity = document.getElementById("quantity");
let selectedColor = document.getElementById("selectedColor");
const btnAddToCart = document.getElementById("addToCart");
const quantityNb = /^[1-9]$|^[1-9][0-9]$|^100$/;

// async function getProducts() {
//   // creation de la variable qui va stocker les données
//   // API for get requests
//   let fetchRes = fetch("http://localhost:3000/api/products/");
//   // fetchRes is the promise to resolve
//   // on stocke les données en json dans data
//   const data = await (await fetchRes).json();
//   // on attribue le parametre a la fonction renderProducts
//   console.log(data);
//   data = dataFetched;
//   return dataFetched;
// }

const getProductsById = () => {
  // on cherche dans les données le produit avec le bon id
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    // si on récupére des données
    .then((data) => {
      console.log(data);
      // création de la balise img dans le DOM
      let image = document.createElement("img");
      // attribution du src et du alt à l'image
      image.alt = data.altTxt;
      image.src = data.imageUrl;
      // création de l'enfant dans la div
      itemImage.appendChild(image);

      // on peut afficher le prix avec appendChild ou aussi innerText
      price.appendChild(document.createTextNode(data.price));

      // on peut afficher le nom du produit avec appendChild
      title.appendChild(document.createTextNode(data.name));

      // on affiche la description avec appendChild
      description.appendChild(document.createTextNode(data.description));

      // pour chaque couleur dans la data
      let i = 0;
      for (i = 0; i < data.colors.length; i++) {
        // pour chaque element i on crée option dans le DOM
        var option = document.createElement("option");
        option.text = data.colors[i];
        option.value = option.text;
        colors.appendChild(option);
      }

      colors.addEventListener("change", (e) => {
        let dataColors = data.colors;

        console.log(dataColors);
        const searchColor = e.target.value;
        //console.log("searchColor", searchColor);

        let colorValue = [searchColor];

        // btnAddToCart.addEventListener("click", function () {
        //   let colorSelected = [[]];
        //   // let index = quantitySelected.splice(0, 1);
        //   for (let i = 0; i < dataColors.length; i++) {
        //     if (dataColors[i] !== searchColor) return;
        //     else if (dataColors[i] === searchColor)
        //       console.log("dataColors[i]", dataColors[i]);
        //     colorSelected.push(dataColors[i]);
        //     // quantitySelected[0];
        //     console.log("colorSelected", colorSelected);
        //     // console.log("colorValue[i]", dataColors[i]);
        //   }
        // });
      });

      // let colorSelected = [];
      // let quantitySelected = [];
      let quantityToCart = [];

      quantity.addEventListener("input", (e) => {
        const searchQuantity = e.target.value;
        //console.log("searchQuantity", searchQuantity);
        let quantitySelected = [];

        // condition, si la valeur est vide ou que la quantité est plus petite que zéro, on stop la fonction
        if (
          quantity.value.trim() == "" ||
          quantityNb.test(quantity.value) <= 0
        ) {
          return;
        } else if (quantityNb.test(quantity.value) >= 0) {
          // on va chercher les valeurs affichées dans l'input graca à 'input'
          quantitySelected.push(quantity.value);
          // console.log("quantitySelected", quantitySelected);
        }

        // condition, si la valeur est vide ou que la quantité est plus petite que zéro, on stop la fonction
        // if (quantity.value.trim() == "" || quantityNb.test(quantity.value) <= 0) {
        //   return;

        //   // sinon on récupère la valeur
        // } else if (quantityNb.test(quantity.value) >= 0) {
        //   quantity.addEventListener("input", (e) => {});
        //   // on va chercher les valeurs affichées dans l'input graca à 'input'
        //   quantitySelected.push(quantity.value);
        //   console.log("quantitySelected", quantitySelected);
        // }

        let quantityValue = [quantity.value];

        // // quantityValue.splice(0, 1);
        // console.log("quantityValue", quantityValue);
        // for (let i = 0; i < quantityValue.length; i++) {
        //   let index = quantityValue.indexOf([i]);
        //   quantitySelected.push([index]);
        //   console.log("quantitySelected", quantitySelected);
        // }
      });

      btnAddToCart.addEventListener("click", function () {
        // Recuperation des caracteristiques de l'article
        let selectedQuantity = quantity.value;
        let selectedColor = colors.value;
        let newArticle = {
          id: id,
          quantite: selectedQuantity,
          color: selectedColor,
        };
        let panier = [];

        // Verifier que la couleur et la quantite soit choisis (sinon on peut pas ajouter l'article)
        if (quantityNb.test(quantity.value) && selectedColor) {
          // On peut ajouter donc ajouter l'article au localStorage
          let localStoragePanier = localStorage.getItem("panier");
          if (!localStoragePanier) {
            panier.push(newArticle);
            // localStorage.setItem(key, value);
            localStorage.setItem("panier", JSON.stringify(panier));
          } else {
            // L'element est deja stocke dans le localstorage
            // on identifie un article par son id et sa couleur (deux objets de couleurs differentes seront considere comme deux articles differents)
            panier = JSON.parse(localStoragePanier);

            let indexOfArticle = panier.findIndex((localStorageArticle) => {
              if (
                localStorageArticle.id === id &&
                localStorageArticle.color === selectedColor
              ) {
                return localStorageArticle;
              }
            });

            // le panier contient deja l'article
            if (indexOfArticle != -1) {
              // Modifier la quantite
              panier[indexOfArticle].quantite =
                parseInt(panier[indexOfArticle].quantite) +
                parseInt(selectedQuantity);
              // ajouter dans le local storage
              localStorage.setItem("panier", JSON.stringify(panier));

              // ajouter dans panier sans creer de duplicata
            } else {
              // c'est un nouveau article
              panier.push(newArticle);
              localStorage.setItem("panier", JSON.stringify(panier));
            }
          }
        } else {
          alert(
            "Veuillez selectionner une quantite entre 1-100 et une couleur SVP"
          );
        }

        // le cas echeant, ajouter un nouvelle element dans le localStorage
      });
    });
};

// la fonction qui va récuperer la valeur dans l'input quantity
function getValueOfQuantity() {
  // l'id quantity dans le DOM (l'input)
  let quantity = document.getElementById("quantity");

  // la regex
  const quantityNb = /^[0-9]$|^[1-9][0-9]$|^(100)$/;

  // condition, si la valeur est vide ou que la quantité est plus petite que zéro, on stop la fonction
  if (quantity.value.trim() == "" || quantityNb.test(quantity.value) <= 0) {
    return;

    // sinon on récupère la valeur
  } else if (quantityNb.test(quantity.value) >= 0) {
    // on va chercher les valeurs affichées dans l'input graca à 'input'
    quantity.addEventListener("input", getValueOfQuantity, false);
  }
  // return quantity;

  // console.log("valueQuantity", quantity.value);
}
// La fonction qui va récuperer la valeur dans le select
async function getValueOfColor() {
  let color = document.getElementById("colors");
  // on cherche dans les données le produit avec le bon id
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    // si on récupére des données
    .then(
      (data) => {
        color.addEventListener("change", getValueOfColor, false);

        let dataColors = data.colors;

        let isOk = true;

        console.log("data", data);

        let colorSelected = data.find((product) => product.colors === color);

        let i = 0;
        // for (i = 0; i < data.colors.length; i++) {
        if (dataColors[i] === color.value) isOk = true;
        else if (dataColors[i] !== color.value) isOk = false;
        console.log("isOk", isOk);
        console.log("Colorsdata", colorSelected);
        console.log("Colors", color.value);
        console.log("datalenght", data.colors);
        return;
        console.log("isOk", isOk);
        console.log("Colors", color.value);
        // console.log("getValueOfColor", color.value);
        // on va récuperer les valeurs à chaque changements d'évenement avec le "change"
        // }
        if (isOk == true) {
          console.log("TRUE");
        }
        console.log("getValueOfColor", color.value);

        // return getValueOfColor();
      }
      //  else
      //     // on va récuperer les valeurs à chaque changements d'évenement avec le "change"
      //     color.addEventListener("change", getValueOfColor, false);
      // // return color;
      // console.log("getValueOfColor", data.colors);
      // console.log("getValueOfColor", color.value);
    );
}

function addPanier() {
  //const btnAddToCart = document.getElementById("addToCart");
  //btnAddToCart.addEventListener("click", getValueOfQuantity, getValueOfColor());
}

function init() {
  // getProducts();
  // getValueOfQuantity();
  getProductsById();
  // getValueOfColor();
  // addPanier();
}

init();
