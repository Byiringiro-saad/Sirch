import React from "react";
import styled from "styled-components";

import { BiSpaceBar } from "react-icons/bi";

const One = () => {
  return (
    <Container>
      Type word(s) & hit <BiSpaceBar className="icon" /> to Sirch
    </Container>
  );
};

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
