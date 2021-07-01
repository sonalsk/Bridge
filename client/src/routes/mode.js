/* ------ IMPORTING FILES ------- */
import React from 'react';
import {Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

function Mode() {
    return (
        <div>
            <h1>Choice</h1>
            {/* <Link to="/CreateRoom"><button> 1:1 </button></Link> */}
            <button> Group </button>
            <Button variant="primary" href='/CreateRoom'>1:1</Button>
        </div>
    );
}

export default Mode;