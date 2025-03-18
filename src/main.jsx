import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
      <div style="padding: 20px; text-align: center;">
        <h2>Bir hata oluştu</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">Yeniden Dene</button>
      </div>
    `;
    }
};

renderApp();