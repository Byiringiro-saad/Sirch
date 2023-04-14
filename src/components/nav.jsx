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
            <img src="/logo.jpg" alt="Sirch" />
            <a href="https://bento.me/sirchit" rel="noreferrer" target="_blank" className="link">
              About
            </a>
          </div>
          <div className="navigation">
            <p className="link" onClick={handleShowForm}>
              Get Sirch Now
            </p>
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
    width: auto;
    height: 40px;
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    align-items: center;
    z-index: 2;

    img {
      width: 55px;
    }

    a {
      text-decoration: none;
      margin: 0 0 0 10px;
      color: var(--white);
      padding: 10px 25px;
      border-radius: 3px;
      border: 1px solid var(--white);
      transition: all 0.3s ease-in-out;

      :hover {
        background: var(--white);
        color: var(--black);
      }
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
      color: var(--white);
      border-radius: 5px;
      border: 1px solid var(--white);
      transition: all 0.3s ease-in-out;

      :hover {
        background: var(--white);
        color: var(--black);
      }
    }
  }
`;

export default Nav;
