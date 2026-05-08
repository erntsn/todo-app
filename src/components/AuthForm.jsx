import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig";

const googleProvider = new GoogleAuthProvider();

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

    const handleGoogle = async () => {
        setError("");
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            if (err.code !== "auth/popup-closed-by-user") {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-shell p-8">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-1">Task Flow</p>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">
                    {isRegistering ? "Hesap Oluştur" : "Hoş Geldin"}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {isRegistering ? "Görevlerini takip etmeye başla" : "Giriş yap ve devam et"}
                </p>
            </div>

            {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">
                    {error}
                </div>
            )}

            {/* Google Sign-In */}
            <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[var(--border-soft)] bg-white/5 hover:bg-white/10 hover:border-[var(--border)] text-[var(--text-main)] font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-5"
            >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google ile Giriş Yap
            </button>

            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[var(--border-soft)]"></div>
                <span className="text-xs text-[var(--text-muted)]">veya e-posta ile</span>
                <div className="flex-1 h-px bg-[var(--border-soft)]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">
                        E-posta
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-elevated"
                        placeholder="ornek@mail.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-[var(--text-secondary)]">
                        Şifre
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-elevated"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full py-3 text-[0.95rem] mt-2"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            İşleniyor...
                        </span>
                    ) : isRegistering ? "Kayıt Ol" : "Giriş Yap"}
                </button>
            </form>

            <button
                onClick={() => { setIsRegistering(!isRegistering); setError(""); }}
                className="btn-ghost w-full py-3 text-sm"
            >
                {isRegistering
                    ? "Zaten hesabın var mı? Giriş yap"
                    : "Hesabın yok mu? Kayıt ol"}
            </button>
        </div>
    );
};

export default AuthForm;
