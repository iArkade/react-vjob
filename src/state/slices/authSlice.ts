import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole = 'superadmin' | 'admin' | 'user';

interface User {
     id: number;
     email: string;
     name: string;
     lastname: string;
     role: UserRole;
}

interface AuthState {
     user: User | null;
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
          setUser(state, action: PayloadAction<User>) {
               state.user = action.payload;
               state.isAuthenticated = true;
          },
          clearUser: (state) => {
               state.user = null;
               state.isAuthenticated = false;
          },
          logout: (state) => {
               state.user = null;
               state.isAuthenticated = false;
               localStorage.clear(); // Clear all related storage
          },
     },
});

export const { setUser, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;