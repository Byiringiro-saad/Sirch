import React from "react";
import styled from "styled-components";

function One() {
  return (
    <Container>
      {/* Hit <span>Space</span> to search the web */}
      <p className="red_back"> Keep typing to Sirch the web </p>
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

  span {
    padding: 5px 15px;
    margin: 0 5px;
    border-radius: 4px;
    background: var(--red);
    color: var(--black);
  }
  .red_back {
    background: red;
    color: #fff;
    padding: 5px;
    font-size: 1.2em;
    border-radius: 5px;
    margin: 0px;
    font-weight: 600;
  }
`;

export default One;
