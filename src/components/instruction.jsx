/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/prop-types */

import React from "react";
import styled from "styled-components";

import { AiOutlineEnter } from "react-icons/ai";
import { BsArrowDown, BsArrowUp, BsArrowRight } from "react-icons/bs";

// instructions
import One from "./instructions/one";
import Two from "./instructions/two";
import Four from "./instructions/four";
import Five from "./instructions/five";
import Three from "./instructions/three";

function Instruction({ one, two, three, four, render, five, six, seven, eight }) {
  return (
    <Container render={render}>
      <div className="instructions">
        {one === "one" && <One />}
        {one === "two" && <Two />}
        {one === "three" && <Three />}
        {one === "five" && <Five />}
        {!eight && one !== "one" && one !== "two" && one !== "three" && one !== "five" && one}
      </div>
      <div className="commands">
        <div className="one">
          <p>{!eight && two}</p>
          {!eight && four === "up" && <BsArrowUp className="icon" />}
          {!eight && four === "down" && <BsArrowDown className="icon" />}
          {!eight && four === "enter" && <AiOutlineEnter className="icon" />}
        </div>

        {five === "right" && (
          <div className="two">
            <p>{three}</p>
            <BsArrowRight className="icon" />
          </div>
        )}
        {five === "up" && (
          <div className="two">
            <p>{three}</p>
            <BsArrowUp className="icon" />
          </div>
        )}
        {six === "down" && (
          <div className="two">
            <p>{seven}</p>
            <BsArrowDown className="icon" />
          </div>
        )}
        {six === "more" && <Four eight={eight} />}
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: ${(props) => (props.render ? "650px" : "98%")};
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 15px;
  border-radius: ${(props) => (props.render ? "10px 10px 0 0" : "")};
  justify-content: space-between;
  border: ${(props) => (props.render ? "1px solid var(--gray)" : "")};
  position: ${(props) => (props.render ? "fixed" : "relative")};
  box-shadow: ${(props) => (props.render ? "var(--shadow) 0px 10px 50px" : "none")};
  bottom: 0;
  background: var(--black);

  p {
    /* text-transform: capitalize; */
    color: var(--white);
  }

  .instructions {
    width: 40%;
  }

  .commands {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .two {
      border-left: 2px solid var(--gray);
      margin: 0 0 0 5px;
      padding: 0 0 0 5px;
    }

    div {
      width: auto;
      height: 50%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .icon {
        background: var(--icon);
        color: var(--white);
        padding: 5px;
        font-size: 2em;
        border-radius: 2px;
        margin: 0 10px;
      }
    }
  }
`;

export default Instruction;
