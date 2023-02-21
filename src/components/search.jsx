/* eslint-disable jsx-a11y/no-autofocus */
import React from "react";
import styled from "styled-components";

// icons
import { AiOutlineCloseCircle } from "react-icons/ai";

function Search({ underDomain, sites, cursor, value, handleValue, escape }) {
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
    <Container>
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
        <input type="text" value={value} onKeyDown={handleKeyPressed} onChange={handleChange} autoFocus />
      </form>
    </Container>
  );
}

const Container = styled.div``;

export default Search;
