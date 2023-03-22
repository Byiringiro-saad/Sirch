/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/prop-types */

import React from "react";
import styled from "styled-components";
import ContentLoader from "react-content-loader";

function ShortansIcon({ loading, visibleSites, render, data, isAnsPressEnt }) {
  const otherAns = [
    { name: "Call", img: "./call.png" },
    { name: "Tip", img: "./dollar.png" },
    { name: "Bio", img: "./smile.png" },
  ];
  return (
    <Container visible={visibleSites} render={render}>
      {loading ? (
        <div className="loading">
          <ContentLoader
            width={150}
            height={100}
            viewBox="0 0 150 100"
            backgroundColor="#f0f0f0"
            foregroundColor="#dedede"
          >
            <rect x="10" y="0" rx="4" ry="4" width="150" height="100" />
          </ContentLoader>
        </div>
      ) : (
        <>
          {iconNav(0, data?.avatar_img_url, "Name", data?.avatar, true)}
          {isAnsPressEnt === 13 && otherAns?.map((el) => iconNav(0, el.img, el.name, data?.avatar, false))}
        </>
      )}
    </Container>
  );
  function iconNav(index, logo, name, des, first) {
    return (
      <>
        <div className="selected div" key={index}>
          <div className={first ? "gray" : "blank"}>
            {logo ? <img src={logo} alt={name} /> : <p>{name?.charAt(0)}</p>}
          </div>
          <div className="name">
            <p>{name}</p>
          </div>
        </div>
        {isAnsPressEnt !== 13 && <div className="des">{des}</div>}
      </>
    );
  }
}

const Container = styled.div`
  width: 700px;
  height: ${(props) => (props.render ? "50px" : "130px")};
  padding: 0px 10px;
  background: var(--black);
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: ${(props) => (props.visible ? "var(--shadow) 0px 10px 50px" : "none")};

  .selected {
    .gray {
      background: var(--icon) !important;
    }
    .blank {
      background: var(--black) !important;
    }
    .name {
      background: ${(props) => (props.render ? "var(--icon) !important" : "")};
      justify-content: center !important;

      p {
        text-decoration: underline;
      }
    }
  }

  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 0;
  }

  .div {
    width: 150px;
    height: 100%;
    display: ${(props) => (props.visible ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    margin: 0 10px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    .num {
      width: 20px;
      height: 20px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 0px;
      background: var(--red);
    }

    .gray {
      width: 100%;
      height: 80%;
      border-radius: 5px;
      display: ${(props) => (props.render ? "none" : "flex")};
      align-items: center;
      justify-content: center;

      p {
        font-size: 1.5em;
        color: var(--white);
      }

      img {
        width: 50%;
        border-radius: 5px;
        object-position: center;
      }
    }
    .blank {
      width: 100%;
      height: 80%;
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      display: ${(props) => (props.render ? "none" : "flex")};
      align-items: center;
      justify-content: center;

      p {
        font-size: 1.5em;
        color: var(--white);
      }

      img {
        width: 22%;
        border-radius: 5px;
        object-position: center;
      }
    }

    .name {
      width: 100%;
      height: ${(props) => (props.render ? "100%" : "15%")};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: ${(props) => (props.render ? "center" : "flex-end")};
      color: var(--white);
      border-radius: 3px;
      padding: 0 10px;

      p {
        width: 100%;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
`;

export default ShortansIcon;
