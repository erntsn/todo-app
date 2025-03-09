const Settings = ({ darkMode, setDarkMode, language, setLanguage, translations }) => {
    return (
        <div className={`rounded p-4 space-y-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900'}`}>
            <h2 className="text-xl font-bold">{translations[language].settings}</h2>

            <div className="flex items-center justify-between">
                <span>{translations[language].darkMode}</span>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                >
                    {darkMode ? translations[language].darkModeOff : translations[language].darkModeOn}
                </button>
            </div>

            <div className="flex items-center justify-between">
                <span>{translations[language].languageSelect}</span>
                <select
                    className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-900 hover:bg-gray-500'}`}
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

