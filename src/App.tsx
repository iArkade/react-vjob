import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { Alert, Snackbar } from "@mui/material";
import { SyntheticEvent } from "react";
import { useSelector } from "react-redux";

import { setFeedback } from "./state/slices/feedBackSlice";
import { RootState } from "./state/store";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  function handleSnackbarClose(_event: unknown): void {
    dispatch(
      setFeedback({ message: null, severity: "success", isError: false })
    );
  }

  const { message, severity } = useSelector(
    (state: RootState) => state.feedBackSlice
  );

  return (
    <BrowserRouter>
      <AppRouter />
      {message !== null && (
        <Snackbar
          open={message !== null}
          onClose={handleSnackbarClose}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </BrowserRouter>
  );
}

export default App;
