import React from 'react';
import { Link } from "react-router-dom";

function Home() {
  return (
    <nav>
      <Link to="/login">
        <button> Login/Sign Up </button>
      </Link>
      <input type="text"  placeholder="Search for movies..."></input>
      <button> +Filter </button>
    </nav>
  );
}

export default Home;
