import React from "react";

const Widget = ({ handleOnDrag }) => {
  return (
    <>
      <div
        data-widget
        className="bg-blue-500 text-white"
        onDragStart={(e) => handleOnDrag(e)}
        draggable
      >
        Widget A
      </div>
    </>
  );
};

export default Widget;
