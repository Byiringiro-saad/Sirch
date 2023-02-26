/* eslint-disable no-return-await */
/* eslint-disable consistent-return */

import Hyperbeam from "@hyperbeam/web";
import axios from "axios";

export const renderPage = async (hb, data, windowId) => {
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
};

export const updateTab = async (hb, id) => {
  await hb.tabs.update(id, { active: true });
};

export async function loadHyperBeam(container, embedUrl) {
  const hyperbeamWebOptions = { volume: 0 };
  return await Hyperbeam(container, embedUrl, hyperbeamWebOptions);
}

export const getEmbeddedUrl = async () => {
  const res = await axios.get(`${process.env.REACT_APP_SIRCH_INTEGRATIONS_URL}/hb/create`);
  window.localStorage.setItem("hb_session", JSON.stringify(res.data));
  return res.data;
};

export const checkSession = async (id) => {
  const res = await axios.get(`${process.env.REACT_APP_SIRCH_INTEGRATIONS_URL}/hb/session/${id}`);
  return res.data;
};
