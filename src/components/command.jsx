/* eslint-disable react/prop-types */

import React from "react";
import styled from "styled-components";

function Command({ command, selected, colors }) {
  const fieldRef = React.useRef(null);
  if (selected) {
    fieldRef?.current?.scrollIntoView();
  }
  return (
    <Container selected={selected} ref={fieldRef} color={colors?.red}>
      <div className="left">
        <div className="icon">
          <command.icon />
        </div>
        <p>{command?.name}</p>
      </div>
      <div className="right">
        <p>Command</p>
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
      color: var(--black);
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

export default Command;
