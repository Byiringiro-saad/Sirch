import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

function EmailPortal({ close }) {
  const constraints = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <Container>
      <motion.div className="content" variants={constraints} initial="hidden" animate="visible">
        <p className="title">Get Sirch for Chrome</p>
        <p className="text">
          Get Sirch for Chrome and get the most out of Sirch. It&apos;s free and only takes a minute to install.
        </p>
        <form action="#">
          <input type="text" placeholder="Enter your email" />
          <button type="submit">Get Sirch</button>
        </form>
      </motion.div>
      <button className="back" type="button" onClick={() => close()}>
        <p>Back</p>
      </button>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  background: #0b0b0b6f;

  .content {
    width: 500px;
    height: 250px;
    position: absolute;
    background: var(--black);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;

    p.title {
      margin: 20px 0 0 0;
      font-size: 1.3em;
      font-weight: 700;
      color: var(--white);
    }

    p.text {
      font-size: 1em;
      text-align: center;
      color: var(--white);
      margin: 15px 0 40px 0;
    }

    form {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 0 10px;

      input {
        width: 100%;
        height: 35px;
        background: var(--gray);
        border: none;
        outline: none;
        border-radius: 5px;
        padding: 0 10px;
      }

      button {
        width: 30%;
        height: 30px;
        margin: 15px 0;
        border: none;
        outline: none;
        border-radius: 5px;
        background: var(--white);
        color: var(--black);
      }
    }
  }

  .back {
    width: 100%;
    height: 100%;
    z-index: 30;
    background: transparent;
    border: none;
    outline: none;

    p {
      opacity: 0;
    }
  }
`;

export default EmailPortal;
