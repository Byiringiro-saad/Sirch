/* eslint-disable consistent-return */

import axios from "axios";
import getCountry from "../utils/getCountry";
import getHeaders from "../utils/getHeaders";

const Bing = "https://api.bing.microsoft.com/v7.0/";

export const getBingSearch = async (query) => {
  const countrycode = getCountry().id;
  const lang = navigator.language;
  const url = `${Bing}search?q=${encodeURIComponent(query)}&count=48&cc=${countrycode}`;

  const headers = getHeaders(lang);
  const res = await axios.get(url, { headers });
  return res.data.webPages.value;
};

export const bingAutoSuggest = async (query) => {
  const countrycode = getCountry().id;
  const lang = navigator.language;
  const url = `${Bing}Suggestions?q=${query}&&cc=${countrycode}`;
  const headers = getHeaders(lang);
  const res = await axios.get(url, { headers });
  return res.data.suggestionGroups[0].searchSuggestions;
};

export const openNewTab = (id, index, url) => {
  window.open(`https://${url}`, "__blank");
};
