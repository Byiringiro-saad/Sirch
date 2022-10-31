import { configureStore } from "@reduxjs/toolkit";

//slices
import iconsReducer from "./reducers/icons";

export default configureStore({
  reducer: {
    sites: iconsReducer,
  },
});
