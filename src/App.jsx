/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */

import axios from "axios";
import { debounce } from "lodash";
import styled from "styled-components";
import React, { useState, useMemo, useEffect } from "react";

// Icons
import { CopiedIcon, CopyIcon } from "./icons/icons";

// components
import Nav from "./components/nav";
import Search from "./components/search";
import Footer from "./components/footer";
import Content from "./components/icons/content";
import ShortAnswer from "./components/shortAnswer";
import Commands from "./components/commands/commands";
import UnderDomain from "./components/underDomain/underDomain";
import Suggestions from "./components/suggestions/suggestions";
import Instruction from "./components/instructions/instruction";

// Actions
import { getSavedDomains } from "./action/supabaseAction";
import { getBingSearch, bingAutoSuggest } from "./action/bingAction";
import { renderPage, updateTab, checkSession, getEmbeddedUrl, loadHyperBeam } from "./action/hyperBeam";

function App() {
  // Local data
  const [windowId, setWindowId] = useState(null);

  // Search
  const [value, setValue] = useState("");
  const [escape, setEscape] = useState(false);
  const [backupValue, setBackupValue] = useState("");

  // Sites
  const [tabs, setTabs] = useState([]);
  const [sites, setSites] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const [domains, setDomains] = useState(null);
  const [visibleSites, setVisibleSites] = useState(false);

  // Hyperbeam
  const [hb, setHb] = useState(null);
  const [data, setData] = useState({});
  const [render, setRender] = useState(false);
  const [hbCursor, setHbCursor] = useState(-1);

  // UnderDomain
  const [selectedPage, setSelectedPage] = useState(-1);
  const [underDomainData, setUnderDomainData] = useState({});
  const [underDomainFilterd, setUnderDomainFilterd] = useState([]);
  const [underDomainVisible, setUnderDomainVisible] = useState(false);

  // Suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // Commands
  const [commands, setCommands] = useState([]);

  // Instructions
  const [one, setOne] = useState("");
  const [two, setTwo] = useState("");
  const [three, setThree] = useState("");
  const [four, setFour] = useState("");
  const [five, setFive] = useState("");
  const [six, setSix] = useState("");
  const [seven, setSeven] = useState("");
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  // Functions
  const hasWhiteSpace = (s) => /\s/g.test(s);

  const underDomainSearch = () => {
    // not yet implemented, store data in underDomainData
  };

  const handleRender = async (id) => {
    await updateTab(hb, id);
  };

  const handleSites = (arr) => {
    setSites(arr);
  };

  const handleRenderPage = async (v) => {
    const datas = await getBingSearch(v);
    setData(datas);
    let tabs;
    if (hb) {
      tabs = await renderPage(hb, datas, windowId);
      if (tabs.length) {
        setTabs(tabs);
        if (windowId !== tabs[0].windowId) {
          setWindowId(tabs[0].windowId);
        }
      }
    }
  };

  const debounceFn = useMemo(() => debounce(handleRenderPage, 1000), [hb]);

  const companySuggest = (text) => {
    if (text === "") {
      return;
    }
    const query = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${text.toLowerCase()}`;
    axios
      .get(query, {})
      .then((response) => {
        setSites(
          response.data.map((site) => ({
            ...site,
            count: domains.find((d) => d.domain_name === site.domain)?.count || 0,
          }))
        );
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchDomains = async () => {
    const { datas, error } = await getSavedDomains();
    if (error) {
      setDomains(null);
      throw error;
    }

    if (datas) {
      setDomains(datas);
    }
  };

  const handleValue = async (text) => {
    setValue(text);

    if (!underDomainVisible) {
      if (text.length === 0) {
        setVisibleSites(false);
        setInstructionsVisible(false);
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

      if (text.length > 0) {
        setVisibleSites(true);
        setInstructionsVisible(true);
        setOne("one");
        setFour("enter");
        setTwo("Go");
        setFive("right");
        setThree("Domains");
        setSix("down");
        setSeven("Pages");
        underDomainSearch(text);
      }

      // if (text.length > 2) {
      //   setOne("two");
      //   setFour("down");
      //   setTwo("Suggestions & stashed pages");
      //   setFive("right");
      //   setThree("Domains");
      //   setSix("");
      //   setSeven("");
      // }

      if (text.length === 1) {
        setCursor(0);
      }

      if (!hasWhiteSpace(value)) {
        setCursor(0);
        setSuggestionsVisible(false);
        setEscape(false);
      }

      if (hasWhiteSpace(text)) {
        // changing the instructions
        setTwo("Google SERP");
        setThree("");
        setFour("enter");
        setFive("");
        setOne("three");
        setSix("more");
        setSeven("");
        setUnderDomainVisible(false);
        setEscape(true);

        // removing the current icons
        setSites([]);

        // getting suggestions from bing api
        const sug = await bingAutoSuggest(text);
        setSuggestions(sug);
        debounceFn(text, hb);
      } else {
        companySuggest(value);
      }
    } else {
      // todo
      const filterd = underDomainData.filter((d) => d.toLowerCase().includes(text.toLowerCase()));
      setUnderDomainFilterd(filterd);
    }
  };

  const handleKeyDown = (e) => {
    // For suggestions
    // Down
    if (e.keyCode === 40 && suggestionsVisible && selectedSuggestion === -1) {
      setBackupValue(value);
      setValue(suggestions[selectedSuggestion + 1]?.displayText);
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Down
    if (e.keyCode === 40 && suggestionsVisible && selectedSuggestion >= 0 && selectedSuggestion < 7) {
      if (selectedSuggestion !== 4 && selectedSuggestion !== 5 && selectedSuggestion !== 6) {
        setValue(suggestions[selectedSuggestion + 1]?.displayText);
      }
      setSelectedSuggestion(selectedSuggestion + 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsVisible && selectedSuggestion > 0) {
      if (selectedSuggestion !== 5 && selectedSuggestion !== 6 && selectedSuggestion !== 7) {
        setValue(suggestions[selectedSuggestion - 1]?.displayText);
      }
      setSelectedSuggestion(selectedSuggestion - 1);
    }

    // Up
    if (e.keyCode === 38 && suggestionsVisible && selectedSuggestion === 0) {
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
    // Down
    if (e.keyCode === 40 && !underDomainVisible && selectedPage === -1 && !suggestionsVisible) {
      setBackupValue(value);
      setValue("");
      setSelectedPage(0);
      setUnderDomainVisible(true);
    }

    // Down
    if (e.keyCode === 40 && underDomainVisible && selectedPage >= 0 && selectedPage <= underDomainData.length + 1) {
      setSelectedPage(selectedPage + 1);
    }

    // Up
    if (e.keyCode === 38 && underDomainVisible && selectedPage >= 0) {
      setSelectedPage(selectedPage - 1);
    }

    // Up
    if (e.keyCode === 38 && underDomainVisible && selectedPage === 0) {
      setValue(backupValue);
      setBackupValue("");
      setSelectedPage(-1);
      setUnderDomainVisible(false);
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
      setInstructionsVisible(false);
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
    }

    // user hits escape but not in hyperbeam
    if (e.keyCode === 27 && !render) {
      setVisibleSites(false);
      setInstructionsVisible(false);
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
    }
  };

  // UseEffects
  useEffect(() => {
    setOne("Type any character to begin");
    setUnderDomainData(["Home", "About Us", "Contact Us", "Explore", "Login", "Signup"]);
    setCommands([
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
  }, []);

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
    if (!hasWhiteSpace(value) && suggestionsVisible && selectedSuggestion === -1) {
      setCursor(0);
      setSuggestionsVisible(false);
      setSelectedSuggestion(-1);
      setEscape(false);
    }

    if (hasWhiteSpace(value) && !suggestionsVisible && selectedSuggestion === -1) {
      setCursor(-1);
      setSuggestionsVisible(true);
    }

    if (value.length === 0 && !underDomainVisible) {
      setSuggestionsVisible(false);
      setSelectedSuggestion(-1);
      setSites([]);
      setEscape(false);
    }

    if (value.length === 0 && suggestionsVisible) {
      setSites([]);
      setEscape(false);
    }
  }, [value]);

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

  return (
    <>
      <Container>
        <div className="nav">
          <Nav />
        </div>
        <div className="content">
          <Content
            hb={hb}
            tabs={tabs}
            data={data}
            sites={sites}
            render={render}
            cursor={cursor}
            domains={domains}
            setCursor={setCursor}
            setDomains={setDomains}
            handleSites={handleSites}
            handleRender={handleRender}
            visibleSites={visibleSites}
            underDomain={underDomainVisible}
          />
          {!render && (
            <div className="search">
              <Search
                sites={sites}
                value={value}
                cursor={cursor}
                escape={escape}
                visibleSites={visibleSites}
                handleValue={handleValue}
                underDomain={underDomainVisible}
              />
              {visibleSites && (
                <>
                  <ShortAnswer query={value} />
                  <div className="container">
                    {underDomainVisible && (
                      <UnderDomain
                        selectedPage={selectedPage}
                        underDomainData={underDomainData}
                        underDomainFilterd={underDomainFilterd}
                      />
                    )}
                    {suggestionsVisible && <Suggestions />}
                    <Commands
                      commands={commands}
                      selectedPage={selectedPage}
                      underDomainData={underDomainData}
                      suggestionsVisible={suggestionsVisible}
                      selectedSuggestion={selectedSuggestion}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {instructionsVisible && (
            <Instruction
              one={one}
              two={two}
              six={six}
              four={four}
              icon={five}
              five={five}
              three={three}
              seven={seven}
              render={render}
            />
          )}
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Container>
      <div
        title="render"
        id="container"
        style={!render ? { height: "0vh", width: "0vw" } : { height: "100%", width: "100%" }}
      />
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .container {
    width: 700px;
    height: auto;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 30px 20px;
    border-radius: 5px;
    border: 1px solid var(--gray);

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
`;

export default App;
