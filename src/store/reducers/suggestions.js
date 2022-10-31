import { searches } from "../../data/searches";
import { createSlice } from "@reduxjs/toolkit";

export const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState: {
    suggestions: [],
  },
  reducers: {
    addSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    removeSuggestions: (state, action) => {
      state.suggestions = [];
    },
  },
});

export const getSuggestionsAsync = (data) => async (dispatch) => {
  try {
    if (data.key.length === 0) {
      dispatch(removeSuggestions());
    } else {
      const filtered = searches.filter((search) =>
        search.name.toLocaleLowerCase().startsWith(data.key.toLocaleLowerCase())
      );
      dispatch(addSuggestions(filtered));
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const { addSuggestions, removeSuggestions } = suggestionsSlice.actions;

export default suggestionsSlice.reducer;
