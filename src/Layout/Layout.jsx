import React from "react";

const Layout = (props) => {
  return (
    <>
      <div className="mt-10 mx-auto max-w-6xl">{props.children}</div>
    </>
  );
};

export default Layout;
