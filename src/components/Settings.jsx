const Settings = ({ language, setLanguage, translations }) => {
    return (
        <div className="surface-panel rounded-xl p-4 space-y-4 text-white">
            <h2 className="text-lg font-bold">{translations[language].settings}</h2>

            <div className="flex items-center justify-between gap-4">
                <span className="text-slate-200">{translations[language].languageSelect}</span>
                <select
                    className="input-elevated !w-auto !py-2 !px-3"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;
