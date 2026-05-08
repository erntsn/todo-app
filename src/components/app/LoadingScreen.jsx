import AppBackground from "../AppBackground";

const LoadingScreen = ({ label }) => {
    return (
        <div className="app-shell h-[100dvh] w-screen flex items-center justify-center text-white">
            <AppBackground />
            <div className="relative z-10 glass-panel text-center p-10 min-w-[260px] app-fade-up">
                <div className="w-12 h-12 border-t-2 border-b-2 border-violet-400 rounded-full animate-spin mx-auto mb-5"></div>
                <p className="text-base text-[var(--text-main)] font-semibold">{label}</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
