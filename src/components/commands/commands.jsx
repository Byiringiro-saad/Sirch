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

const Container = styled.div``;

export default Commands;
