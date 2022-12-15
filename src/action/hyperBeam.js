/* eslint-disable no-return-await */
/* eslint-disable consistent-return */

import Hyperbeam from "@hyperbeam/web";
import axios from "axios";

export const renderPage = async (hb, data, windowId) => {
  try {
    if (windowId) {
      const query = await hb.tabs.query({ windowId });
      query.map(async (tab) => {
        await hb.tabs.remove(tab.id);
      });
    }

    const tabs = await data.map(
      async (item, index) =>
        await hb.tabs.create({
          index,
          url: item.url || item.domain,
          active: false,
        })
    );
    return Promise.all(tabs);
  } catch (err) {
    console.error(err);
  }
};

export const updateTab = async (hb, id) => {
  await hb.tabs.update(id, { active: true });
};

export async function loadHyperBeam(container, embedUrl) {
  try {
    return await Hyperbeam(container, embedUrl);
  } catch (error) {
    console.error(error);
    console.error(error.response);
  }
}

export const getEmbeddedUrl = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_SIRCH_INTEGRATIONS_URL}/hb/create`);
    window.localStorage.setItem("hb_session", JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const checkSession = async (id) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_SIRCH_INTEGRATIONS_URL}/hb/session/${id}`);
    return res.data;
  } catch (error) {
    console.error(error.response);
  }
};
