import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import ContentLoader from "react-content-loader";

//actions
import { selectSite } from "../store/reducers/icons";

const Icons = ({ sites, loading }) => {
  const dispatch = useDispatch();
  const [cursor, setCursor] = React.useState(0);

  const handleKeyDown = (e) => {
    if (cursor === 3 && e.keyCode === 39) {
      setCursor(3);
    } else {
      if (e.keyCode === 37 && cursor > 0) {
        setCursor(cursor - 1);
      } else if (e.keyCode === 39 && cursor < sites.length - 1) {
        setCursor(cursor + 1);
      }
    }
  };

  React.useEffect(() => {
    dispatch(selectSite(sites[cursor]));
  }, [cursor]);

  React.useEffect(() => {
    if (sites.length === 0) {
      setCursor(-1);
    } else {
      setCursor(0);
    }
  }, [sites]);

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <Container>
      <div className={cursor === 0 ? "selected div" : "div"}>
        <div className="num red"></div>
        <div className="gray">
          {loading ? (
            <ContentLoader>
              <rect x="0" y="0" width="100%" height="100%" />
            </ContentLoader>
          ) : (
            <>
              {sites?.length > 0 ? (
                <img src={`${sites[0]?.logo}`} alt={`${sites[0]?.name}`} />
              ) : null}
            </>
          )}
        </div>
        <div className="name">
          <p>{sites[0]?.name}</p>
        </div>
      </div>
      <div className={cursor === 1 ? "selected div" : "div"}>
        <div className="num blue"></div>
        <div className="gray">
          {loading ? (
            <ContentLoader>
              <rect x="0" y="0" width="100%" height="100%" />
            </ContentLoader>
          ) : (
            <>
              {sites.length > 0 ? (
                <img src={`${sites[1]?.logo}`} alt={`${sites[1]?.name}`} />
              ) : null}
            </>
          )}
        </div>
        <div className="name">
          <p>{sites[1]?.name}</p>
        </div>
      </div>
      <div className={cursor === 2 ? "selected div" : "div"}>
        <div className="num blue"></div>
        <div className="gray">
          {loading ? (
            <ContentLoader>
              <rect x="0" y="0" width="100%" height="100%" />
            </ContentLoader>
          ) : (
            <>
              {sites.length > 0 ? (
                <img src={`${sites[2]?.logo}`} alt={`${sites[2]?.name}`} />
              ) : null}
            </>
          )}
        </div>
        <div className="name">
          <p>{sites[2]?.name}</p>
        </div>
      </div>
      <div className={cursor === 3 ? "selected div" : "div"}>
        <div className="num red"></div>
        <div className="gray">
          {loading ? (
            <ContentLoader>
              <rect x="0" y="0" width="100%" height="100%" />
            </ContentLoader>
          ) : (
            <>
              {sites.length > 0 ? (
                <img src={`${sites[3]?.logo}`} alt={`${sites[3]?.name}`} />
              ) : null}
            </>
          )}
        </div>
        <div className="name">
          <p>{sites[3]?.name}</p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 650px;
  height: 150px;
  padding: 20px 10px;
  background: var(--black);
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: var(--shadow) 0px 10px 50px;

  .selected {
    background: var(--icon);
  }

  .div {
    width: 140px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    margin: 0 10px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;

    .num {
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      position: absolute;
      top: -12px;
      right: -12px;

      p {
        padding: 5px;
      }
    }

    .red {
      background: var(--red);
    }

    .blue {
      background: var(--blue);
    }

    .gray {
      width: 100%;
      height: 80%;
      /* background: var(--gray); */
      /* border-radius: 5px; */
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 35%;
        object-position: center;
      }
    }

    .name {
      width: 100%;
      height: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      color: var(--white);

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

export default Icons;
