import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
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
        <div className="auth-shell p-7 text-white">
            <div className="mb-6 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400 mb-2">Task Flow</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-amber-200 text-transparent bg-clip-text">
                    {isRegistering ? "Kayıt Ol" : "Giriş Yap"}
                </h2>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-900/45 border border-red-300/30 text-red-100 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-200">E-posta</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-elevated"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-slate-200">Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-elevated"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary w-full p-3" disabled={loading}>
                    {loading ? "İşleniyor..." : isRegistering ? "Kayıt Ol" : "Giriş Yap"}
                </button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)} className="btn-ghost w-full mt-4 p-3">
                {isRegistering ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol"}
            </button>
        </div>
    );
};

export default AuthForm;
