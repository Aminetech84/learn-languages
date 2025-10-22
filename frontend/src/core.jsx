import React from "react";

export default function Core(props) {
console.log(props);

  return (
    <>
    <h1>A1 part 1</h1>
    <h2 >{props.data.fun.art}</h2>
    <p>and, or , yes, no</p>
    <h2>Most used</h2>
    <p>today</p>
    <h2>Top verbs</h2>
    </>
  );
}

