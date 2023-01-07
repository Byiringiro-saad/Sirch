import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { BsArrowRight } from "react-icons/bs";

function Two() {
  const constraints = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <Container>
      Press
      <motion.span
        variants={constraints}
        initial="hidden"
        animate="visible"
        transition={{ repeat: "Infinity", duration: 1, ease: "circOut" }}
      >
        <BsArrowRight className="icon" />
      </motion.span>
      to view search results
    </Container>
  );
}

const Container = styled.div`
  color: var(--white);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    background: var(--icon);
    color: var(--white);
    padding: 5px;
    font-size: 2em;
    border-radius: 2px;
    margin: 0 10px;
  }
`;

export default Two;
