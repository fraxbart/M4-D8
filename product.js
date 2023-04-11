const imageDiv = document.getElementById("product-img");
const productSpecificationsDiv = document.getElementById("product-specifications");
const titleEl = document.getElementById("title");
const setProduct = (product) => {
    console.log(product)
    const imageEl = document.createElement("img");
    imageEl.style.maxHeight = "100%"
    imageEl.className = "img-fluid";
    imageEl.src = product.imageUrl;
    imageDiv.innerHTML = "";
    imageDiv.appendChild(imageEl);
    productSpecificationsDiv.innerHTML = `  <p>Description: ${product.description}</p>
                                            <p>Brand: ${product.brand}</p>
                                           <p>Price: ${product.price}</p>
                                           <p>Created at: ${product.createdAt}</p>
                                           <p>Updated at: ${product.updatedAt}</p>
                                           <p>User id: ${product.userId}</p>`                           
}
window.onload =  () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    login()
        .then(response => fetchApi(baseUrl + id, "GET", {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }))
        .then(product => {
            titleEl.innerText = product.name;
            setProduct(product);
        })
}