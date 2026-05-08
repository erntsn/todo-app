const LoadingScreen = ({ label }) => {
    return (
        <div className="app-shell h-screen w-screen flex items-center justify-center text-white">
            <div className="app-backdrop">
                <span className="app-orb app-orb-a"></span>
                <span className="app-orb app-orb-b"></span>
                <span className="app-orb app-orb-c"></span>
            </div>
            <div className="relative z-10 glass-panel text-center p-8 min-w-[280px] app-fade-up">
                <div className="w-16 h-16 border-t-4 border-b-4 border-sky-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xl text-white font-semibold">{label}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
