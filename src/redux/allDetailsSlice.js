import { createSlice } from "@reduxjs/toolkit";

export const allDetailsSlice = createSlice({
  name: "answersData",
  initialState: {
    answersData: [{ displayText: "Generating answer...", type: "Answer", ansData: "" }],
    flgData: ["Answer", "Suggestions", "Commands", "Headlines"],
    allData: [],
    top5Data: [],
    iconSites: [],
    iconTabs: [],
    iconData: [],
  },
  reducers: {
    setAnswerData: (state, action) => ({
      ...state,
      answersData: action.payload,
    }),
    setFlgData: (state, action) => ({
      ...state,
      flgData: action.payload,
    }),
    setAllData: (state, action) => ({
      ...state,
      allData: action.payload,
    }),
    setTop5Data: (state, action) => ({
      ...state,
      top5Data: action.payload,
    }),
    setIconSites: (state, action) => ({
      ...state,
      iconSites: action.payload,
    }),
    setIconTabs: (state, action) => ({
      ...state,
      iconTabs: action.payload,
    }),
    setIconData: (state, action) => ({
      ...state,
      iconData: action.payload,
    }),
  },
});

export const { setAnswerData, setFlgData, setAllData, setTop5Data, setIconSites, setIconTabs, setIconData } =
  allDetailsSlice.actions;

export default allDetailsSlice.reducer;
