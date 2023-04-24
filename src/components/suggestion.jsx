/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import styled from "styled-components";

function Suggestion({ suggestion, selected, handleRenderPage, colors }) {
  const fieldRef = React.useRef(null);
  if (selected) {
    fieldRef?.current?.scrollIntoView();
  }
  return (
    <Container selected={selected} ref={fieldRef} color={colors?.blue}>
      <div className="left" onClick={() => handleRenderPage(suggestion.url)}>
        <div className="icon">{/* <suggestion.icon /> */}</div>
        <p>{suggestion?.displayText}</p>
      </div>
      <div className="right">
        <p>Google SERP</p>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 5px 0;
  border-radius: 10px;
  background: ${(props) => (props.selected ? `${props.color?.gray}` : "")};

  .left {
    display: flex;
    flex-direction: row;
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      padding: 5px;
      margin: 0 10px 0 0;
      border-radius: 5px;
      cursor: pointer;
      background: var(--white);
      background: ${(props) => `${props.color?.dark}`};
    }

    p {
      color: ${(props) => `${props.color?.dark}`};
      text-transform: capitalize;
      cursor: pointer;
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    p {
      color: ${(props) => `${props.color?.dark}`};
      cursor: pointer;
    }
  }

  :hover {
    background: ${(props) => `${props.color?.gray}`};
  }
`;

export default Suggestion;
