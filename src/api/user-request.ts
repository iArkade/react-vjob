import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "./http";
import { UsersType, LoginRequestType, UsuarioResponseType, UsuarioRequestType } from "./user-types";

interface ApiError {
     response?: {
          data?: {
               message?: string;
          };
     };
}

const isApiError = (error: unknown): error is ApiError => {
     return typeof error === "object" && error !== null && "response" in error;
};

const handleError = (error: unknown): never => {
     if (isApiError(error) && error.response?.data?.message) {
          throw new Error(error.response.data.message);
     }
     throw error;
};

const getAuthToken = () => {
     return localStorage.getItem('token'); // Asegúrate de que el token se almacene en el localStorage al iniciar sesión
};

const registerUserRequest = (user: UsersType) =>
     http.post('auth/register', user);

const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('auth/login', credentials);

const logoutUserRequest = () => {
     const token = localStorage.getItem('token');

     return http.post(
          '/auth/logout',
          {},
          {
               headers: {
                    'Authorization': `Bearer ${token}`,  // Enviar el token en el header 
               },
          },
     );
};

export const useRegisterUser = () =>
     useMutation({
          mutationKey: ['RegisterUser'],
          mutationFn: registerUserRequest,
     });

export const useLoginUser = () =>
     useMutation({
          mutationKey: ['LoginUser'],
          mutationFn: loginUserRequest,
     });

export const useLogoutUser = () =>
     useMutation({
          mutationKey: ['LogoutUser'],
          mutationFn: logoutUserRequest,
     });


const createUsuarioRequest = async (formData: FormData) => {
     try {
          const token = getAuthToken();
          const response = await http.post("usuario", formData, {
               headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
               },
          });
          return response.data;
     } catch (error) {
          handleError(error);
          throw error;
     }
};

export const useCreateUsuario = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationKey: ["CreateUsuario"],
          mutationFn: createUsuarioRequest,
          onSuccess: () => {
               queryClient.invalidateQueries("GetUsuario"); // Invalidar la caché de empresas
          },
          onError: (error) => {
               console.log("Error", error);
          },
     });
};


// Obtener todas las empresas del usuario autenticado
const getUsuarioRequest = async (): Promise<UsuarioResponseType[]> => {
     try {
          const token = getAuthToken();
          const response = await http.get(`usuario/all`, {
               headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
               },
          });
          return response.data;
     } catch (error) {
          return handleError(error);
     }
};

export const useGetUsuario = () =>
     useQuery({
          queryKey: ["GetUsuario"],
          queryFn: () => getUsuarioRequest(),
     });

// Actualizar una Usuario
const updateUsuarioRequest = async (id: number, data: UsuarioRequestType) => {
     try {
          const token = getAuthToken();
          const response = await http.put(`usuario/${id}`, data, {
               headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
               },
          });
          return response.data;
     } catch (error) {
          handleError(error);
     }
};

export const useUpdateUsuario = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationKey: ["UpdateUsuario"],
          mutationFn: ({ id, data }: { id: number; data: UsuarioRequestType }) =>
               updateUsuarioRequest(id, data),
          onSuccess: () => {
               queryClient.invalidateQueries("GetUsuario"); // Invalidar la caché de Usuarios
          },
     });
};

// Eliminar una Usuario
const deleteUsuarioRequest = async (id: number) => {
     try {
          const token = getAuthToken();
          const response = await http.delete(`usuario/${id}`, {
               headers: {
                    Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
               },
          });
          return response.data;
     } catch (error) {
          handleError(error);
     }
};

export const useDeleteUsuario = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationKey: ["DeleteUsuario"],
          mutationFn: (id: number) => deleteUsuarioRequest(id),
          onSuccess: () => {
               queryClient.invalidateQueries("GetUsuario"); // Invalidar la caché de empresas
          },
     });
};