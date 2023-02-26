import React from "react";
import styled from "styled-components";

// icons
import { AiOutlineCloseCircle } from "react-icons/ai";

function Search({ underDomain, sites, cursor, value, handleValue, escape, visibleSites }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    handleValue(e.target.value);
  };

  const handleKeyPressed = (e) => {
    if (e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  return (
    <Container visibleSites={visibleSites}>
      <form className="input" onSubmit={handleSubmit}>
        {underDomain && sites?.length > 0 ? (
          <div className="underDomain">
            <img src={sites[cursor]?.logo} alt={sites[cursor]?.name} />
          </div>
        ) : (
          <div />
        )}
        {escape && (
          <div className="escape">
            <AiOutlineCloseCircle />
            <p>esc</p>
          </div>
        )}
        <input type="text" value={value} onKeyDown={handleKeyPressed} onChange={handleChange} placeholder="Sirch" />
      </form>
    </Container>
  );
}

const Container = styled.div`
  width: 700px;
  height: auto;
  border-radius: 10px;
  margin: 30px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--black);
  border: 1px solid var(--gray);

  form {
    width: 98%;
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;
    margin: ${(props) => (props.instructions ? "0 0 10px 0" : "0")};
    border-bottom: ${(props) => (props.instructions ? "1px solid var(--gray)" : "none")};

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
`;

export default Search;
