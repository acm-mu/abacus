import React from "react";
import { Helmet } from "react-helmet";

const Unauthorized = (): JSX.Element => <>
  <Helmet> <title>Abacus | Unauthorized</title> </Helmet>
  <div>
    <h1>Error 401 - Unauthorized</h1>
    <p>You do not have permission to access this page!</p>
  </div>
</>

export default Unauthorized;
