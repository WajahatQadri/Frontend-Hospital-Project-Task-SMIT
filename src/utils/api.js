import axios from "axios";

const api = axios.create({
    baseURL: window.location.hostname === "localhost" 
    ? "http://localhost:5000/api/v1"  // Your local port
    : "/api/v1",
    withCredentials : true,
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});


export default api;