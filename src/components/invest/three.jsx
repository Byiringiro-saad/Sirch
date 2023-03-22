/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// icons
import { IoMdClose } from "react-icons/io";

function Three({ close }) {
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
        <img src="/images/two.png" alt="one" />
        <p className="title">Successfull</p>
        <p className="para">
          You have successfully bought 1000 S Cash and its added to your wallet. Make sure you save the below token link
          to make further transaction.
        </p>
        <div className="row">
          <p className="token">1220 - 9182 - 92838</p>
          <div className="copy">
            <p>Copy</p>
          </div>
        </div>
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

  img {
    width: 120px;
  }

  p.title {
    font-size: 1.5em;
    margin: 10px 0;
  }

  p.para {
    text-align: center;
    margin: 10px 0;
  }

  .row {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--shadow);
    margin: 10px 0;
    padding: 0 20px;
    border-radius: 5px;
    overflow: hidden;

    p.token {
      opacity: 0.4;
    }

    .copy {
      cursor: pointer;
    }
  }
`;

export default Three;
