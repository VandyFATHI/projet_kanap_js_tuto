export function getProducts(dataFetched) {
  // creation de la variable qui va stocker les données
  // API for get requests
  let fetchRes = fetch("http://localhost:3000/api/products/");
  // fetchRes is the promise to resolve
  // on stocke les données en json dans data
  const data = await(fetchRes).json();
  // on attribue le parametre a la fonction renderProducts
  console.log(data);
  data = dataFetched;
  return dataFetched;
}
