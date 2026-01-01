import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:5000/api/v1"

    // baseURL:"https://expenses-ten-phi.vercel.app/api/v1"
});


API.interceptors.request.use(req => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = token;
    return req;
});

export default API;
