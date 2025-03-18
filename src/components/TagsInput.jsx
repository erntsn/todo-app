import React, { useState } from 'react';

const TagsInput = ({ tags, onChange, language, darkMode }) => {
    const [inputValue, setInputValue] = useState('');

    const translations = {
        tr: {
            addTag: 'Etiket ekle',
            pressEnter: 'Eklemek için Enter\'a basın',
            example: 'örn. iş, ev, acil',
        },
        en: {
            addTag: 'Add tag',
            pressEnter: 'Press Enter to add',
            example: 'e.g. work, home, urgent',
        }
    };

    const t = translations[language];

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            // Prevent duplicate tags
            if (!tags.includes(inputValue.trim().toLowerCase())) {
                onChange([...tags, inputValue.trim().toLowerCase()]);
            }
            setInputValue('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                    <div
                        key={tag}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            darkMode
                                ? 'bg-gray-700 text-white'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                        <span>#{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-600 hover:text-white"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t.addTag}
                    className={`w-full px-3 py-2 rounded ${
                        darkMode
                            ? 'bg-gray-700 text-white placeholder-gray-400'
                            : 'bg-white text-gray-900 placeholder-gray-500'
                    }`}
                />
                <div className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    {t.pressEnter}
                </div>
            </div>

            <p className={`mt-1 text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
                {t.example}
            </p>
        </div>
    );
};

export default TagsInput;