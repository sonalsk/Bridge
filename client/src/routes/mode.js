/* ------ IMPORTING FILES ------- */
import React from "react";
import {Link } from "react-router-dom";

function Mode() {
    return (
        <div>
            <h1>Choice</h1>
            <Link to="/CreateRoom"><button> 1:1 </button></Link>
            <button> Group </button>
        </div>
    );
}

export default Mode;