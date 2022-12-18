import React from "react";
import styled from "styled-components";

import { BiSpaceBar } from "react-icons/bi";

function One() {
  return (
    <Container>
      Hit <BiSpaceBar className="icon" /> to search the web
    </Container>
  );
}

const Container = styled.p`
  color: var(--white);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    background: var(--icon);
    color: var(--white);
    padding: 5px;
    font-size: 2em;
    border-radius: 2px;
    margin: 0 10px;
  }
`;

export default One;
