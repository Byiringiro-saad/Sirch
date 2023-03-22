/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// icons
import { IoMdArrowRoundBack, IoMdClose } from "react-icons/io";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

function Two({ next, close }) {
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
        <div className="back" onClick={() => next("one")}>
          <IoMdArrowRoundBack className="icon" />
        </div>
        <p className="title">Invest in S Cash</p>
        <p className="para">Investing in S Cash is super secure and we you can manage your S Cash too.</p>
        <form>
          <div className="row">
            <div className="sign right">
              <AiOutlineMinus />
            </div>
            <input type="number" className="center" placeholder="How much you want to buy" pattern="[0-9]*" />
            <div className="sign left">
              <AiOutlinePlus />
            </div>
          </div>
          <div className="row">
            <input type="text" className="padding" placeholder="Email address" />
          </div>
          <div className="big">
            <input type="number" className="padding" placeholder="Card No" />
            <div className="more">
              <input type="number" placeholder="mm/yy" />
              <input type="number" placeholder="cvv" />
            </div>
          </div>
        </form>
        <div className="button" onClick={() => next("three")}>
          Buy S Cash
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

  .back {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px;
    left: 10px;
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

  form {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;

    .big {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--shadow);
      margin: 10px 0;
      border-radius: 5px;
      overflow: hidden;

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }
      > input {
        width: 70%;
        height: 100%;
        border: none;
        outline: none;
        padding: 0 0 0 10px;
      }

      .more {
        width: 30%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > input {
          width: 50%;
          height: 100%;
          border: none;
          outline: none;
        }
      }
    }

    .row {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--shadow);
      margin: 10px 0;
      border-radius: 5px;
      overflow: hidden;

      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      input[type="number"] {
        -moz-appearance: textfield;
      }

      input {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
      }

      .padding {
        padding: 0 0 0 10px;
      }

      .center {
        text-align: center;
      }

      .sign {
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .left {
        border-left: 1px solid var(--shadow);
      }

      .right {
        border-right: 1px solid var(--shadow);
      }
    }
  }
`;

export default Two;
