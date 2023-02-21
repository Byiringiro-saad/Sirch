/* eslint-disable react/no-array-index-key */

import React from "react";
import styled from "styled-components";

// Components
import Suggestion from "./suggestion";

function Suggestions({ suggestions, selectedSuggestion, handleRenderPage }) {
  return (
    <Container>
      <div className="section">
        <div className="title">
          <p>Suggestions</p>
        </div>
        <div className="content">
          {suggestions?.length > 0 ? (
            suggestions
              .slice(0, 5)
              .map((suggestion, index) => (
                <Suggestion
                  suggestion={suggestion}
                  key={index}
                  selected={selectedSuggestion === index}
                  handleRenderPage={(query) => handleRenderPage(query)}
                />
              ))
          ) : (
            <div className="para">
              <p>No suggestions</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div``;

export default Suggestions;
