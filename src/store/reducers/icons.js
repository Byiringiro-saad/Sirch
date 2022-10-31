import { createSlice } from "@reduxjs/toolkit";
import axios from "../../features/axios";

export const iconsReducer = createSlice({
  name: "icons",
  initialState: {
    sites: [],
    selected: {},
  },
  reducers: {
    getSites: (state, action) => {
      state.sites = action.payload;
    },
    removeSites: (state, action) => {
      state.sites = [];
      state.selected = {};
    },
    selectSite: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const getSitesAsync = (data) => async (dispatch) => {
  try {
    if (data?.key?.length === 0) {
      dispatch(removeSites());
    } else {
      const response = await axios.get(`/companies/suggest?query=${data.key}`);
      dispatch(getSites(response.data));
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const { getSites, selectSite, removeSites } = iconsReducer.actions;

export default iconsReducer.reducer;
