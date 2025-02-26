import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";
import { setFeedback } from "./state/slices/feedBackSlice";
import { RootState } from "./state/store";
import { useDispatch } from "react-redux";
import AuthWrapper from "./AuthWrapper"; // Importa el componente AuthWrapper

function App() {
  const dispatch = useDispatch();
  const { message, severity } = useSelector((state: RootState) => state.feedBackSlice);

  // Función para cerrar el Snackbar
  function handleSnackbarClose(_event: unknown): void {
    dispatch(setFeedback({ message: null, severity: "success", isError: false }));
  }

  return (
    <BrowserRouter>
      <AuthWrapper /> {/* Usa el componente AuthWrapper */}
      {message !== null && (
        <Snackbar
          open={message !== null}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </BrowserRouter>
  );
}

export default App;