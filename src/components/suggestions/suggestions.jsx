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

const Container = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .title {
    width: 100%;
    height: 25px;

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

    > p {
      width: 100%;
      line-height: 25px;
    }

    .para {
      width: 100%;
      height: 25px;

      p {
        color: var(--text);
        text-align: center;
      }
    }
  }
`;

export default Suggestions;
