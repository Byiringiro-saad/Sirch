/* eslint-disable consistent-return */

import axios from "axios";

export const getBingSearch = async (query) => {
  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=48`;

  const headers = {
    "Ocp-Apim-Subscription-Key": "e9304f36e5a74402a883041088cf3429",
  };
  const res = await axios.get(url, { headers });
  return res.data.webPages.value;
};

export const bingAutoSuggest = async (query) => {
  const url = `https://api.bing.microsoft.com/v7.0/Suggestions?q=${query}`;
  const headers = {
    "Ocp-Apim-Subscription-Key": "e9304f36e5a74402a883041088cf3429",
  };
  const res = await axios.get(url, { headers });
  return res.data.suggestionGroups[0].searchSuggestions;
};

export const openNewTab = (id, index, url) => {
  window.open(`https://${url}`, "__blank");
};
