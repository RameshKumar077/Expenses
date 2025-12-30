
import API from "../services/api";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            const { data } = await API.post("/auth/login", payload);

            // token save करो
            localStorage.setItem("token", data.token);
            // save user profile so navbar can show name immediately
            if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
            // Force custom event for Navbar update
            window.dispatchEvent(new Event("user-logged-in"));

            console.log("Token saved ✔", data.token);

            // dashboard पर redirect (with userId)
            if (data.user && data.user._id) {
                navigate(`/dashboard/${data.user._id}`);
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.log("Login error:", err);
            alert("Login failed, check credentials!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1e293b] p-2">
            <form onSubmit={handleLogin} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold mb-2 text-center text-white drop-shadow">Welcome Back</h2>
                <p className="text-gray-300 mb-6 text-center">Login to your account</p>

                <div className="mb-4">
                    <label className="block text-gray-200 text-sm mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className="border border-gray-600 bg-white/20 text-white placeholder-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-200 text-sm mb-1" htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="border border-gray-600 bg-white/20 text-white placeholder-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold py-2.5 w-full rounded-xl shadow-lg transition-all text-lg mb-3">
                    Login
                </button>

                <div className="text-center mt-2">
                    <span className="text-gray-300">Don't have an account? </span>
                    <a href="/signup" className="text-blue-400 hover:underline font-semibold">Sign up</a>
                </div>
            </form>
        </div>
    );
}
