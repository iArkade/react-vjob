import { useMutation, useQuery, useQueryClient } from "react-query";
import http from "./http";
import { LoginRequestType, UsuarioResponseType, UsuarioRequestType, RegistrarUsuarioType } from "./user-types";

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
     } else if (error instanceof Error) {
          throw new Error(error.message || "Error desconocido");
     }
     throw new Error("Error desconocido");
};

const getAuthToken = (): string => {
     const token = localStorage.getItem('token');
     if (!token) {
          throw new Error("No se encontró el token de autenticación");
     }
     return token;
};

const registerUserRequest = (user: RegistrarUsuarioType) =>
     http.post('auth/register', user);

const loginUserRequest = (credentials: LoginRequestType) =>
     http.post('auth/login', credentials);

const logoutUserRequest = () => {
     const token = getAuthToken();
     return http.post('/auth/logout', {}, {
          headers: {
               'Authorization': `Bearer ${token}`,
          },
     });
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

const createUsuarioRequest = async (data: UsuarioRequestType) => {
     try {
          const token = getAuthToken();
          const response = await http.post("usuario", data, {
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
          });
          return response.data;
     } catch (error) {
          handleError(error);
     }
};

export const useCreateUsuario = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationKey: ["CreateUsuario"],
          mutationFn: (data: UsuarioRequestType) => createUsuarioRequest(data),
          onSuccess: () => {
               queryClient.invalidateQueries("GetUsuario");
          },
     });
};

const createUsuarioByEmpresaRequest = async (empresaId: number, data: UsuarioRequestType): Promise<UsuarioResponseType> => {
     try {
          const token = getAuthToken();
          const response = await http.post(`usuario/empresa/${empresaId}`, data, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });

          return {
               id: response.data.id,
               email: response.data.email,
               name: response.data.name,
               lastname: response.data.lastname,
               active: response.data.active,
               systemRole: response.data.systemRole,
               empresas: response.data.empresas || [],
          };
     } catch (error) {
          return handleError(error);
     }
};
export const useCreateUsuarioByEmpresa = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: ({ empresaId, data }: { empresaId: number; data: UsuarioRequestType }) =>
               createUsuarioByEmpresaRequest(empresaId, data),
          onSuccess: (_, { empresaId }) => {
               queryClient.invalidateQueries(["GetUsuario", empresaId]); // Refrescar lista de usuarios de la empresa
          },
     });
};

const updateUsuarioByEmpresaRequest = async (empresaId: number, userId: number, data: UsuarioRequestType): Promise<UsuarioResponseType> => {
     try {
          const token = getAuthToken();
          const response = await http.put(`usuario/empresa/${empresaId}/${userId}`, data, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });

          return {
               id: response.data.id,
               email: response.data.email,
               name: response.data.name,
               lastname: response.data.lastname,
               active: response.data.active,
               systemRole: response.data.systemRole,
               empresas: response.data.empresas || [],
          };
     } catch (error) {
          return handleError(error);
     }
};

export const useUpdateUsuarioByEmpresa = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: ({ empresaId, userId, data }: { empresaId: number; userId: number; data: UsuarioRequestType }) =>
               updateUsuarioByEmpresaRequest(empresaId, userId, data),
          onSuccess: (_, { empresaId }) => {
               queryClient.invalidateQueries(["GetUsuario", empresaId]); // Refrescar lista de usuarios de la empresa
          },
     });
};

const getUsuarioRequest = async (): Promise<UsuarioResponseType[]> => {
     try {
          const token = getAuthToken();
          const response = await http.get(`usuario`, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          return response.data.map((user: any) => ({
               id: user.id,
               email: user.email,
               name: user.name,
               lastname: user.lastname,
               active: user.active,
               systemRole: user.systemRole,
               empresas: user.empresas || [],
          }));
     } catch (error) {
          return handleError(error);
     }
};

export const useGetUsuario = () =>
     useQuery({
          queryKey: ["GetUsuario"],
          queryFn: () => getUsuarioRequest(),
          staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
          retry: 2, // Reintentar 2 veces en caso de error
     });

const getUsuariosByEmpresaRequest = async (empresaId: number): Promise<UsuarioResponseType[]> => {
     try {
          const token = getAuthToken();

          const response = await http.get(`usuario/empresa/${empresaId}`, {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          });
          //console.log(response.data)
          return response.data
          // return response.data.map((user: any) => ({
          //      id: user.id,
          //      email: user.email,
          //      name: user.name,
          //      lastname: user.lastname,
          //      active: user.active,
          //      systemRole: user.systemRole,
          //      empresas: user.empresas || [],
          // }));
     } catch (error) {
          return handleError(error);
     }
};
export const useGetUsuariosByEmpresa = (empresaId: number) => {
     return useQuery({
          queryKey: ['GetUsuariosByEmpresa', empresaId],
          queryFn: () => getUsuariosByEmpresaRequest(empresaId),
          enabled: !!empresaId, // Solo corre si empresaId tiene valor
          staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
          retry: 2, // Reintenta 2 veces si falla
     });
};

const updateUsuarioRequest = async (id: number, data: Partial<UsuarioRequestType>) => {
     try {
          const token = getAuthToken();
          const response = await http.put(`usuario/${id}`, data, {
               headers: {
                    Authorization: `Bearer ${token}`,
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
          mutationFn: ({ id, data }: { id: number; data: Partial<UsuarioRequestType> }) =>
               updateUsuarioRequest(id, data),
          onSuccess: (updatedUser) => {
               queryClient.setQueryData<UsuarioResponseType[]>("GetUsuario", (oldData = []) => {
                    return oldData.map((user) =>
                         user.id === updatedUser.id ? updatedUser : user
                    );
               });
          },
     });
};


const deleteUsuarioRequest = async (id: number) => {
     try {
          const token = getAuthToken();
          const response = await http.delete(`usuario/${id}`, {
               headers: {
                    Authorization: `Bearer ${token}`,
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
               queryClient.invalidateQueries("GetUsuario");
          },
     });
};