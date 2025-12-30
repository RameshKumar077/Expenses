import React from "react";
import { useState } from "react";
import API from "../services/api";

export default function AddTransactionModal({ onClose, onAdded }) {
    const [form, setForm] = useState({ title: "", amount: "", type: "expense", date: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const { data } = await API.post("/expenses", {
                title: form.title,
                amount: Number(form.amount),
                type: form.type,
                date: form.date
            });

            // use server response if available, otherwise fall back to constructed object
            const created = data || {
                _id: Date.now().toString(),
                title: form.title,
                amount: Number(form.amount),
                type: form.type,
                date: form.date
            };
            onAdded(created); // 👈 send item back to Dashboard

            onClose();
        } catch (err) {
            console.log("Signup/Expense add error:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-2">
            <div className="bg-[#1E293B] rounded-2xl p-4 sm:p-5 w-full max-w-xs shadow-xl">
                <h2 className="text-lg sm:text-xl font-bold mb-3 text-center">Add Transaction</h2>


                <input
                    onChange={handleChange}
                    name="title"
                    placeholder="Title (Cinema)"
                    className="w-full p-2 rounded bg-gray-800 mb-2 text-sm"
                    type="text"
                    value={form.title}
                    required
                />
                <input
                    onChange={handleChange}
                    name="amount"
                    placeholder="Amount"
                    className="w-full p-2 rounded bg-gray-800 mb-2 text-sm"
                    type="number"
                    value={form.amount}
                    min="0.01"
                    step="0.01"
                    required
                />
                <input onChange={handleChange} name="date" type="date" className="w-full p-2 rounded bg-gray-800 mb-3 text-sm" value={form.date} required />

                <select onChange={handleChange} name="type" className="w-full p-2 rounded bg-gray-800 mb-3 text-sm">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={onClose} className="flex-1 bg-red-600 rounded-xl p-2 text-sm">Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 bg-green-600 rounded-xl p-2 text-sm">Add</button>
                </div>
            </div>
        </div>
    );
}
