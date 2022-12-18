import React, { useEffect, useState } from "react";

function ShortAnswer({ query }) {
  const debounceTimeMs = 500;

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
        console.log(data);
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
