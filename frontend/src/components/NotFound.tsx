import React from "react";
import notfound from "assets/404.png"
import { Helmet } from "react-helmet";

const NotFound = (): JSX.Element => <>
  <Helmet><title>Abacus | Not Found</title></Helmet>
  <img
    src={notfound}
    width="100%"
    height="auto"
    alt="404 Not Found"
  />
</>

export default NotFound;
