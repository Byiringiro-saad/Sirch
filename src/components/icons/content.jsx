import React from "react";

// Actions
import { getSavedDomains } from "../../action/supabaseAction";

// Components
import Icons from "./icons";

function Content({
  hb,
  tabs,
  data,
  sites,
  render,
  cursor,
  domains,
  setCursor,
  setDomains,
  underDomain,
  handleSites,
  handleRender,
  visibleSites,
}) {
  const handleSupabaseDomainCount = async (arr) => {
    const { datas, error } = await getSavedDomains();
    if (error) {
      // setFetchError("Could not fetch the domains");
      // setDomains(null);
      // console.log(error);
    }
    // all domains count
    if (datas) {
      setDomains(datas);
      handleSites(
        arr.map((site) => ({
          ...site,
          count: domains.find((d) => d.domain_name === site.domain)?.count || 0,
        }))
      );
    }
  };

  return (
    <Icons
      sites={sites}
      tabs={tabs}
      data={data}
      handleRender={(id) => handleRender(id)}
      render={render}
      cursor={cursor}
      setCursor={(x) => {
        setCursor(x);
      }}
      visibleSites={visibleSites}
      underDomain={underDomain}
      hb={hb}
      updateSupabaseDomainCount={handleSupabaseDomainCount}
    />
  );
}

export default Content;
