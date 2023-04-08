//import * from './product';

async function getProducts() {
  // creation de la variable qui va stocker les données
  // API for get requests
  let fetchRes = fetch("http://localhost:3000/api/products/");
  // fetchRes is the promise to resolve
  // on stocke les données en json dans data
  const data = await (await fetchRes).json();
  // on attribue le parametre a la fonction renderProducts
  console.log(data);

  let htmlProduct = document.getElementById("items");

  // on boucle pour chaque element i du tableau

  for (let i = 0; i < data.length; i++) {
    // product.html est la page suivante, elle doit savoir quel id trouver
    const html = `<a href="./product.html?id=${data[i]._id}">
            <article>
              <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
              <h3 class="productName">${data[i].name}</h3>
              <p class="productDescription">${data[i].description}</p>
            </article>
          </a>`;

    // ajout de l'html stocké au elements html deja présent
    htmlProduct.innerHTML += html;
  }
}

// initialisation de ma fonction
getProducts();
