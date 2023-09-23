import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import FetchWebpage from "./FetchWebpage.js";

export default function HomePage() {
  let [textValue, setTextValue] = useState("");

  return (
    <div>
      <BoundedTextEntry
        onSubmit={(text) => {
          setTextValue(text);
        }}
        defaultValue={textValue}
        lowerBound={4}
        upperBound={16}
      />
      <p>{textValue}</p>
    </div>
  );
}

function BoundedTextEntry({ onSubmit, defaultValue, lowerBound, upperBound }) {
  let [lastUsedValue, setLastUsedValue] = useState(defaultValue);
  let bounded =
    lastUsedValue.length >= lowerBound && lastUsedValue.length <= upperBound;
  function onInputChange(event) {
    setLastUsedValue(event.target.value);
    bounded =
      lastUsedValue.length >= lowerBound && lastUsedValue.length <= upperBound;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        defaultValue={defaultValue}
        onChange={onInputChange}
      />
      <input
        type="submit"
        value="Enter"
        onClick={() => {
          if (bounded === false) return;
          onSubmit(lastUsedValue);
        }}
      />
      {bounded ? (
        <></>
      ) : (
        <p>
          Entry must be between {lowerBound} and {upperBound} characters.
        </p>
      )}
      <FetchWebpage url="http://en.wikipedia.org/?curid=18630637" />
    </div>
  );
}

function BasicTextEntry({ onSubmit, defaultValue }) {
  let lastUsedValue = defaultValue;
  function onInputChange(event) {
    lastUsedValue = event.target.value;
  }
  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        defaultValue={defaultValue}
        onChange={onInputChange}
      />
      <input
        type="submit"
        value="Enter"
        onClick={() => {
          onSubmit(lastUsedValue);
        }}
      />
      {}
    </div>
  );
}
