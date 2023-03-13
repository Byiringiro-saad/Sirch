/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import styled from "styled-components";

function Form({ handleShow }) {
  return (
    <Container>
      <form-widget ucid="GBuUsuDbG3qD6PdpyxZ806E41Gk" />
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

  .background {
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: -1000;
    background: #00000099;
  }
`;

export default Form;
