import React from "react";
import styled from "styled-components";

import { BsArrowRight } from "react-icons/bs";

function Four() {
  return (
    <Container>
      More results
      <BsArrowRight className="icon" style={{ background: "var(--red)", color: "var(--black)" }} />
    </Container>
  );
}

const Container = styled.div`
  color: var(--white);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    background: var(--red);
    color: var(--black);
    padding: 5px;
    font-size: 2em;
    border-radius: 2px;
    margin: 0 10px;
  }
`;

export default Four;
