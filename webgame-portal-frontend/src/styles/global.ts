import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #1b2838;
    color: #c6d4df;
    font-family: Arial, sans-serif;
  }

  a {
    color: #66c0f4;
    text-decoration: none;
    &:hover {
      color: #ffffff;
    }
  }

  button {
    background: linear-gradient(to right, #47bfff 0%, #1a44c2 100%);
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      background: linear-gradient(to right, #66c0f4 0%, #2b5bdb 100%);
    }
  }
`;

export default GlobalStyle;
