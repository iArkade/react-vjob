// import { jwtDecode } from "jwt-decode";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout, setAuthenticated, setUser } from "../state/slices/authSlice";
// import { DateTime } from "luxon";

// interface DecodedToken {
//   exp: number;
//   id?: number;
//   name?: string;
//   lastname?: string;
//   avatar?: string;
//   email?: string;
//   role?: string;
//   superAdmin?: boolean
//   // [key: string]: unknown;
// }

// const useAuth = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode<DecodedToken>(token);
//       console.log(decodedToken)
//       const currentTime = DateTime.now().toSeconds();
//       //console.log(decodedToken);
//       if ((decodedToken.exp as number) < currentTime) {
//         dispatch(logout());
//         navigate("/auth/login");
//       } else {
//         dispatch(
//           setUser({
//             id: decodedToken.id || 0,
//             email: decodedToken.email || "",
//             name: decodedToken.name || "",
//             lastname: decodedToken.lastname || "",
//             role: decodedToken.superAdmin || false,
//           })
//         );
//         dispatch(setAuthenticated({ isAuthenticated: true }));
//       }
//     }
//     setLoading(false);
//   }, [dispatch, navigate]);

//   return loading
// };

// export default useAuth;
