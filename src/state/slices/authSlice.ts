import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
     user: {
          id?: number;
          email: string;
          name: string;
          lastname: string;
          role?: string;
     } | null;
     isAuthenticated: boolean;
}

const initialState: AuthState = {
     user: null,
     isAuthenticated: false,
};

const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
          setUser(
               state,
               action: PayloadAction<{
                    id: number;
                    email: string;
                    name: string;
                    lastname: string;
                    role: string;
               }>
          ) {
               state.user = {
                    id: action.payload.id,
                    name: action.payload.name,
                    lastname: action.payload.lastname,
                    email: action.payload.email,
                    role: action.payload.role,
               };
               state.isAuthenticated = true;
          },
          clearUser(state) {
               state.user = null;
               state.isAuthenticated = false;
          },
          setAuthenticated(
               state,
               action: PayloadAction<{ isAuthenticated: boolean }>
          ) {
               state.isAuthenticated = action.payload.isAuthenticated;
          },
          logout: (state) => {
               state.isAuthenticated = false;
               state.user = null;
               localStorage.removeItem("token");
               localStorage.removeItem("user");
          },
     },
});

export const { setUser, clearUser, setAuthenticated, logout } =
     authSlice.actions;

export default authSlice.reducer;
