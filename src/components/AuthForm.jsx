import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    console.log("AuthForm render ediliyor");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                console.log("Kayıt yapılıyor:", email);
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                console.log("Giriş yapılıyor:", email);
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            console.error("Auth hatası:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold text-center mb-4">
                {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">E-posta</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded"
                    disabled={loading}
                >
                    {loading ? (
                        "İşleniyor..."
                    ) : isRegistering ? (
                        "Kayıt Ol"
                    ) : (
                        "Giriş Yap"
                    )}
                </button>
            </form>

            <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full mt-4 p-2 bg-gray-700 rounded"
            >
                {isRegistering
                    ? "Zaten hesabın var mı? Giriş yap"
                    : "Hesabın yok mu? Kayıt ol"}
            </button>
        </div>
    );
};

export default AuthForm;