import React, { useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../authService";

const translations = {
    tr: {
        login: "Giriş Yap",
        register: "Kayıt Ol",
        logout: "Çıkış Yap",
        noAccount: "Hesabın yok mu? Kayıt ol",
        haveAccount: "Zaten hesabın var mı? Giriş yap",
        settings: "Ayarlar",
        darkMode: "Karanlık Mod",
        darkModeOn: "Açık",
        darkModeOff: "Kapalı",
        languageSelect: "Dil Seçimi",
        successRegister: "Kayıt başarılı! Şimdi giriş yapabilirsiniz.",
        successLogin: "Giriş başarılı!",
        error: "Hata",
        errorMessage: "Email veya şifre yanlış. Lütfen tekrar deneyin.",
        ok: "Tamam"
    },
    en: {
        login: "Login",
        register: "Register",
        logout: "Logout",
        noAccount: "Don't have an account? Sign up",
        haveAccount: "Already have an account? Login",
        settings: "Settings",
        darkMode: "Dark Mode",
        darkModeOn: "On",
        darkModeOff: "Off",
        languageSelect: "Language Selection",
        successRegister: "Registration successful! You can now log in.",
        successLogin: "Login successful!",
        error: "Login Failed",
        errorMessage: "Your email or password is incorrect. Please try again.",
        ok: "OK"
    }
};

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "tr";
    });
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    const showPopup = (title, message) => {
        setPopup({ title, message });
    };

    return (
        <div className={`p-6 rounded-lg shadow-lg max-w-md w-full ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
            {popup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80 text-gray-900">
                        <h3 className="text-lg font-bold mb-2">{popup.title}</h3>
                        <p className="mb-4">{popup.message}</p>
                        <button
                            onClick={() => setPopup(null)}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                            {translations[language].ok}
                        </button>
                    </div>
                </div>
            )}
            <h2 className="text-xl font-bold mb-4 text-center">
                {isRegistering ? translations[language].register : translations[language].login}
            </h2>
            <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                    if (isRegistering) {
                        await registerUser(email, password);
                        showPopup(translations[language].successRegister, "");
                    } else {
                        await loginUser(email, password);
                        showPopup(translations[language].successLogin, "");
                    }
                } catch (error) {
                    showPopup(translations[language].error, translations[language].errorMessage);
                }
            }} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    {isRegistering ? translations[language].register : translations[language].login}
                </button>
            </form>
            <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="mt-4 w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition block text-center font-semibold"
            >
                {isRegistering ? translations[language].haveAccount : translations[language].noAccount}
            </button>
            <button
                onClick={() => {
                    logoutUser();
                    showPopup(translations[language].logout, "");
                }}
                className="mt-4 w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                {translations[language].logout}
            </button>
        </div>
    );
};

export default AuthForm;