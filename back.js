let products = [];
const tableDiv = document.getElementById("product-table");
const newProductDiv = document.getElementById("new-product");
const addButton = newProductDiv.querySelector("button");
const editModal = document.getElementById("addEditModal");
const editModalObj = new bootstrap.Modal(editModal);
const deleteModal = document.getElementById("deleteModal");
const deleteModalObj = new bootstrap.Modal(deleteModal);
const modalForm = editModal.querySelector("form");
const keys = {
    name: "string",
    description: "string",
    brand: "string",
    imageUrl: "string",
    price: "number"
}
const saveAddEditButton = editModal.querySelector(".btn-primary");
const deleteButton = deleteModal.querySelector(".btn-primary");
let editProduct = null;
let deleteProduct = null;

editModal.addEventListener("hidden.bs.modal", () => {
    const alerts = document.getElementsByClassName("alert");
    while (alerts.length > 0) {
        alerts[0].remove();
    }
    modalForm.reset();
})

saveAddEditButton.addEventListener("click", () => handleSave(editProduct));

deleteButton.addEventListener("click", () => {handleDelete(deleteProduct)});


const createProductRow = (product) => {
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    const tdDescription = document.createElement("td");
    const tdBrand = document.createElement("td");
    const tdImg = document.createElement("td");
    const tdPrice = document.createElement("td");
    const tdActions = document.createElement("td");
    tdName.innerText = product.name;
    tdDescription.innerText = product.description;
    tdBrand.innerText = product.brand;
    tdImg.innerHTML = `<img src="${product.imageUrl}" alt="Product image">`
    tdPrice.innerText = product.price;
    const editButton = document.createElement("button");
    editButton.className = "btn-trasparent mx-2";
    editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
    editButton.addEventListener("click", () => {
        editProduct = product;
        handleClickModal()
    });
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#addEditModal");
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-trasparent mx-2"
    deleteButton.innerHTML = `<i class="bi bi-trash3"></i>`
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#deleteModal");
    deleteButton.addEventListener("click", () => {
        deleteProduct = product;
        handleDeleteModal();
    });
    tdActions.append(editButton, deleteButton);
    tr.append(tdName, tdDescription, tdBrand, tdImg, tdPrice, tdActions)
    return tr;
}

const createAlert = (text) => {
    const fixedDistance = 20;
    let startPoint = fixedDistance;
    const alerts = document.getElementsByClassName("alert");
    if (alerts.length > 0){
        startPoint += alerts[alerts.length -1].offsetHeight + alerts[alerts.length -1].offsetTop;
    }
    const alertDiv = document.createElement("div");
    alertDiv.style.width = "20%"
    alertDiv.style.position = "absolute"
    alertDiv.style.top = `${startPoint}px`
    alertDiv.style.left = "75%"
    alertDiv.className = "alert alert-danger alert-dismissible fade show";
    alertDiv.role = "alert";
    alertDiv.innerHTML =`${text} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`
    const bsAlert =  new bootstrap.Alert(alertDiv);
    let timeOutActive = true;
    const timeOut = setTimeout(() => {
        bsAlert.close();
        timeOutActive = false;
    }, 5000);
    alertDiv.addEventListener("close.bs.alert", (event)=> {
        if (timeOutActive) {
            clearTimeout(timeOut);
        }
        const alerts = document.getElementsByClassName("alert");
        for (let alert of alerts) {
            if (alert.offsetTop > event.target.offsetTop) {
                alert.style.top = `${alert.offsetTop - event.target.offsetHeight - fixedDistance}px`;
            }
        }
    })
    return alertDiv;
}

const validateForm = () => {
    let errors = [];
    Object.keys(keys).forEach(key => {
        console.log(key, !modalForm.elements[key].value)
        if(keys[key] === "string" && modalForm.elements[key].value.length === 0) {
            errors.push(`${key.replace(key[0], key[0].toUpperCase())} field is required`);
        } else if (keys[key] === "number" && (parseFloat(modalForm.elements[key].value) <= 0 || !modalForm.elements[key].value)) {
            
            errors.push(`${key.replace(key[0], key[0].toUpperCase())} field is required and must be higher than 0`);
        } 
    })
    if (errors.length > 0) {
        errors.forEach(error => {
            editModal.appendChild(createAlert(error));
        })
        return false;
    } else {
        return true;
    }
}


const handleDeleteModal = () => {
    deleteModal.querySelector("h1").innerText = `Confirm to delete product ${deleteProduct._id}?`    

}

const handleDelete = async (product) => {
    try {
        let response = await fetchApi(baseUrl + product._id, "DELETE", {
            "Authorization": `Bearer ${token}`
        });
        console.log(response);
        const index = products.indexOf(product);
        products.splice(index, 1);
        deleteProduct = null;
        window.location.reload();
        deleteModalObj.hide();
    } catch(error) {
        console.log(error)
    }
}

const createProductsTable = () => {
    const table = document.createElement("table");
    table.className = "table"
    const thead = document.createElement("thead");
    thead.innerHTML = `<th scope="col">Nome</th><th scope="col">Descrizione</th>
                        <th scope="col">Brand</th><th scope="col">Immagine</th>
                        <th scope="col">Prezzo</th><th scope="col">Azioni</th>`
    const tbody = document.createElement("tbody");
    tbody.append(...products.map(product => createProductRow(product)));
    table.append(thead, tbody);
    return table;
}


const handleSave = async (product = null) => {
    if (validateForm()) {
        const payload = {};
        Object.keys(keys).forEach(key => payload[key] = modalForm.elements[key].value)
        const method = !product ? "POST" : "PUT";
        const url = !product ? baseUrl : baseUrl + product._id;
        try {
            let response = await fetchApi(url, method, {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }, payload)
            if (!product) {
                products.push(response);
            } else {
                products[products.indexOf(product)] = response;
            }
            modalForm.reset();
            editModalObj.hide();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
}
const handleClickModal = () => {
    const title = !editProduct ? "Aggiungi prodotto" : `Modifica ${editProduct._id}`
    editModal.querySelector("h1").innerText = title;
    if (editProduct) {
        Object.keys(keys).forEach(key => modalForm.elements[key].value = editProduct[key]);
    }
}

addButton.addEventListener("click", () => {
    editProduct = null;
    handleClickModal();
})


const addTableSection = () => {
    if (products.length === 0) {
        tableDiv.innerHTML = `<h3 class="text-center">Non ci sono prodotti al momento, aggiungine uno</h3>`
    } else {
        tableDiv.innerHTML = "";
        tableDiv.appendChild(createProductsTable());
    }
}

window.onload = () => {
    tableDiv.innerHTML = "";
    loadingSpinner = createSpinner();
    tableDiv.appendChild(loadingSpinner)
    login()
        .then(response => fetchApi(baseUrl, "GET", {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }))
        .then(response => {
            products = response;
            console.log(products);
            loadingSpinner.remove();
            addTableSection();
            newProductDiv.classList.remove("d-none");
        });

}