document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    main();
  }
};
