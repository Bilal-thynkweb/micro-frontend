import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import Layout from "./Layout/Layout";
import Widget from "./Components/Widget/Widget";
import LandingPage from "./Components/LandingPage/LandingPage";
import Layouts from "./Components/Layouts/Layouts";
import RemoteApp from "widget1/Img";
import RemoteApp2 from "widget2/Img";
import "./index.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import ShowcaseLayout from "./Components/ShowcaseLayout/ShowcaseLayout";
import { Editor, Frame, Canvas, Selector } from "@craftjs/core";
import { TextComponent } from "./Components/TextComponent/Text";

const App = () => {
  const pageRef = useRef(null);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root pageRef={pageRef} />} />
          <Route path="/home" element={<Home pageRef={pageRef} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));

function Root({ pageRef }) {
  const [LayoutWidget, setLayoutWidget] = useState([]);
  const [layout, setLayout] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleOnDrag = (e) => {
    if (e) {
      return e.dataTransfer.setData("widgetType", e.target.outerHTML);
    }
  };

  const handleOnDrop = (e) => {
    const widgetType = e.dataTransfer.getData("widgetType");
    console.log("onDrop", widgetType, e);
    const div = document.createElement("div");
    div.innerHTML = widgetType;
    div.style.resize = "both";
    div.style.overflow = "auto";
    div.style.width = "300px";
    div.style.minHeight = "100%";

    setLayoutWidget((s) => [...s, div.outerHTML]);

    // if (widgetType.includes("item") && e.target.id === "landing-page") {
    //   setLayoutWidget((s) => [...s, widgetType]);
    //   return;
    // }
    // if (e.target.id === "landing-page") {
    //   return;
    // }
    // const div = document.createElement("div");
    // div.innerHTML = widgetType;
    // e.target.appendChild(div.firstChild);
    // const isPresent = LayoutWidget.findIndex((item) =>
    //   item.includes(e.target.id)
    // );
    // if (isPresent !== -1) {
    //   LayoutWidget[isPresent] = e.target.outerHTML;
    //   setLayoutWidget(LayoutWidget);
    //   return;
    // }
    // setLayoutWidget((s) => [...s, e.target.outerHTML]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveWidget = (index) => {
    setLayoutWidget((s) => s.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    const layout = document.querySelector("#landing-page");
    const layoutCopy = layout.cloneNode(true);
    const buttons = layoutCopy.querySelectorAll("button"); // Select the button element inside the layout element
    buttons.forEach((button) => {
      button.remove();
    });
    const divElements = layoutCopy.querySelectorAll("div");
    divElements.forEach((div) => {
      div.style.resize = "none";
    });
    // layoutCopy.style.width = "100%";
    pageRef.current = layoutCopy;
    navigate("/home");
  };

  const onLayoutChange = (layout) => {
    setLayout(layout);
  };
  return (
    <>
      <ShowcaseLayout onLayoutChange={onLayoutChange} />
      {/* <Layout>
        <div>
          <div
            className="y"
            style={{ width: "5rem" }}
            draggable
            onDragStart={(e) => handleOnDrag(e)}
          >
            <RemoteApp />
          </div>

          <div
            className="y"
            style={{ width: "5rem" }}
            draggable
            onDragStart={(e) => handleOnDrag(e)}
          >
            <RemoteApp2 />
          </div>
        </div>
        <LandingPage
          handleDragOver={handleDragOver}
          handleOnDrop={handleOnDrop}
          LayoutWidget={LayoutWidget}
          handleRemoveWidget={handleRemoveWidget}
        />
      </Layout>
      <button
        className="btn"
        style={{ position: "fixed", top: "3rem", right: "1rem" }}
        onClick={handlePublish}
      >
        Publish
      </button> */}
    </>
  );
}
