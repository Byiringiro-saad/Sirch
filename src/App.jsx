/* eslint-disable no-nested-ternary */
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
// import { debounce } from "lodash";

// icons
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CopyIcon, CopiedIcon } from "./icons/icons";

// utils
import { getSavedDomains, getUnderDomainsByDomain } from "./action/supabaseAction";
import { bingAutoSuggest, getBingSearch } from "./action/bingAction";
import { checkSession, getEmbeddedUrl, loadHyperBeam, renderPage, updateTab } from "./action/hyperBeam";

// portals
// import EmailPortal from "./portals/email";

// components
import Nav from "./components/nav";
import Page from "./components/page";
import Icons from "./components/icons";
import Footer from "./components/footer";
import ShortansIcon from "./components/shortansIcon";
import Command from "./components/command";
import Suggestion from "./components/suggestion";
import Instruction from "./components/instruction";
import ShortAnswer from "./components/shortAnswer";

// invest
import One from "./components/invest/one";
import Two from "./components/invest/two";
import Three from "./components/invest/three";
import Enter from "./components/popup/enter";

function App() {

  const shortAnswerKey = process?.env?.REACT_APP_SHORT_ANS_OPENAI_API_KEY;

  // theme data
  const defaultDark = window?.matchMedia("(prefers-color-scheme: dark)")?.matches;
  const [theme, setTheme] = useLocalStorage("theme", defaultDark ? "dark" : "light");

  // local data
  const colors = {
    blue: {
      main: "#183dff",
      dark: "#343e6f",
      gray: "#c4ceff",
    },
    red: {
      main: "#ff0909",
      dark: "#6f3434",
      gray: "#ffc4c4",
    },
  };
  const [showVideo, setShowVideo] = useState(false);
  const [showEnter, setShowEnter] = useState(false);
  const [showInvestOne, setShowInvestOne] = useState(false);
  const [showInvestTwo, setShowInvestTwo] = useState(false);
  const [showInvestThree, setShowInvestThree] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [windowId, setWindowId] = useState(null);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [isAnsSelect, setAnswSelect] = useState(false);
  const [isAnsPressEnt, setIsAnsPressEnt] = useState(false);
  const [backupValue, setBackupValue] = useState("");
  const [sites, setSites] = useState([]);
  const [visibleSites, setVisibleSites] = useState(false);
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [askEmail, setAskEmail] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(false);
  const flg = ["Answer", "Suggestions"];
  const [ans, setAns] = useState([{ displayText: "Generating answer...", type: "Answer", ansData: "" }]);

  const [allData, setAllData] = useState([]);
  const [commands] = useState([
    {
      id: 1,
      name: "Clipboard History",
      icon: CopyIcon,
      type: "Commands",
    },
    {
      id: 2,
      name: "Import extension",
      icon: CopiedIcon,
      type: "Commands",
    },
    {
      id: 3,
      name: "Manage extension",
      icon: CopiedIcon,
      type: "Commands",
    },
  ]);
  const [indexHyperbeamSlice, setIndexHyperbeamSlice] = useState(0);

  const debounceTimeMs = 2000;
  const fieldRef = React.useRef(null);
  const [queryResult, setQueryResult] = useState("");

  const [loading, setLoading] = useState(false);

  const notice =
    "The user will input a search query. Your job is to pretend to be a relevant expert, and to provide an answer in seven words or less. ";

  const getShortAnsResults = async (value) => {
    setLoading(true);
    const data = await axios.post(`https://us-east4-banded-water-377216.cloudfunctions.net/api-chatgpt-shortanswer`, {
      query: value,
    });
    setLoading(false);
    setSitesLoading(false);
    return [{ displayText: data?.data?.message?.content, type: "Answer", ansData: data?.data?.message }];
  };
  const getSubData = async (value) => {
    const subData = await axios.post("https://us-east4-banded-water-377216.cloudfunctions.net/api-chatgpt-questions", {
      query: value,
    });
    // console.log("isAnsPressEnt", subData?.data);
    const top5 = [];
    subData?.data.forEach((ele) => {
      top5.push({
        displayText: ele,
        query: ele,
        searchKind: "WebSearch",
        type: "Suggestions",
        url: "",
      });
    });
    // console.log("top5", top5);
    setAllData([...ans, ...top5, ...commands]);
  };

  // instructions
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [four, setFour] = useState("");
  const [five, setFive] = useState("");
  const [six, setSix] = useState("");
  const [seven, setSeven] = useState("");
  const [eight, setEight] = useState("");

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

  const closeInvest = () => {
    setShowInvestOne(false);
    setShowInvestTwo(false);
    setShowInvestThree(false);
  };

  const handleShowInvest = (part) => {
    if (part === "one") {
      setShowInvestOne(true);
      setShowInvestTwo(false);
      setShowInvestThree(false);
    } else if (part === "two") {
      setShowInvestTwo(true);
      setShowInvestOne(false);
      setShowInvestThree(false);
    } else if (part === "three") {
      setShowInvestThree(true);
      setShowInvestOne(false);
      setShowInvestTwo(false);
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
    setSelectedSuggestion(-1);
    if (!underDomain) {
      if (e.target.value?.length === 0) {
        setVisibleSites(false);
        setShowInstructions(false);
        setShowVideo(false);
        setSitesLoading(false);
        setSites([]);
        setTabs([]);
        setOne("");
        setFour("");
        setTwo("");
        setFive("");
        setThree("");
        setSix("");
        setSeven("");
        setAllData([]);
        setAns([]);
      }

      if (e.target.value?.length > 0) {
        setVisibleSites(true);
        setShowInstructions(true);
        setShowVideo(false);
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
        setSitesLoading(false);
        setAllData([]);
        setAns([]);
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

        setSitesLoading(true);

        // timeout staffs
        clearTimeout();
        setTimeout(async () => {
          // removing the current icons
          setSites([]);

          // getting suggestions from bing api
          const sug = await bingAutoSuggest(e.target.value);
          // setSuggestions(sug);

          const top5 = sug.slice(0, 5).map((ele) => {
            Object.assign(ele, { type: "Suggestions" });
            return ele;
          });

          const ansData = await getShortAnsResults(value);
          setAns(ansData);
          setAllData([...ansData, ...top5, ...commands]);
          // debounceHandleRenderPage(e.target.value, hb);
          const data = await getBingSearch(value);
          setData(data);
          await handleRenderPage(data);
        }, 2000);
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

  const setIndexHyperbeamSliceFn = (r) => {
    // console.log("setIndexHyperbeamSliceFn", r);
    setIndexHyperbeamSlice(r);
  };

  const handleRenderPage = async (data) => {
    // console.log(" indexHyperbeamSlice", indexHyperbeamSlice);
    // console.log(" renderPage data", data.slice(0, indexHyperbeamSlice + 5));
    let tabs;
    if (hb) {
      tabs = await renderPage(hb, data.slice(0, indexHyperbeamSlice + 5), windowId);
      if (tabs.length) {
        setTabs(tabs);
        setSitesLoading(false);
        if (windowId !== tabs[0].windowId) {
          setWindowId(tabs[0].windowId);
        }
      }
    }
  };

  // const debounceHandleRenderPage = useMemo(() => debounce(handleRenderPage, 1000), [hb]);

  useEffect(() => {
    // console.log("value", value);
    handleRenderPage(data);
  }, [indexHyperbeamSlice]);

  const handleShowEnter = () => {
    setShowEnter(!showEnter);
  };

  const handleKeyDown = (e) => {
    // For suggestions
    // Down
    let downUp = 0;
    if (e.keyCode === 40 && suggestionsActive && selectedSuggestion <= -1) {
      setBackupValue(value);
      downUp = 0;
      if (allData[0].type === "Suggestions") {
        setValue(allData[0]?.displayText);
      }
      setSelectedSuggestion(0);
    }

    // Down
    if (e.keyCode === 40 && suggestionsActive && selectedSuggestion >= 0 && selectedSuggestion < allData.length - 1) {
      // console.log("allData[selectedSuggestion + ÷1]", selectedSuggestion, allData[selectedSuggestion + 1].type);
      downUp = selectedSuggestion + 1;
      if (allData[selectedSuggestion + 1].type === "Suggestions") {
        setValue(allData[selectedSuggestion + 1]?.displayText);
      }
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsActive) {
      downUp = selectedSuggestion - 1;
      if (allData[selectedSuggestion - 1]?.type === "Suggestions") {
        setValue(allData[selectedSuggestion - 1]?.displayText);
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
    if (allData[downUp]?.type !== "Answer" && e.keyCode === 13 && selectedSuggestion > -1 && !render) {
      const domain = allData[selectedSuggestion]?.url.replace("bing.com", "google.com");
      window.open(`${domain}`, "__blank");
    }

    // Enter
    if (allData[downUp]?.type !== "Answer" && e.keyCode === 13 && selectedSuggestion === -1 && !render) {
      // const query = value.replace(/\s/g, "+");
      // const domain = `https://www.google.com/search?q=${query}`;
      // window.open(`${domain}`, "__blank");
      setShowEnter(true);
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
    if (e.keyCode === 40 && !underDomain && selectedPage <= -1 && !suggestionsActive) {
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
    if (allData[downUp]?.type !== "Answer" && e.keyCode === 13 && cursor > -1 && !render) {
      window.open(`https://${sites[cursor]?.domain}`, "__blank");
    }

    // Enter when in hyperbeam
    if (allData[downUp]?.type !== "Answer" && e.keyCode === 13 && cursor > -1 && render) {
      window.open(`${tabs[hbCursor]?.pendingUrl}`, "__blank");
    }

    if (allData[downUp]?.type === "Answer") {
      setIsAnsPressEnt(e.keyCode);
      if (e.keyCode === 39 || e.keyCode === 37) {
        getShortAnsResults(value);
      }
      if (e.keyCode === 13) {
        getSubData(allData[downUp]?.displayText);
      }
      if (e.keyCode === 38 || e.keyCode === 40) {
        setAnswSelect(true);
      }
      setEight("eight");
    } else {
      setEight(false);
      setAnswSelect(false);
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
      setAllData([]);
      setAns([]);
    }
    // if ((e.keyCode === 40 || e.keyCode === 38) && allData[selectedSuggestion]?.type === "Answer") {
    //   setTwo("Bhavesh Test");
    // } else {
    //   setTwo("");
    // }
    // user hits escape but not in hyperbeam
    if (e.keyCode === 27 && !render && hasWhiteSpace(value)) {
      setVisibleSites(false);
      setShowInstructions(false);
      setShowVideo(false);
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
      setAllData([]);
      setAns([]);
    }

    // user hits escape but not in hyperbeam
    if (e.keyCode === 27 && !render) {
      setVisibleSites(false);
      setShowInstructions(false);
      setShowVideo(false);
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
      setAllData([]);
      setAns([]);
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
    if (selectedPage > 0) {
      setSelectedPage(0);
    }
  }, [underDomain, sites, cursor]);

  // reset scrolling
  useEffect(() => {
    const el = document.getElementById("search-lines");
    if (el?.scrollTop && selectedPage === -1 && selectedSuggestion === -1) {
      el.scrollTop = 0;
    }
  }, [selectedPage, selectedSuggestion]);

  const ansDetails = (type, data, index) => {
    let returnData = "";

    if (type === "Answer" && data.type === "Answer") {
      returnData = loading ? (
        // <AiOutlineLoading />
        <p>Generating answer...</p>
      ) : (
        <ShortAnswer query={value} ans={data} selected={selectedSuggestion === index} />
      );
    } else if (type === "Suggestions" && data.type === "Suggestions") {
      returnData = (
        <Suggestion
          suggestion={data}
          key={index}
          selected={selectedSuggestion === index}
          colors={selectedSuggestion < 6 && selectedSuggestion > 0 ? colors : {}}
          // handleRenderPage={(query) => handleRenderPage(query)}
        />
      );
    } else if (type === "Commands" && data.type === "Commands") {
      returnData = (
        <Command
          command={data}
          key={data?.id}
          colors={selectedSuggestion > 5 ? colors : {}}
          selected={suggestionsActive ? selectedSuggestion === index : selectedPage === underDomainData.length + index}
        />
      );
    } else {
      returnData = null;
    }
    return returnData;
  };

  return (
    <>
      {showInvestThree && <Three close={closeInvest} />}
      {showInvestTwo && <Two next={handleShowInvest} close={closeInvest} />}
      {showInvestOne && <One next={handleShowInvest} close={closeInvest} />}
      {showEnter && <Enter handleShow={handleShowEnter} />}
      <Nav render={render} buyCash={handleShowInvest} />
      <Container data-theme={theme} instructions={showInstructions} visibleSites={visibleSites}>
        {isAnsSelect ? (
          <ShortansIcon
            loading={sitesLoading}
            visibleSites={visibleSites}
            render={render}
            data={ans[0]?.ansData}
            isAnsPressEnt={isAnsPressEnt}
          />
        ) : (
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
            setIndexHyperbeamSlice={setIndexHyperbeamSliceFn}
          />
        )}

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
                    {/* Will show for Answer, Suggestions and Commands */}
                    {flg?.length > 0
                      ? flg.map((type, index) => (
                          <div className="section" key={index}>
                            <div className="title">
                              <Para type={type}>{type}</Para>
                            </div>
                            <div className="content">{allData.map((data, index) => ansDetails(type, data, index))}</div>
                          </div>
                        ))
                      : null}
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
                eight={eight}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        {showVideo && (
          <div className="video">
            <iframe
              width="100%"
              height="100%"
              src="https://res.cloudinary.com/f-studios/video/upload/v1680937885/Sirch/Homepage_video_qkykkk.mp4"
              title="Explanation"
            />
          </div>
        )}
      </Container>
      <div
        title="render"
        id="container"
        style={!render ? { height: "0vh", width: "0vw" } : { height: "100%", width: "100%" }}
      />
      {/* <Footer render={render} /> */}
    </>
  );

  function companySuggest(value) {
    // No company search results
    if (value === "") {
      return;
    }

    const query = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${value.toLowerCase()}`;
    axios
      .get(query, {})
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
        throw error;
      });
  }
}

const Para = styled.p`
  color: var(--dark);
`;

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

  .video {
    width: 100%;
    height: 450px;
    overflow: hidden;
    border-radius: 10px;
    border: none;

    iframe {
      border: none;
    }
  }

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
