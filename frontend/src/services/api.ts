import axios from "axios";

// Verifique se o seu Gateway realmente está na 8080
const api = axios.create({
    baseURL: "http://localhost:8080/api", // O Gateway agora vai tratar o /api/sales
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;