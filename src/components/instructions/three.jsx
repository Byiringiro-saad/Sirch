import React from "react";
import styled from "styled-components";

// import { BsArrowUp } from "react-icons/bs";

function Three() {
  return (
    <Container>
      {/* Press the <BsArrowUp className="icon" /> to upvote */}
      <p className="red_back"> Tap the right arrow key for results</p>
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

export default Three;
