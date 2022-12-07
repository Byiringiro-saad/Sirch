import React from "react";
import styled from "styled-components";

import { BsArrowRight } from "react-icons/bs";

const Two = () => {
  return (
    <Container>
      Press <BsArrowRight className="icon" /> to view search results
    </Container>
  );
};

const Container = styled.div`
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

export default Two;
