import React from "react";
import styled from "styled-components";

// Components
import Page from "./page";

function UnderDomain({ underDomainData, underDomainFilterd, selectedPage }) {
  return (
    <Container>
      <div className="section">
        <div className="title">
          <p>Found</p>
        </div>
        <div className="content">
          {underDomainFilterd.length > 0
            ? underDomainFilterd.map((site, index) => <Page page={site} selected={selectedPage === index} />)
            : underDomainData.map((page, index) => <Page page={page} selected={selectedPage === index} />)}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div``;

export default UnderDomain;
