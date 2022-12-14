import React from "react";
import styled from "styled-components";

import { BsArrowRight } from "react-icons/bs";

function Two() {
  return (
    <Container>
      Press
      <span>
        <BsArrowRight className="icon" />
      </span>
      to view search results
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

export default Two;
