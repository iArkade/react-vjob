import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
     user: { name:string; lastname: string; username: string; password: string } | null;
     isAuthenticated: boolean;
}

const loadState = (): AuthState => {
     const user = localStorage.getItem('user');
     const isAuthenticated = localStorage.getItem('isAuthenticated');

     return {
          user: user ? JSON.parse(user) : null,
          isAuthenticated: isAuthenticated === 'true',
     };
};

const initialState: AuthState = {
     user: null,
     isAuthenticated: false,
};

const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
          setUser(state, action: PayloadAction<{ name: string, lastname: string, username: string, password: string }>) {
               state.user = { 
                    name: action.payload.name,
                    lastname: action.payload.lastname,
                    username: action.payload.username,
                    password: action.payload.password 
               };
               state.isAuthenticated = true;
               localStorage.setItem('username', state.user.username);
               localStorage.setItem('password', state.user.password);
               localStorage.setItem('isAuthenticated', 'true');
          },
          clearUser(state) {
               state.user = null;
               state.isAuthenticated = false;
               // localStorage.removeItem('user');
               // localStorage.removeItem('isAuthenticated');
          },
          setAuthenticated(state, action: PayloadAction<{ isAuthenticated: boolean }>){
               state.isAuthenticated = action.payload.isAuthenticated;
               //localStorage.setItem('isAuthenticated', action.payload.toString());
          },
     },
});

export const { setUser, clearUser, setAuthenticated } = authSlice.actions;

export default authSlice.reducer;

