/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// icons
import { GiTiedScroll } from "react-icons/gi";

function Enter({ handleShow }) {
  const constraints = {
    hidden: {
      opacity: 0,
      scale: 0.2,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Container>
      <motion.div className="content" initial="hidden" animate="visible" variants={constraints}>
        <GiTiedScroll className="icon" />
        <p className="header">The results page is a bug.</p>
        <p className="para">
          You want to spend your time enjoying content, not trying to figure out which link to click.
        </p>
        <p className="button">Tap the right arrow key a bunch of times, and then Stash (upvote) what you like.</p>
        <div className="got" onClick={() => handleShow()}>
          <p>Got it</p>
        </div>
      </motion.div>
      <div className="background" onClick={() => handleShow()} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 10000;

  .content {
    width: 500px;
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    border-radius: 10px;
    background: var(--black);

    p.header {
      font-size: 2em;
      font-weight: 700;
      line-height: 100px;
    }

    p.para {
      text-align: center;
      line-height: 25px;
    }

    p.button {
      padding: 10px 20px;
      margin: 20px 0 0 0;
      border-radius: 5px;
      border: 1px dashed var(--white);
      text-align: center;
      line-height: 25px;
    }

    .icon {
      font-size: 7em;
      margin: 0 0 20px 0;
    }

    .got {
      padding: 20px 50px;
      margin: 20px 0 0 0;
      border-radius: 5px;
      background: var(--white);
      color: var(--black);
      cursor: pointer;
    }
  }

  .background {
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: -1000;
    background: #00000099;
  }
`;

export default Enter;
