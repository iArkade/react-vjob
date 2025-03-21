import { Alert, Snackbar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setFeedback } from "@/state/slices/feedBackSlice"; // Asegúrate de que la ruta sea correcta
import { RootState } from "@/state/store"; // Asegúrate de que la ruta sea correcta

export function Feedback() {
    const dispatch = useDispatch();
    const { message, severity } = useSelector((state: RootState) => state.feedBackSlice);

    // Función para cerrar el Snackbar
    const handleClose = () => {
        dispatch(setFeedback({ message: null, severity: "success", isError: false }));
    };

    return (
        <Snackbar
            open={message !== null}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
}