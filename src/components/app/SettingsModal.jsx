import Settings from "../Settings";

const SettingsModal = ({ settingsOpen, language, setLanguage, translations, toggleSettings, handleLogout }) => {
    if (!settingsOpen) {
        return null;
    }

    const t = translations[language];

    return (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-6 app-fade-up">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t.settings}</h2>
                    <button onClick={toggleSettings} className="btn-ghost h-10 w-10 flex items-center justify-center !p-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <Settings language={language} setLanguage={setLanguage} translations={translations} />

                <button onClick={handleLogout} className="btn-danger w-full mt-6 p-3.5">
                    {t.logout}
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
