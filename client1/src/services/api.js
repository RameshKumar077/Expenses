import axios from "axios";
const API = axios.create({
    baseURL: "https://expenses-ten-phi.vercel.app/api/v1",
});


API.interceptors.request.use(req => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = token;
    return req;
});

export default API;
