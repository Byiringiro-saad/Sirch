import React from "react";
import styled from "styled-components";

// components
import Nav from "./components/nav";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Container>
        <div className="nav">
          <Nav />
        </div>
        <div className="content">
          <p>saad</p>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Container>
      <div className="render" />
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default App;
