import { AuthUserType } from "@/api/user-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
     user: AuthUserType | null;
     isAuthenticated: boolean;
     justLoggedIn: boolean;
}

const initialState: AuthState = {
     user: null,
     isAuthenticated: false,
     justLoggedIn: false
};

const authSlice = createSlice({
     name: "auth",
     initialState,
     reducers: {
          setUser(state, action: PayloadAction<AuthUserType>) {
               state.user = action.payload;
               state.isAuthenticated = true;
          },
          setJustLoggedIn(state, action: PayloadAction<boolean>) {
               state.justLoggedIn = action.payload;
          },
          clearUser: (state) => {
               state.user = null;
               state.isAuthenticated = false;
          },
          logout: (state) => {
               state.user = null;
               state.isAuthenticated = false;
               localStorage.clear(); // Clear all related storage
               state.justLoggedIn = false;
          },
     },
});

export const { setUser, setJustLoggedIn, clearUser, logout } = authSlice.actions;
export default authSlice.reducer;