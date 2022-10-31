import { createSlice } from "@reduxjs/toolkit";
import axios from "../../features/axios";

export const iconsReducer = createSlice({
  name: "icons",
  initialState: {
    sites: [],
  },
  reducers: {
    getSites: (state, action) => {
      state.sites = action.payload;
    },
  },
});

export const getSitesAsync = (data) => async (dispatch) => {
  try {
    const response = await axios.get(`/companies/suggest?query=${data.key}`);
    dispatch(getSites(response.data));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const { getSites } = iconsReducer.actions;

export default iconsReducer.reducer;
