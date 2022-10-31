import { configureStore } from "@reduxjs/toolkit";

//slices
import iconsReducer from "./reducers/icons";
import suggestionsSlice from "./reducers/suggestions";

export default configureStore({
  reducer: {
    sites: iconsReducer,
    suggestions: suggestionsSlice,
  },
});
