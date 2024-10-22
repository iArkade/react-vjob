import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, setAuthenticated, setUser } from "../state/slices/authSlice";
import { DateTime } from 'luxon';

interface DecodedToken {
     exp: number;
     id?: string;
     name?: string;
     lastname?: string;
     avatar?: string;
     email?: string;
     role: string;
     [key: string]: unknown;
}



const useAuth = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();

     useEffect(() => {
          const token = localStorage.getItem('token');
          if (token) {
               const decodedToken = jwtDecode<DecodedToken>(token);
               const currentTime = DateTime.now().toSeconds();
               //console.log(decodedToken);
               //console.log(decodedToken.exp, currentTime)
               if (decodedToken.exp as number < currentTime) {   
                    dispatch(logout());
                    navigate('/auth/login');
               } else {
                    dispatch(setUser({
                         id: decodedToken.id || '', 
                         email: decodedToken.email || '',  
                         name: decodedToken.name || '', 
                         lastname: decodedToken.lastname || '',  
                         role: decodedToken.role || '',
                    }));
                    dispatch(setAuthenticated({ isAuthenticated: true }));
               }
          }
     }, [dispatch, navigate]);
}

export default useAuth;