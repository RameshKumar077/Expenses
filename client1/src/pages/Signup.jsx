// 





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// ...existing code...
function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        try {
            await API.post("/auth/signup", payload);
            const { data } = await API.post('/auth/login', {
                email: payload.email,
                password: payload.password
            });
            if (data?.token) {
                localStorage.setItem('token', data.token);
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
                window.dispatchEvent(new Event('user-logged-in'));
                if (data.user && data.user._id) {
                    navigate(`/dashboard/${data.user._id}`);
                } else {
                    navigate('/dashboard/unknown');
                }
                return;
            }
            setErrorMsg("Account created successfully ✔ Please login.");
            navigate("/login");
        } catch (err) {
            console.log("Signup error:", err);
            setErrorMsg("Signup failed, maybe email already used!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1e293b] p-2">
            <form onSubmit={handleSignup} className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Create Account</h2>

                {errorMsg && (
                    <div className="mb-4 text-center text-red-400 font-semibold bg-red-100/10 p-2 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <input
                    name="name"
                    placeholder="Your Name"
                    className="border p-2 w-full mb-3 rounded-lg text-sm"
                    required
                    disabled={loading}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3 rounded-lg text-sm"
                    required
                    disabled={loading}
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="border p-2 w-full mb-4 rounded-lg text-sm"
                    required
                    disabled={loading}
                />

                <button type="submit" className="bg-black text-white p-2 w-full rounded-lg flex items-center justify-center" disabled={loading}>
                    {loading ? (
                        <span className="loader mr-2 inline-block w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></span>
                    ) : null}
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </form>
            {/* Simple loader spinner style */}
            <style>{`
                .loader {
                    border-top-color: #38bdf8;
                    border-right-color: #38bdf8;
                    border-bottom-color: #fff;
                    border-left-color: #fff;
                }
            `}</style>
        </div>
    );
}
// ...existing code...
export default Signup;