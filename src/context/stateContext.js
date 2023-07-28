// MyContextProvider.js
import React, { useState, createContext } from "react";
import {
  generateLayout,
  getFromLS,
} from "../Components/ShowcaseLayout/ShowcaseLayout";
export const MyContext = createContext();
const originalLayouts = getFromLS("layouts") || {};

const MyContextProvider = ({ children }) => {
  // Define your state or any data you want to share through the context
  const [state, setState] = useState({
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: [] },
    newCounter: 0,
    layoutRef: React.createRef(),
  });

  // You can add any functions or additional state management here too

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;

// MyContext.js
