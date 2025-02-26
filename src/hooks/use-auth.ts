import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setUser } from "../state/slices/authSlice";
import { setSelectedEmpresa } from "../state/slices/empresaSlice"; // Importa la acción para setear la empresa
import { DateTime } from "luxon";

interface DecodedToken {
    exp: number;
    id?: number;
    name?: string;
    lastname?: string;
    email?: string;
    systemRole?: string;
    empresas?: [];
}

const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const selectedEmpresa = localStorage.getItem('selectedEmpresa');

        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            const currentTime = DateTime.now().toSeconds();

            // Verifica si el token ha expirado
            if ((decodedToken.exp as number) < currentTime) {
                dispatch(logout());
                navigate("/auth/login");
            } else {
                // Llena el estado de Redux con la información del usuario
                dispatch(
                    setUser({
                        id: decodedToken.id || 0,
                        email: decodedToken.email || "",
                        name: decodedToken.name || "",
                        lastname: decodedToken.lastname || "",
                        systemRole: decodedToken.systemRole || "",
                        empresas: decodedToken.empresas || [],
                    })
                );

                // Si hay una empresa seleccionada, llénala en el estado de Redux
                if (selectedEmpresa) {
                    const empresa = JSON.parse(selectedEmpresa);
                    dispatch(setSelectedEmpresa(empresa));
                }
            }
        } else {
            // Si no hay token, redirige al login
            navigate("/auth/login");
        }

        setLoading(false);
    }, [dispatch, navigate]);

    return loading;
};

export default useAuth;