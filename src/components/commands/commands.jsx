import React from "react";
import styled from "styled-components";

// Components
import Command from "./command";

function Commands({ commands, selectedSuggestion, selectedPage, suggestionsActive, underDomainData }) {
  return (
    <Container>
      <div className="title">
        <p>Commands</p>
      </div>
      <div className="content">
        {commands.map((command, index) => (
          <Command
            command={command}
            key={command?.id}
            selected={
              suggestionsActive ? selectedSuggestion === index + 5 : selectedPage === underDomainData.length + index
            }
          />
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 30px 0 0 0;

  .title {
    width: 100%;
    height: 35px;

    p {
      color: var(--text);
      font-weight: 700;
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export default Commands;
