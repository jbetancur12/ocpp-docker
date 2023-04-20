import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  language: "es",
  userId: "63701cc1f03239b7f700000e",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLanguage: (state) => {
        state.language = state.language === "es" ? "en" : "es"
    }
  },
});

export const { setMode, setLanguages } = globalSlice.actions;

export default globalSlice.reducer;
