import React, { useEffect } from "react";

const Home = ({ pageRef }) => {
  console.log("home", pageRef);
  useEffect(() => {
    if (pageRef.current) {
      const home = document.getElementById("home");
      home.appendChild(pageRef.current);
    }
  }, []);
  return <div id="home">Home</div>;
};

export default Home;
