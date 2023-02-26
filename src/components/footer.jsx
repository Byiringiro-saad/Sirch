/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";
import styled from "styled-components";

// eslint-disable-next-line react/function-component-definition
const Footer = ({ render }) => (
  <>
    {!render && (
      <Container>
        <div className="left">
          <a href="https://www.linkedin.com/company/43178146" rel="noreferrer" target="_blank">
            Linkedin
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=100089316559376&mibextid=ZbWKwL"
            rel="noreferrer"
            target="_blank"
          >
            Facebook
          </a>
          <a href="https://twitter.com/SirchTheWeb" rel="noreferrer" target="_blank">
            Twitter
          </a>
          <a href="https://www.tiktok.com/@sirch.it?_t=8ZFLQTtiPM6&_r=1" rel="noreferrer" target="_blank">
            TikTok
          </a>
        </div>
        <div className="right">
          <p>Terms and Conditions</p>
          <p>Privacy policy</p>
          <p>@Copyright 2023 Sirch</p>
        </div>
      </Container>
    )}
  </>
);

const Container = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  position: fixed;
  bottom: 0;
  left: 0;

  .left {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      margin: 0 30px 0 0;
      color: var(--white);
      text-decoration: none;
    }
  }

  .right {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    p {
      color: var(--white);
      margin: 0 0 0 30px;
    }
  }
`;

export default Footer;
