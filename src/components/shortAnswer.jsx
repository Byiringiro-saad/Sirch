import React, { useEffect, useState } from "react";

function ShortAnswer({ query }) {
  const debounceTimeMs = 1000;

  const [queryResult, setQueryResult] = useState("");

  function formatQuery(s) {
    return `${s}\nA:`;
  }

  function getShortAnsResults() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt: formatQuery(query),
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: "\n",
      }),
    };

    fetch("https://api.openai.com/v1/completions", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        let answer = "";
        if (data?.choices?.length > 0) {
          answer = data.choices[0].text;
        }
        if (answer) {
          setQueryResult(answer);
        } else {
          setQueryResult("No short answer available.");
        }
      });
  }

  useEffect(() => {
    const getData = setTimeout(() => {
      if (query) {
        getShortAnsResults();
      } else {
        setQueryResult("");
      }
    }, debounceTimeMs);
    return () => clearTimeout(getData);
  }, [query]);

  return <div className="short_ans">{queryResult}</div>;
}

export default ShortAnswer;
