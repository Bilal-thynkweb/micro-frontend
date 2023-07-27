import React from "react";

const Layouts = ({ handleOnDrag, handleOnDrop, handleDragOver, widgets }) => {
  return (
    <div>
      <p> Layouts </p>
      <div style={{ width: "5rem" }}>
        <div
          onDragStart={(e) => handleOnDrag(e)}
          draggable
          className="border border-black oneBySix"
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
          id="item"
        >
          {widgets?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div dangerouslySetInnerHTML={{ __html: item }} />
              </React.Fragment>
            );
          })}
          <p> 1 / 6 </p>
        </div>

        <div
          onDragStart={(e) => handleOnDrag(e)}
          draggable
          className="border border-black oneBySix"
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
          id="item2"
        >
          {widgets?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <div dangerouslySetInnerHTML={{ __html: item }} />
              </React.Fragment>
            );
          })}
          <p> 1 / 6 </p>
        </div>
      </div>
    </div>
  );
};

export default Layouts;
