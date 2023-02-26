/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import useLocalStorage from "use-local-storage";
import { debounce } from "lodash";

// icons
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CopyIcon, CopiedIcon } from "./icons/icons";

// utils
import { getSavedDomains, getUnderDomainsByDomain } from "./action/supabaseAction";
import { bingAutoSuggest, getBingSearch } from "./action/bingAction";
import { checkSession, getEmbeddedUrl, loadHyperBeam, renderPage, updateTab } from "./action/hyperBeam";

// portals
import EmailPortal from "./portals/email";

// components
import Page from "./components/page";
import Icons from "./components/icons";
import Command from "./components/command";
import Suggestion from "./components/suggestion";
import Instruction from "./components/instruction";
import ShortAnswer from "./components/shortAnswer";
import Nav from "./components/nav";
import Footer from "./components/footer";

function App() {
  // theme data
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  // local data
  const [tabs, setTabs] = useState([]);
  const [windowId, setWindowId] = useState(null);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [backupValue, setBackupValue] = useState("");
  const [sites, setSites] = useState([]);
  const [visibleSites, setVisibleSites] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsActive, setSuggestionsActive] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [render, setRender] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [underDomain, setUnderDomain] = useState(false);
  const [underDomainData, setUnderDomainData] = useState([
    // "Home",
    // "About Us",
    // "Contact Us",
    // "Explore",
    // "Login",
    // "Signup",
  ]);
  const [underDomainFilterd, setUnderDomainFilterd] = useState([]);
  const [selectedPage, setSelectedPage] = useState(-1);
  const [spaceClicked, setSpaceClicked] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [askEmail, setAskEmail] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(false);

  // instructions
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [four, setFour] = useState("");
  const [five, setFive] = useState("");
  const [six, setSix] = useState("");
  const [seven, setSeven] = useState("");
  const [escape, setEscape] = useState(false);

  // hyperbeam
  const [hb, setHb] = useState(null);
  const [hbCursor, setHbCursor] = useState(-1);

  // supabase related state
  const [fetchError, setFetchError] = useState(null);
  const [domains, setDomains] = useState(null);

  const fetchDomains = async () => {
    const { data, error } = await getSavedDomains();
    if (error) {
      setFetchError("Could not fetch the domains");
      setDomains(null);
      throw error;
    }

    if (data) {
      setDomains(data);
      setFetchError(null);
    }
  };

  const handleSupabaseDomainCount = async (sites) => {
    const { data, error } = await getSavedDomains();
    if (error) {
      // setFetchError("Could not fetch the domains");
      // setDomains(null);
      // console.log(error);
    }
    // all domains count
    if (data) {
      setDomains(data);
      setSites(
        sites.map((site) => ({
          ...site,
          count: domains.find((d) => d.domain_name === site.domain)?.count || 0,
        }))
      );
    }
  };

  const [commands] = useState([
    {
      id: 1,
      name: "Clipboard History",
      icon: CopyIcon,
    },
    {
      id: 2,
      name: "Import extension",
      icon: CopiedIcon,
    },
    {
      id: 3,
      name: "Manage extension",
      icon: CopiedIcon,
    },
  ]);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "light" : "dark";
    setTheme(newTheme);
  };

  function hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  const underDomainSearch = (key) => {
    // not yet implemented, store data in underDomainData
  };

  const handleAskEmail = (e) => {
    e.preventDefault();
    setAskEmail(!askEmail);
  };

  const handleChange = async (e) => {
    setValue(e.target.value.toLowerCase());

    if (!underDomain) {
      if (e.target.value?.length === 0) {
        setVisibleSites(false);
        setShowInstructions(false);
        setSites([]);
        setTabs([]);
        setOne("");
        setFour("");
        setTwo("");
        setFive("");
        setThree("");
        setSix("");
        setSeven("");
      }

      if (e.target.value?.length > 0) {
        setVisibleSites(true);
        setShowInstructions(true);
        setOne("one");
        setFour("enter");
        setTwo("Go");
        setFive("right");
        setThree("Domains");
        setSix("down");
        setSeven("Pages");
        underDomainSearch(e.target.value);
      }

      // if (e.target.value.length > 2) {
      //   setOne("two");
      //   setFour("down");
      //   setTwo("Suggestions & stashed pages");
      //   setFive("right");
      //   setThree("Domains");
      //   setSix("");
      //   setSeven("");
      // }

      if (e.target.value?.length === 1) {
        setCursor(0);
      }

      if (!hasWhiteSpace(value)) {
        setCursor(0);
        setSuggestionsActive(false);
        setEscape(false);
      }

      if (hasWhiteSpace(e.target.value)) {
        // changing the instructions
        setTwo("Google SERP");
        setThree("");
        setFour("enter");
        setFive("");
        setOne("three");
        setSix("more");
        setSeven("");
        setUnderDomain(false);
        setEscape(true);

        // removing the current icons
        setSites([]);

        // getting suggestions from bing api
        const sug = await bingAutoSuggest(e.target.value);
        setSuggestions(sug);
        debounceFn(e.target.value, hb);
      } else {
        companySuggest(value);
      }
    }
  };

  // Found useEffect

  useEffect(() => {
    const selectedDomain = sites[cursor]?.domain;
    if (selectedDomain) {
      let data;
      const founds = async () => {
        data = await getUnderDomainsByDomain(selectedDomain);
      };
      founds().then(() => {
        setUnderDomainData(data);
        const filterd = underDomainData.filter((d) => d.toLowerCase().includes(value.toLowerCase()));
        setUnderDomainFilterd(filterd);
      });
    }
    if (hasWhiteSpace) {
      setUnderDomainFilterd([]);
      setUnderDomainData([]);
    }
  }, [cursor, value, sites]);

  useEffect(() => {
    if (!hasWhiteSpace(value) && suggestionsActive && selectedSuggestion === -1) {
      setSpaceClicked(false);
      setCursor(0);
      setSuggestionsActive(false);
      setSelectedSuggestion(-1);
      setEscape(false);
    }

    if (hasWhiteSpace(value) && !suggestionsActive && selectedSuggestion === -1) {
      setSpaceClicked(true);
      setCursor(-1);
      setSuggestionsActive(true);
    }

    if (value?.length === 0 && !underDomain) {
      setSuggestionsActive(false);
      setSelectedSuggestion(-1);
      setSites([]);
      setEscape(false);
    }

    if (value?.length === 0 && suggestionsActive) {
      setSites([]);
      setEscape(false);
    }
  }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleTabUpdate = async (id) => {
    await updateTab(hb, id);
  };

  useEffect(() => {
    // fetchDomain
    fetchDomains();

    // check if hb session is saved in local storage
    const container = document.getElementById("container");
    const hbSession = localStorage.getItem("hbSession");
    if (hbSession) {
      const { sessionId } = JSON.parse(hbSession);
      checkSession(sessionId).then((session) => {
        if (session.termination_date) {
          // create new session
          getEmbeddedUrl().then((newSession) => {
            loadHyperBeam(container, newSession.embdedUrl)
              .then((hyperbeam) => {
                setHb(hyperbeam);
              })
              .catch((err) => {
                throw err;
              });
          });
        } else {
          // load previous session
          const { embdedUrl } = JSON.parse(hbSession);
          loadHyperBeam(container, embdedUrl)
            .then((hyperbeam) => {
              setHb(hyperbeam);
            })
            .catch((err) => {
              throw err;
            });
        }
      });
    } else {
      // create new session
      getEmbeddedUrl().then((newSession) => {
        loadHyperBeam(container, newSession.embed_url)
          .then((hyperbeam) => {
            setHb(hyperbeam);
          })
          .catch((err) => {
            throw err;
          });
      });
    }
    return () => {
      hb && hb.destroy();
    };
  }, []);

  const handleKeyPressed = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  const handleRenderPage = async (value) => {
    const data = await getBingSearch(value);
    setData(data);
    let tabs;
    if (hb) {
      tabs = await renderPage(hb, data, windowId);
      if (tabs.length) {
        setTabs(tabs);
        if (windowId !== tabs[0].windowId) {
          setWindowId(tabs[0].windowId);
        }
      }
    }
  };
  const debounceFn = useMemo(() => debounce(handleRenderPage, 1000), [hb]);

  const handleKeyDown = (e) => {
    // For suggestions
    // Down
    if (e.keyCode === 40 && suggestionsActive && selectedSuggestion === -1) {
      setBackupValue(value);
      setValue(suggestions[selectedSuggestion + 1]?.displayText);
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Down
    if (e.keyCode === 40 && suggestionsActive && selectedSuggestion >= 0 && selectedSuggestion < 7) {
      if (selectedSuggestion !== 4 && selectedSuggestion !== 5 && selectedSuggestion !== 6) {
        setValue(suggestions[selectedSuggestion + 1]?.displayText);
      }
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsActive && selectedSuggestion > 0) {
      if (selectedSuggestion !== 5 && selectedSuggestion !== 6 && selectedSuggestion !== 7) {
        setValue(suggestions[selectedSuggestion - 1]?.displayText);
      }
      setSelectedSuggestion(selectedSuggestion - 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsActive && selectedSuggestion === 0) {
      setValue(backupValue);
      setBackupValue("");
      setSelectedSuggestion(-1);
    }

    // Enter
    if (e.keyCode === 13 && selectedSuggestion > -1 && !render) {
      const domain = suggestions[selectedSuggestion]?.url.replace("bing.com", "google.com");
      window.open(`${domain}`, "__blank");
    }

    // Enter
    if (e.keyCode === 13 && selectedSuggestion === -1 && !render) {
      const query = value.replace(/\s/g, "+");
      const domain = `https://www.google.com/search?q=${query}`;
      window.open(`${domain}`, "__blank");
    }

    // For pages
    // Found
    // if (value?.length > 2 && !underDomain && selectedPage === -1 && !suggestionsActive) {
    //   console.log("rer1");
    //   setUnderDomain(true);
    // }

    // if (value?.length <= 2) {
    //   console.log("rer2");
    //   // setUnderDomain(false);
    // }

    // Down
    if (e.keyCode === 40 && !underDomain && selectedPage === -1 && !suggestionsActive) {
      setBackupValue(value);
      setValue("");
      setSelectedPage(0);
      setUnderDomain(true);
    }

    // Down
    if (e.keyCode === 40 && underDomain && selectedPage >= 0 && selectedPage <= underDomainData.length + 1) {
      setSelectedPage(selectedPage + 1);
    }

    // Up
    if (e.keyCode === 38 && underDomain && selectedPage >= 0) {
      setSelectedPage(selectedPage - 1);
    }

    // Up
    if (e.keyCode === 38 && underDomain && selectedPage === 0) {
      setValue(backupValue);
      setBackupValue("");
      setSelectedPage(-1);
      setUnderDomain(false);
    }

    // Enter when not in hyperbeam
    if (e.keyCode === 13 && cursor > -1 && !render) {
      window.open(`https://${sites[cursor]?.domain}`, "__blank");
    }

    // Enter when in hyperbeam
    if (e.keyCode === 13 && cursor > -1 && render) {
      window.open(`${tabs[hbCursor]?.pendingUrl}`, "__blank");
    }

    // Right when in hyperbeam
    if (e.keyCode === 37 && render) {
      hbCursor < tabs.length && setHbCursor(hbCursor + 1);
    }

    // Left when in hyperbeam
    if (e.keyCode === 39 && render) {
      hbCursor >= 0 && setHbCursor(hbCursor - 1);
    }

    // user hits escape in hyperbeam
    if (render && e.keyCode === 27) {
      setRender(false);
      setHbCursor(-1);
    }

    // user hits escape but not in hyperbeam
    if (e.keyCode === 27 && !render && hasWhiteSpace(value)) {
      setVisibleSites(false);
      setShowInstructions(false);
      setSites([]);
      setTabs([]);
      setOne("");
      setFour("");
      setTwo("");
      setFive("");
      setThree("");
      setSix("");
      setSeven("");
      setValue("");
      setEscape(false);
      setSelectedPage(-1);
    }

    // user hits escape but not in hyperbeam
    if (e.keyCode === 27 && !render) {
      setVisibleSites(false);
      setShowInstructions(false);
      setSites([]);
      setTabs([]);
      setOne("");
      setFour("");
      setTwo("");
      setFive("");
      setThree("");
      setSix("");
      setSeven("");
      setValue("");
      setEscape(false);
      setUnderDomain(false);
      setSelectedPage(-1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (hasWhiteSpace(value) && cursor > -1) {
      setRender(true);
      setHbCursor(0);
      setOne("five");
      setTwo("Go");
      setThree("To Upvote");
      setFour("enter");
      setFive("up");
      setSix("more");
      setSeven("");
    }
  }, [cursor]);

  useEffect(() => {
    setOne("Type any character to begin");
  }, []);

  // load under domain data from supabase based on selected site
  useEffect(() => {
    const run = async () => {
      if (underDomain && sites?.length > 0 && sites[cursor]) {
        setValue("");
        setUnderDomainFilterd([]);
        setUnderDomainData([]);
      }
    };
    run();
  }, [underDomain, sites, cursor]);

  // reset scrolling
  useEffect(() => {
    const el = document.getElementById("search-lines");
    if (el?.scrollTop && selectedPage === -1 && selectedSuggestion === -1) {
      el.scrollTop = 0;
    }
  }, [selectedPage, selectedSuggestion]);

  return (
    <>
      <Nav render={render} />
      <Container data-theme={theme} instructions={showInstructions} visibleSites={visibleSites}>
        <Icons
          loading={sitesLoading}
          sites={sites}
          tabs={tabs}
          data={data}
          handleRender={(id) => handleTabUpdate(id)}
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

        <div className="search">
          {!render && (
            <>
              <form className="input" onSubmit={handleSubmit}>
                {underDomain && sites?.length > 0 ? (
                  <div className="underDomain">
                    <img src={sites[cursor]?.logo} alt={sites[cursor]?.name} />
                  </div>
                ) : (
                  <></>
                  // <BiSearch className="icon" />
                )}
                {escape && (
                  <div className="escape">
                    <AiOutlineCloseCircle />
                    <p>esc</p>
                  </div>
                )}
                <input type="text" value={value} onKeyDown={handleKeyPressed} onChange={handleChange} autoFocus />
              </form>
              {visibleSites ? (
                <>
                  <div className="container" id="search-lines">
                    {underDomainFilterd?.length > 0 || underDomainData?.length > 0 ? (
                      <div className="section">
                        <div className="title">
                          <p>Found</p>
                        </div>
                        <div className="content">
                          {underDomainFilterd.length > 0
                            ? underDomainFilterd.map((site, index) => (
                                <Page page={site} selected={selectedPage === index} />
                              ))
                            : underDomainData.map((page, index) => (
                                <Page page={page} selected={selectedPage === index} />
                              ))}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div>
                      <ShortAnswer query={value} />
                    </div>
                    {suggestionsActive && (
                      <div className="section">
                        <div className="title">
                          <p>Suggestions</p>
                        </div>
                        <div className="content">
                          {suggestions?.length > 0 ? (
                            suggestions
                              .slice(0, 5)
                              .map((suggestion, index) => (
                                <Suggestion
                                  suggestion={suggestion}
                                  key={index}
                                  selected={selectedSuggestion === index}
                                  handleRenderPage={(query) => handleRenderPage(query)}
                                />
                              ))
                          ) : (
                            <div className="para">
                              <p>No suggestions</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="section">
                      <div className="title">
                        <p>Commands</p>
                      </div>
                      <div className="content">
                        {commands.map((command, index) => (
                          <Command
                            command={command}
                            key={command?.id}
                            selected={
                              suggestionsActive
                                ? selectedSuggestion === index + 5
                                : selectedPage === underDomainData.length + index
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
          {showInstructions ? (
            <>
              <Instruction
                one={one}
                two={two}
                three={three}
                four={four}
                render={render}
                icon={five}
                five={five}
                six={six}
                seven={seven}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
      <div
        title="render"
        id="container"
        style={!render ? { height: "0vh", width: "0vw" } : { height: "100%", width: "100%" }}
      />
      <Footer render={render} />
    </>
  );

  function companySuggest(value) {
    // No company search results
    if (value === "") {
      return;
    }

    setSitesLoading(true);

    const query = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${value.toLowerCase()}`;
    axios
      .get(query, {})
      .then((response) => {
        const sites = response.data;
        setSitesLoading(false);
        setSites(
          sites.map((site) => ({
            ...site,
            count: domains.find((d) => d.domain_name === site.domain)?.count || 0,
          }))
        );
      })
      .catch((error) => {
        throw error;
      });
  }
}

const Container = styled.div`
  width: 700px;
  /* height: auto; */
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  position: absolute;
  top: 0;
  left: calc(50% - 650px / 2);

  .logo {
    width: 40px;
    height: 40px;
    display: flex;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 10px;
    left: 10px;
    box-shadow: var(--shadow) 0px 10px 50px;
    z-index: 2;

    img {
      width: 60%;
    }
  }

  .logo:hover + .menu {
    opacity: 1;
    left: 30px;
  }

  .logo:hover ~ .background {
    display: block;
    opacity: 1;
  }

  .menu:hover + .background {
    display: block;
    opacity: 1;
  }

  .menu:hover {
    opacity: 1;
    left: 30px;
  }

  .background {
    width: 100%;
    height: 100%;
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    opacity: 0;
    background: var(--black);
    z-index: 1;
    transition: 0.5s ease-in;
  }

  .menu {
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    position: fixed;
    top: 50px;
    left: 20px;
    padding: 10px 0;
    opacity: 0;
    z-index: 2;
    transition: 0.5s ease-in;

    a {
      line-height: 30px;
      margin: 50px 0 0 0;
      text-decoration: none;
      font-size: 2em;
      font-weight: 700;
      color: var(--white);
    }

    .red {
      color: var(--red);
    }

    a:hover {
      color: var(--red);
    }
  }

  .switch {
    display: inline-block;
    width: 60px;
    height: 34px;
    position: absolute;
    bottom: 5px;
    right: 10px;
    margin: 0 0 30px 0;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--icon);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: var(--white);
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: var(--shadow);
  }

  input:focus + .slider {
    box-shadow: 0 0 1px var(--shadow);
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .search {
    width: 700px;
    height: auto;
    background: var(--black);
    border-radius: 10px;
    box-shadow: var(--shadow) 0px 10px 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0;

    form {
      width: 98%;
      height: 50px;
      border-bottom: ${(props) => (props.instructions ? "1px solid var(--gray)" : "none")};
      display: flex;
      align-items: center;
      position: relative;
      justify-content: center;
      margin: ${(props) => (props.instructions ? "0 0 10px 0" : "0")};

      .icon {
        color: var(--text);
        font-size: 1.5em;
        margin: 10px;
      }

      .escape {
        width: 50px;
        height: 30px;
        display: flex;
        padding: 0 6px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--white);
        border-radius: 5px;
        position: absolute;
        right: 10px;

        p {
          margin: -1px 0 0 0;
        }
      }

      .underDomain {
        width: 10%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        img {
          width: 50%;
        }
      }

      input {
        width: 95%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: var(--white);
        caret-color: var(--red);
      }
    }

    .container {
      width: 100%;
      height: 350px;
      overflow-y: scroll;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      /* width */
      ::-webkit-scrollbar {
        width: 10px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: transparent;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: var(--gray);
        border-radius: 10px;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: var(--icon);
      }
    }

    .section {
      width: 100%;
      height: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .title {
        width: 100%;
        height: 25px;

        p {
          color: var(--text);
          font-weight: 700;
        }
      }

      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        > p {
          width: 100%;
          line-height: 25px;
        }

        .para {
          width: 100%;
          height: 25px;

          p {
            color: var(--text);
            font-weight: 700;
            text-align: center;
          }
        }
      }
    }
  }

  .landing-animation {
    height: 150px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    text-align: center;
    font-size: 28px;
  }

  /* Sine Wave Animation Effect */

  .svg-waves {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 180px;
  }

  @media (max-width: 767px) {
    .svg-waves {
      height: 80px;
    }
  }

  .svg-waves__parallax > use {
    -webkit-animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
  }

  .svg-waves__parallax > use:nth-child(1) {
    -webkit-animation-delay: -2s;
    animation-delay: -2s;
    -webkit-animation-duration: 7s;
    animation-duration: 7s;
    fill: #f4f4f4;
    opacity: 0.4;
  }

  .svg-waves__parallax > use:nth-child(2) {
    -webkit-animation-delay: -3s;
    animation-delay: -3s;
    -webkit-animation-duration: 10s;
    animation-duration: 10s;
    fill: #ededed;
    opacity: 0.4;
  }

  .svg-waves__parallax > use:nth-child(3) {
    -webkit-animation-delay: -4s;
    animation-delay: -4s;
    -webkit-animation-duration: 13s;
    animation-duration: 13s;
    fill: #f2f2f2;
    opacity: 0.4;
  }

  .svg-waves__parallax > use:nth-child(4) {
    -webkit-animation-delay: -5s;
    animation-delay: -5s;
    -webkit-animation-duration: 20s;
    animation-duration: 20s;
    fill: #ececec;
    opacity: 0.4;
  }

  @-webkit-keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }

  @keyframes move-forever {
    0% {
      transform: translate3d(-90px, 0, 0);
    }
    100% {
      transform: translate3d(85px, 0, 0);
    }
  }
`;

export default App;
