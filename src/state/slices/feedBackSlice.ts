import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeedbackState {
  message: string | null;
  isError: boolean;
  severity?: "success" | "info" | "warning" | "error";
}

const initialState: FeedbackState = {
  message: null,
  isError: false,
  severity: "info",
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedback(
      state,
      action: PayloadAction<{
        message: string | null;
        isError: boolean;
        severity?: "success" | "info" | "warning" | "error";
      }>
    ) {
      state.message = action.payload.message;
      state.isError = action.payload.isError;
      state.severity = action.payload.severity || "info";
    },
  },
});

export const { setFeedback } = feedbackSlice.actions;

export default feedbackSlice.reducer;