const Settings = ({ language, setLanguage, translations }) => {
    return (
        <div className="rounded p-4 space-y-4 bg-gray-800 text-white">
            <h2 className="text-xl font-bold">{translations[language].settings}</h2>

            <div className="flex items-center justify-between">
                <span>{translations[language].languageSelect}</span>
                <select
                    className="px-3 py-1 rounded bg-gray-700 text-white"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="tr">🇹🇷 Türkçe</option>
                    <option value="en">🇺🇸 English</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;