import React from 'react';

const CategorySelector = ({ category, onChange, language, darkMode }) => {
    const translations = {
        tr: {
            category: 'Kategori',
            categories: {
                work: 'İş',
                personal: 'Kişisel',
                health: 'Sağlık',
                shopping: 'Alışveriş',
                finance: 'Finans',
                education: 'Eğitim',
                other: 'Diğer'
            }
        },
        en: {
            category: 'Category',
            categories: {
                work: 'Work',
                personal: 'Personal',
                health: 'Health',
                shopping: 'Shopping',
                finance: 'Finance',
                education: 'Education',
                other: 'Other'
            }
        }
    };

    const t = translations[language];
    const categoryOptions = Object.keys(t.categories);

    // Category colors
    const categoryColors = {
        work: 'blue',
        personal: 'purple',
        health: 'green',
        shopping: 'pink',
        finance: 'yellow',
        education: 'indigo',
        other: 'gray'
    };

    return (
        <div className="w-full">
            <label className={`block mb-2 text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
                {t.category}
            </label>

            <div className="flex flex-wrap gap-2">
                {categoryOptions.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => onChange(cat)}
                        className={`px-3 py-1 rounded-full text-sm ${
                            category === cat
                                ? `bg-${categoryColors[cat]}-500 text-white`
                                : darkMode
                                    ? `bg-gray-700 text-gray-300 hover:bg-${categoryColors[cat]}-700`
                                    : `bg-${categoryColors[cat]}-100 text-${categoryColors[cat]}-800 hover:bg-${categoryColors[cat]}-200`
                        }`}
                    >
                        {t.categories[cat]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySelector;