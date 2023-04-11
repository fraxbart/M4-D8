let products = [];

const productsDiv = document.getElementById("products");
const body = document.querySelector("body");


const createCard = (product) => {
    const colDiv = document.createElement("div");
    const cardDiv = document.createElement("div");
    const cardBody = document.createElement("div");
    const aProduct = document.createElement("a");
    aProduct.href = "./product.html?id=" + product._id;
    const img = document.createElement("img");
    aProduct.appendChild(img);
    cardBody.className = "card-body"
    cardDiv.className = "card mb-4 p-0 bg-body-tertiary";
    colDiv.className = "col-6 col-md-3 position-relative";
    img.src = product.imageUrl;
    img.className = "card-img-top";
    const h6 = document.createElement("h6");
    h6.className = "card-title text-truncate"
    h6.innerText = product.name;
    const p = document.createElement("p");
    p.innerHTML =  `<span>Description: ${product.description}</span><br>
    <span>Price: ${product.price}€</span>`
    cardBody.append(h6, p);
    cardDiv.append(aProduct, cardBody);
    colDiv.appendChild(cardDiv);
    return colDiv;
}

window.onload = () => {
    loadingSpinner = createSpinner();
    body.appendChild(loadingSpinner)
    login()
        .then(response => fetchApi(baseUrl, "GET", {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }))
        .then(response => {
            products = response;
            loadingSpinner.remove();
            productsDiv.innerHTML = "";
            let div = document.createElement("div");
            div.className = "row";
            div.append(...products.map(product => createCard(product)));
            productsDiv.appendChild(div);

        });

}