
import useAuth from "./hooks/use-auth";
import { AppRouter } from "./routes/AppRouter";

const AuthWrapper = () => {
    const loading = useAuth(); // Usa el hook useAuth

    // Muestra un loader mientras se verifica la autenticación
    if (loading) {
        return <div>Loading...</div>;
    }

    // Renderiza el AppRouter una vez que la autenticación está lista
    return <AppRouter />;
};

export default AuthWrapper;