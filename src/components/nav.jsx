/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import styled from "styled-components";

function Nav({ render }) {
  return (
    <>
      {!render && (
        <Container>
          <div className="logo">
            <img src="/logo.png" alt="Sirch" />
          </div>
          <div className="navigation">
            <a href="https://sirch.cash/" rel="noreferrer" target="_blank" className="link">
              Download for Chrome
            </a>
            <a href="https://meet.google.com/duc-nihh-rot" rel="noreferrer" target="_blank" className="link">
              Support
            </a>
            <a href="https://sirch.cash/" rel="noreferrer" target="_blank" className="button">
              Buy S Cash
            </a>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: fixed;
  top: 0;
  left: 0;

  .logo {
    width: 40px;
    height: 40px;
    display: flex;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    z-index: 2;

    img {
      width: 60%;
    }
  }

  .navigation {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      text-decoration: none;
      margin: 0 0 0 30px;
    }

    a.link {
      color: var(--white);
    }

    a.button {
      padding: 10px 30px;
      color: var(--black);
      border-radius: 5px;
      background: var(--white);
    }
  }
`;

export default Nav;
