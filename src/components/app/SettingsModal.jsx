import Settings from "../Settings";

const SettingsModal = ({ settingsOpen, language, setLanguage, translations, toggleSettings, handleLogout }) => {
    if (!settingsOpen) {
        return null;
    }

    const t = translations[language];

    return (
        <div className="fixed inset-0 bg-[rgba(6,5,12,0.8)] backdrop-blur-md z-50 flex items-end sm:items-center justify-center sm:p-4">
            <div className="modal-panel w-full sm:max-w-md p-6 app-fade-up">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold text-[var(--text-main)]">{t.settings}</h2>
                    <button
                        onClick={toggleSettings}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[rgba(139,92,246,0.08)] border border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
