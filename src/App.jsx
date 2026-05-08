import AuthForm from "./components/AuthForm";
import LoadingScreen from "./components/app/LoadingScreen";
import AuthErrorScreen from "./components/app/AuthErrorScreen";
import AuthenticatedApp from "./components/app/AuthenticatedApp";
import useTodoAppState from "./hooks/useTodoAppState";
import { translations, categoryStyles } from "./config/appConfig";

const App = () => {
    const state = useTodoAppState();
    const { user, loading, authError, language } = state;
    const t = translations[language] || translations.tr;

    if (loading) {
        return <LoadingScreen label={t.loading} />;
    }

    if (authError) {
        return (
            <AuthErrorScreen
                title={t.authError}
                message={authError.message}
                tryAgainLabel={t.tryAgain}
            />
        );
    }

    if (!user) {
        return (
            <div className="app-shell h-screen w-screen flex items-center justify-center text-white">
                <div className="app-backdrop">
                    <span className="app-orb app-orb-a"></span>
                    <span className="app-orb app-orb-b"></span>
                    <span className="app-orb app-orb-c"></span>
                </div>
                <div className="relative z-10 w-full flex items-center justify-center p-4 app-fade-up">
                    <AuthForm />
                </div>
            </div>
        );
    }

    return (
        <AuthenticatedApp
            state={state}
            translations={translations}
            categoryStyles={categoryStyles}
        />
    );
};

export default App;
