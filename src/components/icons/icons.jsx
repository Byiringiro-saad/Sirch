/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import styled from "styled-components";
import { openNewTab } from "../../action/bingAction";
import { addDomain } from "../../action/supabaseAction";

function Icons({
  sites,
  tabs,
  data,
  handleRender,
  render,
  cursor,
  setCursor,
  underDomain,
  updateSupabaseDomainCount,
  visibleSites,
}) {
  const [currentNav, setCurrentNav] = useState(1);
  const [tabsPerNav] = useState(4);
  const [currentTab, setCurrentTab] = useState(0);
  const indexOfLastTab = currentNav * tabsPerNav;
  const indexOfFirstTab = indexOfLastTab - tabsPerNav;
  const currentDomainRecord = sites?.slice(indexOfFirstTab, indexOfLastTab);
  const currentBingRecord = tabs?.slice(indexOfFirstTab, indexOfLastTab);
  const nNavsForDomain = Math.ceil(sites?.length / tabsPerNav);
  const nNavsForBing = Math.ceil(tabs?.length / tabsPerNav);

  const nextNav = () => {
    if (currentNav !== nNavsForBing) {
      setCurrentNav(currentNav + 1);
    } else if (currentNav !== nNavsForDomain) {
      setCurrentNav(currentNav + 1);
    }
  };

  const prevNav = () => {
    if (currentNav !== 1) {
      setCurrentNav(currentNav - 1);
    }
  };

  const handleKeyDown = async (e) => {
    if (cursor === 3 && e.keyCode === 39) {
      if (currentNav === nNavsForDomain || currentNav === nNavsForBing) {
        setCursor(3);
      } else {
        setCursor(0);
        nextNav();
        setCurrentTab(cursor + 1 + tabsPerNav * (currentNav - 1));
      }
    } else if (e.keyCode === 39 && (currentTab === tabs.length - 1 || currentTab === sites.length - 1)) {
      setCursor(cursor);
      setCurrentTab(cursor + tabsPerNav * (currentNav - 1));
    } else if (cursor === 0 && e.keyCode === 37) {
      if (currentNav === 1) {
        setCursor(0);
      } else {
        setCursor(3);
        prevNav();
      }
    } else if (e.keyCode === 37 && cursor > 0) {
      setCursor(cursor - 1);
      setCurrentTab(cursor - 1 + tabsPerNav * (currentNav - 1));
    } else if (e.keyCode === 39 && cursor < tabs.length - 1) {
      setCursor(cursor + 1);
      setCurrentTab(cursor + 1 + tabsPerNav * (currentNav - 1));
    } else if (e.keyCode === 39 && cursor < sites.length - 1) {
      setCursor(cursor + 1);
      setCurrentTab(cursor + 1 + tabsPerNav * (currentNav - 1));
    } else if (e.keyCode === 38 && sites[cursor]?.domain) {
      // save domain counter in supabase when arrow up key pressed
      const { data, error } = await addDomain(sites[cursor].domain);
      if (data && cursor > -1 && !underDomain) {
        // sites[cursor].count = data.count;
        updateSupabaseDomainCount(sites);
      }
      if (error) {
        throw new Error(error);
      }
    }
  };

  React.useEffect(() => {
    if (sites.length === 0 && tabs.length === 0) {
      setCursor(-1);
    }
  }, [sites, tabs]);

  React.useEffect(() => {
    tabs.length > 0 && handleRender(tabs[currentTab].id);
  }, [cursor]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const getDomain = (url) => {
    const domain = new URL(url).hostname;
    return domain;
  };

  const handleTabNav = (id, index) => {
    handleRender(id);
    setCursor(index);
  };

  return (
    <Container visible={visibleSites} render={render}>
      {currentBingRecord?.length > 0
        ? currentBingRecord?.map((tab, index) =>
            iconNav(
              index,
              tab?.id,
              `https://logo.clearbit.com/${getDomain(tab?.pendingUrl)}` ||
                `https://${getDomain(tab?.pendingUrl)}/favicon.ico`,
              data[index]?.name || tab?.pendingUrl,
              tab?.pendingUrl,
              handleTabNav
            )
          )
        : currentDomainRecord?.length > 0 &&
          currentDomainRecord?.map((site, index) =>
            iconNav(
              index,
              site?.id,
              site?.logo || `https://${site?.domain}/favicon.ico`,
              site?.name,
              site?.domain,
              openNewTab,
              site.count
            )
          )}
    </Container>
  );

  function iconNav(index, id, logo, name, domain, handleTab, count) {
    return (
      <div
        className={cursor === index ? "selected div" : "div"}
        onClick={() => handleTab(id, index, domain)}
        key={index}
      >
        <div className={count && count > 0 ? "num" : ""}>{count && count > 0 ? count : ""}</div>
        <div className="gray">{logo ? <img src={logo} alt={name} /> : <p>{name?.charAt(0)}</p>}</div>
        <div className="name">
          <p>{name}</p>
        </div>
      </div>
    );
  }
}

const Container = styled.div`
  width: 700px;
  height: ${(props) => (props.render ? "50px" : "130px")};
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--black);
  border-radius: 0 0 10px 10px;
  border: ${(props) => (props.visible ? "1px solid var(--gray)" : "none")};

  .selected {
    .gray {
      background: var(--icon) !important;
    }

    .name {
      background: ${(props) => (props.render ? "var(--icon) !important" : "")};
      justify-content: center !important;

      p {
        text-decoration: underline;
      }
    }
  }

  .div {
    width: 150px;
    height: 100%;
    display: ${(props) => (props.visible ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin: 0 10px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    .num {
      width: 20px;
      height: 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 0px;
      background: var(--red);
    }

    .gray {
      width: 100%;
      height: 80%;
      border-radius: 5px;
      display: ${(props) => (props.render ? "none" : "flex")};
      align-items: center;
      justify-content: center;

      p {
        font-size: 1.5em;
        color: var(--white);
      }

      img {
        width: 30%;
        border-radius: 5px;
        object-position: center;
      }
    }

    .name {
      width: 100%;
      height: ${(props) => (props.render ? "100%" : "15%")};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${(props) => (props.render ? "center" : "flex-end")};
      color: var(--white);
      border-radius: 3px;
      padding: 0 10px;

      p {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

export default Icons;
