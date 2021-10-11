import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Grid } from 'semantic-ui-react';
import 'react-toastify/dist/ReactToastify.css';


const Notifications = (): JSX.Element => {
  return (
    <Grid>
   <ToastContainer position="top-left" autoClose={5000}/>
   </Grid>
  )
}

export default Notifications
