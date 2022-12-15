/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

import axios from "axios";
import React, { useMemo } from "react";
import styled from "styled-components";
import useLocalStorage from "use-local-storage";
import { debounce } from "lodash";

// icons
import { BiSearch } from "react-icons/bi";
import { CopyIcon, CopiedIcon } from "./icons/icons";

// components
import Icons from "./components/icons";
import Command from "./components/command";
import Suggestion from "./components/suggestion";
import Instruction from "./components/instruction";
import { bingAutoSuggest, getBingSearch } from "./action/bingAction";
import { checkSession, getEmbeddedUrl, loadHyperBeam, renderPage, updateTab } from "./action/hyperBeam";
import { getSavedDomains } from "./action/supabaseAction";
import Page from "./components/page";
import ShortAnswer from "./components/shortAnswer";

function App() {
  // theme data
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  // local data
  const [tabs, setTabs] = React.useState([]);
  const [windowId, setWindowId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [backupValue, setBackupValue] = React.useState("");
  const [sites, setSites] = React.useState([]);
  const [visibleSites, setVisibleSites] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [suggestionsActive, setSuggestionsActive] = React.useState(false);
  const [cursor, setCursor] = React.useState(0);
  const [render, setRender] = React.useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState(-1);
  const [underDomain, setUnderDomain] = React.useState(false);
  const [underDomainData, setUnderDomainData] = React.useState([
    "Home",
    "About Us",
    "Contact Us",
    "Explore",
    "Login",
    "Signup",
  ]);
  const [underDomainFilterd, setUnderDomainFilterd] = React.useState([]);
  const [selectedPage, setSelectedPage] = React.useState(-1);
  const [spaceClicked, setSpaceClicked] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);

  // instructions
  const [one, setOne] = React.useState("");
  const [two, setTwo] = React.useState("");
  const [three, setThree] = React.useState("");
  const [four, setFour] = React.useState("");
  const [five, setFive] = React.useState("");
  const [six, setSix] = React.useState("");
  const [seven, setSeven] = React.useState("");

  // hyperbeam
  const [hb, setHb] = React.useState(null);

  // supabase related state
  const [fetchError, setFetchError] = React.useState(null);
  const [domains, setDomains] = React.useState(null);

  const fetchDomains = async () => {
    const { data, error } = await getSavedDomains();
    if (error) {
      setFetchError("Could not fetch the domains");
      setDomains(null);
      console.error(error);
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

  const [commands] = React.useState([
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

  const handleChange = async (e) => {
    setValue(e.target.value.toLowerCase());

    if (!underDomain) {
      if (e.target.value.length === 0) {
        setSites((site) => []);
        setTabs((tab) => []);
        setVisibleSites(false);
        setOne("Type any character to begin");
        setFour("");
        setTwo("");
        setFive("");
        setThree("");
        setSix("");
        setSeven("");
      }

      if (e.target.value.length > 0) {
        setVisibleSites(true);
        setOne("one");
        setFour("enter");
        setTwo("Go");
        setFive("right");
        setThree("Domains");
        setSix("down");
        setSeven("Pages");
        underDomainSearch(e.target.value);
      }

      if (e.target.value.length > 2) {
        setOne("two");
        setFour("down");
        setTwo("Suggestions & stashed pages");
        setFive("right");
        setThree("Domains");
        setSix("");
        setSeven("");
      }

      if (e.target.value.length === 1) {
        setCursor(0);
      }

      if (!hasWhiteSpace(value)) {
        setCursor(0);
        setSuggestionsActive(false);
      }

      if (hasWhiteSpace(e.target.value)) {
        // changing the instructions
        setTwo("Go");
        setThree("");
        setFour("enter");
        setFive("");
        setOne("two");
        setSix("down");
        setSeven("Suggestions & stashed pages");
        setUnderDomain(false);

        // removing the current icons
        setSites([]);

        // getting suggestions from bing api
        const sug = await bingAutoSuggest(e.target.value);
        setSuggestions(sug);
        debounceFn(e.target.value, hb);
      } else {
        companySuggest(value);
      }
    } else {
      // todo
      const filterd = underDomainData.filter((d) => d.toLowerCase().includes(e.target.value.toLowerCase()));

      setUnderDomainFilterd(filterd);
    }
  };

  React.useEffect(() => {
    if (!hasWhiteSpace(value) && suggestionsActive && selectedSuggestion === -1) {
      setSpaceClicked(false);
      setCursor(0);
      setSuggestionsActive(false);
      setSelectedSuggestion(-1);
    }

    if (hasWhiteSpace(value) && !suggestionsActive && selectedSuggestion === -1) {
      setSpaceClicked(true);
      setCursor(-1);
      setSuggestionsActive(true);
    }

    if (value.length === 0 && !underDomain) {
      setSuggestionsActive(false);
      setSelectedSuggestion(-1);
      setSites([]);
    }

    if (value.length === 0 && suggestionsActive) {
      setSites([]);
    }
  }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleTabUpdate = async (id) => {
    await updateTab(hb, id);
  };

  React.useEffect(() => {
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
                console.error(err);
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
              console.error(err);
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
            console.error(err);
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
    if (e.keyCode === 40 && suggestionsActive && selectedSuggestion >= 0 && selectedSuggestion < 4) {
      setValue(suggestions[selectedSuggestion + 1]?.displayText);
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsActive && selectedSuggestion > 0) {
      setValue(suggestions[selectedSuggestion - 1]?.displayText);
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

    // For pages
    // Down
    if (e.keyCode === 40 && !underDomain && selectedPage === -1 && !suggestionsActive) {
      setBackupValue(value);
      setValue("");
      setSelectedPage(0);
      setUnderDomain(true);
    }

    // Down
    if (e.keyCode === 40 && underDomain && selectedPage >= 0) {
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

    // Enter
    if (e.keyCode === 13 && cursor > -1 && !render) {
      console.log("here");
      window.open(`https://${sites[cursor]?.domain}`, "__blank");
    }

    // user hits any character apart from arrow keys when in hyperbeam
    if (render && (e.keyCode !== 40 || e.keyCode !== 38 || e.keyCode !== 37 || e.keyCode !== 39)) {
      setRender(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  React.useEffect(() => {
    if (hasWhiteSpace(value) && cursor > -1) {
      setRender(true);
      setOne("three");
      setTwo("");
      setThree("More results");
      setFour("");
      setFive("right");
      setSix("");
      setSeven("");
    }
  }, [cursor]);

  React.useEffect(() => {
    setOne("Type any character to begin");
  }, []);

  return (
    <>
      <Container data-theme={theme} instructions={showInstructions}>
        <div className="logo">
          <img src="/logo.png" alt="Sirch" />
        </div>
        <div className="menu">
          <a href="#" target="_blank">
            Get Sirch for Chrome
          </a>
          <a href="#" target="_blank">
            The death of Google
          </a>
          <a href="#" target="_blank">
            Twitter fun
          </a>
          <a href="#" target="_blank">
            Linkedin
          </a>
          <a href="#" target="_blank">
            Sirch Cash & Ads
          </a>
          <a href="#" target="_blank">
            Talk to us
          </a>
        </div>
        {/* <label className="switch">
					<input type="checkbox" />
					<span className="slider round" onClick={switchTheme}></span>
				</label> */}
        <Icons
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
                <input type="text" value={value} onKeyDown={handleKeyPressed} onChange={handleChange} autoFocus />
              </form>
              {visibleSites ? (
                <>
                  <div className="container">
                    {underDomain ? (
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
                        {commands.map((command) => (
                          <Command command={command} key={command?.id} />
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
        {visibleSites ? (
          <></>
        ) : (
          <div className="animation">
            <div className="landing-animation">
              <div className="sine-wave">
                <svg
                  className="svg-waves"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 24 150 28"
                  preserveAspectRatio="none"
                  shapeRendering="auto"
                >
                  <defs>
                    <path
                      id="gentle-wave"
                      d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                  </defs>
                  <g className="svg-waves__parallax">
                    <use xlinkHref="#gentle-wave" x="48" y="0" />
                    <use xlinkHref="#gentle-wave" x="48" y="3" />
                    <use xlinkHref="#gentle-wave" x="48" y="5" />
                    <use xlinkHref="#gentle-wave" x="48" y="7" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        )}
      </Container>
      <div
        title="render"
        id="container"
        style={!render ? { height: "0vh", width: "0vw" } : { height: "100%", width: "100%" }}
      />
    </>
  );

  function companySuggest(value) {
    axios
      .get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${value.toLowerCase()}`, {})
      .then((response) => {
        const sites = response.data;
        setSites(
          sites.map((site) => ({
            ...site,
            count: domains.find((d) => d.domain_name === site.domain)?.count || 0,
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

const Container = styled.div`
  width: 650px;
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

    img {
      width: 60%;
    }
  }

  .logo:hover + .menu {
    display: flex;
  }

  .menu:hover {
    display: flex;
  }

  .menu {
    width: 300px;
    height: auto;
    display: none;
    flex-direction: column;
    align-items: flex-start;
    position: fixed;
    top: 50px;
    left: 30px;
    padding: 10px 0;

    a {
      line-height: 30px;
      text-decoration: none;
      font-size: 1.2em;
      color: var(--white);
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
    width: 650px;
    height: auto;
    background: var(--black);
    margin: 30px 0;
    border-radius: 10px;
    /* border: 3px solid var(--gray); */
    box-shadow: var(--shadow) 0px 10px 50px;
    display: flex;
    flex-direction: column;
    align-items: center;

    form {
      width: 98%;
      height: 50px;
      border-bottom: ${(props) => (props.instructions ? "1px solid var(--gray)" : "none")};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: ${(props) => (props.instructions ? "0 0 10px 0" : "0")};

      .icon {
        color: var(--text);
        font-size: 1.5em;
        margin: 10px;
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
  }

  .svg-waves__parallax > use:nth-child(2) {
    -webkit-animation-delay: -3s;
    animation-delay: -3s;
    -webkit-animation-duration: 10s;
    animation-duration: 10s;
    fill: #ededed;
  }

  .svg-waves__parallax > use:nth-child(3) {
    -webkit-animation-delay: -4s;
    animation-delay: -4s;
    -webkit-animation-duration: 13s;
    animation-duration: 13s;
    fill: #f2f2f2;
  }

  .svg-waves__parallax > use:nth-child(4) {
    -webkit-animation-delay: -5s;
    animation-delay: -5s;
    -webkit-animation-duration: 20s;
    animation-duration: 20s;
    fill: #ececec;
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
