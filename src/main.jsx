import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add dark mode class to HTML root on load
document.documentElement.classList.add('dark');

// Hata yakalama için
const renderApp = () => {
    try {
        console.log("App render başlıyor...");
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
        console.log("App render tamamlandı");
    } catch (error) {
        console.error("App render hatası:", error);
        // Hata durumunda basit bir UI göster
        document.getElementById('root').innerHTML = `
      <div style="padding: 20px; text-align: center; background-color: #1f2937; color: white;">
        <h2>Bir hata oluştu</h2>
        <p>${error.message}</p>
        <button style="background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;" onclick="location.reload()">Yeniden Dene</button>
      </div>
    `;
    }
};

renderApp();