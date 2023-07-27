import React from "react";

const LandingPage = ({
  handleOnDrop,
  handleDragOver,
  LayoutWidget,
  handleRemoveWidget,
}) => {
  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleDragOver}
      style={{
        width: "100%",
        minHeight: "10rem",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        padding: "1rem",
        display: "flex",
        flexWrap: "wrap",
      }}
      className=""
      data-layout
      id="landing-page"
    >
      {LayoutWidget?.map((widget, index) => {
        return (
          <React.Fragment key={index}>
            <div>
              <div key={index} dangerouslySetInnerHTML={{ __html: widget }} />
              <button onClick={() => handleRemoveWidget(index)}>Remove</button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default LandingPage;
