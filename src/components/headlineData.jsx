import React from "react";
import styled from "styled-components";

function HeadlineData({ selected, ans }) {
  const fieldRef = React.useRef(null);
  if (selected) {
    fieldRef?.current?.scrollIntoView();
  }
  return (
    <Container selected={selected} ref={fieldRef}>
      <div className="short_ans">{ans?.Title}</div>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 5px 0;
  border-radius: 10px;
  background: ${(props) => (props.selected ? "var(--gray)" : "")};

  .left {
    display: flex;
    flex-direction: row;
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;

    .icon {
      padding: 5px;
      margin: 0 10px 0 0;
      border-radius: 5px;
      background: var(--icon);
      cursor: pointer;
    }

    p {
      color: var(--text);
      text-transform: capitalize;
      cursor: pointer;
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    p {
      color: var(--white);
      cursor: pointer;
    }
  }

  :hover {
    background: var(--gray);
  }
`;

export default HeadlineData;
