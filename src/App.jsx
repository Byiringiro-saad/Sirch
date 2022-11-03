import React from "react";
import styled from "styled-components";
import useLocalStorage from "use-local-storage";
import { useDispatch, useSelector } from "react-redux";

//icons
import { BiSearch } from "react-icons/bi";
import { BsArrowRight, BsArrowDown } from "react-icons/bs";

//components
import Sites from "./components/sites";
import Command from "./components/command";
import Suggestion from "./components/suggestion";
import Instruction from "./components/instruction";
import { getSitesAsync } from "./store/reducers/icons";
import { getSuggestionsAsync } from "./store/reducers/suggestions";

//data
import { CopyIcon, CopiedIcon } from "./data/icons";

function App() {
  //for theme
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  //configs
  const dispatch = useDispatch();

  //local data
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const sites = useSelector((state) => state.sites.sites);
  const [underDomain, setUnderDomain] = React.useState(false);
  const suggestions = useSelector((state) => state.suggestions.suggestions);
  const selected = useSelector((state) => state.sites.selected);
  const [suggestionsActive, setSuggestionsActive] = React.useState(false);

  //instructions
  const [one, setOne] = React.useState("");
  const [two, setTwo] = React.useState("");
  const [three, setThree] = React.useState("");
  const [five, setFive] = React.useState("");

  const [commands, setCommands] = React.useState([
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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleInput = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    if (!underDomain && e.target.value.length > 0) {
      setLoading(true);
      dispatch(getSitesAsync({ key: `${e.target.value}` }));
      setLoading(false);

      if (e.nativeEvent.data === " ") {
        setTwo("Google SERP");
        setThree("Results");
        setFive("right");
      } else if (e.target.value.length > 0) {
        setTwo("Go to domain");
        setThree("Pages");
        setFive("down");
      } else {
        setOne("Sirch the web");
        setTwo("Save current page");
        setThree("Suggestions");
        setFive("right");
      }
    } else {
      setSuggestionsActive(true);
      dispatch(getSuggestionsAsync({ key: `${e.target.value}` }));
    }
  };

  const handleKeyDown = (e) => {
    if (sites?.length > 0 && e.keyCode === 40) {
      setUnderDomain(true);
      setSuggestionsActive(true);
      setValue("");
    }

    if (e.keyCode === 38) {
      setUnderDomain(false);
      setSuggestionsActive(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  React.useEffect(() => {
    setOne("Sirch the web");
    setTwo("Save current page");
    setThree("Suggestions");
    setFive("right");
  }, []);

  React.useEffect(() => {
    if (sites.length === 0 && value.length === 0) {
      setLoading(false);
      setUnderDomain(false);
    }
  }, [sites, value.length]);

  const handleOne = (text) => {
    setOne(text);
  };

  const handleSuggestions = () => {
    setSuggestionsActive(false);
  };

  return (
    <Container data-theme={theme}>
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round" onClick={switchTheme}></span>
      </label>
      <Sites
        sites={sites}
        loading={loading}
        underDomain={underDomain}
        handleOne={handleOne}
        handleSuggestions={handleSuggestions}
      />
      <div className="search">
        <form className="input">
          {underDomain && sites?.length > 0 ? (
            <div className="underDomain">
              <img src={selected?.logo} alt={selected?.name} />
            </div>
          ) : (
            <BiSearch className="icon" />
          )}
          <input
            type="text"
            placeholder="Search here...."
            value={value}
            onKeyDown={handleInput}
            onChange={handleChange}
          />
        </form>
        {suggestionsActive && (
          <div className="section">
            <div className="title">
              <p>Suggestions</p>
            </div>
            <div className="content">
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <Suggestion suggestion={suggestion} key={suggestion?.id} />
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
        <Instruction one={one} two={two} three={three} icon={five}>
          {five === "right" ? (
            <BsArrowRight className="icon" />
          ) : (
            <BsArrowDown className="icon" />
          )}
        </Instruction>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  /* padding: 50px 0; */
  /* background: var(--black); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  .switch {
    /* position: relative; */
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
      border-bottom: 1px solid var(--gray);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 10px 0;

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
          width: 60%;
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
`;

export default App;
