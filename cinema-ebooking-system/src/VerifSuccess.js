import React from 'react';
import { Link } from 'react-router-dom';
import './VerifSuccess.css';

function VerifSucess() {

    return (

        <div className="verifcontent">

            <h1>Registration Successful!</h1>
            <h3>Thanks for registering and verificating your email.</h3>
            <h3>Your account has been created.</h3>
            <Link to= "/loggedin">
            <button type="homepage" className="btn-homepage">Back to Homepage</button>
            </Link>


        </div>


    );



}

export default VerifSucess;