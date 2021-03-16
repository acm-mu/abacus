import React from "react";
import notfound from "assets/404.png"

const NotFound = (): JSX.Element => (
  <img
    src={notfound}
    width="100%"
    height="auto"
    alt="404 Not Found"
  />
);

export default NotFound;
