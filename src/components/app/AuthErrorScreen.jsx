const AuthErrorScreen = ({ title, message, tryAgainLabel }) => {
    return (
        <div className="app-shell h-screen w-screen flex items-center justify-center text-white">
            <div className="app-backdrop">
                <span className="app-orb app-orb-a"></span>
                <span className="app-orb app-orb-b"></span>
            </div>
            <div className="relative z-10 glass-panel text-center p-8 max-w-md w-full mx-4 app-fade-up">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-300/35 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
                <p className="mb-5 text-slate-200">{message}</p>
                <button onClick={() => window.location.reload()} className="btn-primary px-4 py-2.5">
                    {tryAgainLabel}
                </button>
            </div>
        </div>
    );
};

export default AuthErrorScreen;
