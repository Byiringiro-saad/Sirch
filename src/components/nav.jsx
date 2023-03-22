/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */
import styled from "styled-components";
import React, { useState } from "react";

// components
import Form from "./popup/form";

function Nav({ render, buyCash }) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      {showForm && <Form handleShow={handleShowForm} />}
      {!render && (
        <Container>
          <div className="logo">
            <img src="/logo.png" alt="Sirch" />
          </div>
          <div className="navigation">
            <p className="link" onClick={handleShowForm}>
              Get Sirch Now
            </p>
            <a href="https://meet.google.com/duc-nihh-rot" rel="noreferrer" target="_blank" className="link">
              Support
            </a>
            <p className="button" onClick={() => buyCash("one")}>
              Buy S Cash
            </p>
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

    .form {
      width: auto;
      height: 100%;

      padding: 0;
      display: inline;
    }

    a,
    p {
      text-decoration: none;
      margin: 0 0 0 30px;
    }

    .link {
      color: var(--white);
    }

    p {
      cursor: pointer;
    }

    p.button {
      padding: 10px 30px;
      color: var(--black);
      border-radius: 5px;
      background: var(--white);
    }
  }
`;

export default Nav;
