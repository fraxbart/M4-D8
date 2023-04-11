let token = '';
const baseUrl = "https://striveschool-api.herokuapp.com/api/product/"

const fetchApi = async (url, method = "GET", headers = null, payload = null) => {
    try {
        let response = await fetch(url, {
            method: method,
            headers: headers,
            body: method === "GET" ? null : JSON.stringify(payload)
        })
        if (!response.ok) {
            let errorMessage =  response
            throw new Error(errorMessage);
        }
        return response.json();
    } catch (error) {
        throw new Error(error.message);
    };
}

const login = async (username, password) => {
    const credentials = {
        username: "francesco.bartt@gmail.com",
        password: "dione1990A!"
    }
    let response = await fetchApi("https://striveschool-api.herokuapp.com/api/account/login", "POST", { "Content-Type": "application/json"}, credentials)
    token = response.access_token;
}

const createSpinner = () => {
    const div = document.createElement("div");
    div.className = "d-flex justify-content-center spinner-container"
    div.innerHTML = `  <button class="btn btn-danger text-dark" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...
  </button>
  `;
    return div;
}

