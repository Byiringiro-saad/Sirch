import React from "react";
import styled from "styled-components";

function Five() {
  return (
    <Container>
      Press <span>Esc</span> to search again
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

  span {
    background: var(--icon);
    color: var(--white);
    padding: 5px;
    font-size: 0.8em;
    border-radius: 2px;
    margin: 0 10px;
  }
`;

export default Five;
