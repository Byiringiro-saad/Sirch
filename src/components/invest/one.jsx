/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import styled from "styled-components";

// icons
import { IoMdClose } from "react-icons/io";

function One({ next, close }) {
  const variants = {
    start: {
      y: 10,
      opacity: 0,
    },
    end: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67],
      },
    },
  };

  return ReactDOM.createPortal(
    <Container>
      <motion.div className="container" variants={variants} initial="start" animate="end">
        <div className="close" onClick={() => close()}>
          <IoMdClose className="icon" />
        </div>
        <img src="/images/one.png" alt="one" />
        <p className="title">Invest in S Cash</p>
        <p className="para">
          Invest in S Cash and take advantage of its numerous benefits. The future is here, and S Cash is leading the
          way.
        </p>
        <div className="button" onClick={() => next("two")}>
          Buy S Cash
        </div>
        <a href="#">How it works?</a>
      </motion.div>
    </Container>,
    document.querySelector("#invest")
  );
}

const Container = styled.div`
  .container {
    width: 350px;
    height: auto;
    display: flex;
    z-index: 100000;
    flex-direction: column;
    align-items: center;
    position: fixed;
    border-radius: 10px;
    padding: 20px;
    top: 75px;
    right: 30px;
    background: var(--black);
    box-shadow: var(--shadow) 0px 10px 30px;
  }

  .close {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;

    .icon {
      font-size: 1.5em;
    }
  }

  p.title {
    font-size: 1.5em;
    margin: 10px 0;
  }

  p.para {
    text-align: center;
    margin: 10px 0;
  }

  .button {
    width: 60%;
    height: 40px;
    margin: 10px 0;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white);
    color: var(--black);
    cursor: pointer;
  }

  a {
    text-decoration: none;
    color: var(--white);
    margin: 10px 0;
  }
`;

export default One;
