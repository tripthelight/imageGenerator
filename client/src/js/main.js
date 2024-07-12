import "../scss/common.scss";
import "./common/textEffect/textEffect.js";

document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    // initTextEffect();
  }
};
