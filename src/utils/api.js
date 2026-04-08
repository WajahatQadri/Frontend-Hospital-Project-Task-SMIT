import axios from "axios";

const api = axios.create({
    baseURL: "https://backend-hospital-project-task-smit.vercel.app/api/v1",
    withCredentials : true
});

export default api;