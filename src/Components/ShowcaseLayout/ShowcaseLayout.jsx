import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import RemoteApp from "widget1/Img";
import RemoteApp2 from "widget2/Img";
import { MyContext } from "../../context/stateContext";
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayout = getFromLS("lg") || { lg: [] };

export default class ShowcaseLayout extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: JSON.parse(JSON.stringify(originalLayout)),
      newCounter: parseInt(localStorage.getItem("counter")) || 0,
      layoutRef: React.createRef(),
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
    // S
  }

  resetLayout() {
    this.setState({ layouts: { lg: [] }, newCounter: 0 });
    localStorage.removeItem("rgl-7");
    localStorage.removeItem("counter");
  }

  generateDOM(el) {
    return (
      <div key={el.i} data-grid={el}>
        {el.additional === "remoteApp" ? (
          <RemoteApp />
        ) : el.additional === "remoteApp2" ? (
          <RemoteApp2 />
        ) : null}
        {/* <span className="text">{el.i}</span> */}
      </div>
    );
  }
  onBreakpointChange(breakpoint) {
    this.setState({ currentBreakpoint: breakpoint });
  }
  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout, layouts) {
    if (layout.some((item) => item.i === "__dropping-elem__")) return;
    console.log("onLayoutChange", layout, layouts);

    const updatedLayout = this.state.layouts.lg.map((item, i) => {
      const { w, h, x, y } = layout[i];
      item = { ...item, w, h, x, y };
      return item;
    });
    this.setState({ layouts: { lg: updatedLayout } });
    saveToLS("lg", updatedLayout);
  }

  onNewLayout() {
    // const { setState } = this.context;
    // setState((s) => ({ ...s, lg: generateLayout() }));
  }

  onDrop = (layout, layoutItem, _event) => {
    let DroppingItem = _event.dataTransfer.getData("type");
    if (DroppingItem === "remoteApp" || DroppingItem === "remoteApp2") {
      console.log("onDrop", layout, layoutItem);
      this.setState({
        layouts: {
          lg: this.state.layouts.lg.concat({
            i: this.state.newCounter.toString(),
            x: layoutItem.x,
            y: layoutItem.y,
            w: DroppingItem === "remoteApp" ? layoutItem.w + 1 : layoutItem.w,
            h:
              DroppingItem === "remoteApp"
                ? layoutItem.h + 1
                : layoutItem.h + 0.5,
            minW: 1,
            maxW: 4,
            minH: 1,
            maxH: 4,
            additional: _event.dataTransfer.getData("type"),
          }),
        },
        newCounter: this.state.newCounter + 1,
      });
      localStorage.setItem("counter", this.state.newCounter + 1);
    }
  };

  handlePublish = () => {
    const layoutCopy = this.state.layoutRef.current.cloneNode(true);
    layoutCopy.firstChild.style.background = "unset";
    layoutCopy.firstChild
      .querySelectorAll(".react-grid-item")
      .forEach((item) => {
        item.style.resize = "none";
        item.style.border = "none";
        item.style.background = "unset";
      });
    localStorage.setItem("domNode", JSON.stringify(layoutCopy));
    this.props.pageRef.current = layoutCopy;
    this.props.navigate("/home");
  };

  render() {
    return (
      <>
        <button onClick={() => this.resetLayout()}>Reset Layout</button>
        <div className="flex min-h-screen" style={{ marginTop: "5rem" }}>
          <div className="w-full" ref={this.state.layoutRef}>
            <ResponsiveReactGridLayout
              {...this.props}
              layouts={this.state.layouts}
              onBreakpointChange={this.onBreakpointChange}
              onLayoutChange={this.onLayoutChange}
              // WidthProvider option
              measureBeforeMount={false}
              // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
              // and set `measureBeforeMount={true}`.
              useCSSTransforms={this.state.mounted}
              compactType={this.state.compactType}
              preventCollision={!this.state.compactType}
              onDrop={this.onDrop}
              isDroppable={true}
              style={{ minHeight: "100%" }}
              resizeHandles={["se"]}
            >
              {_.map(this.state.layouts.lg, (el) => this.generateDOM(el))}
              {/* {this.generateDOM()} */}
            </ResponsiveReactGridLayout>
          </div>
          <section style={{}}>
            <div
              className="droppable-element"
              draggable={true}
              unselectable="on"
              style={{ width: "7rem", height: "7rem" }}
              // this is a hack for firefox
              // Firefox requires some kind of initialization
              // which we can do by adding this attribute
              // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
              onDragStart={(e) => e.dataTransfer.setData("type", "remoteApp")}
            >
              <RemoteApp />
            </div>
            <div
              className="droppable-element"
              draggable={true}
              unselectable="on"
              style={{ width: "7rem", height: "7rem" }}
              // this is a hack for firefox
              // Firefox requires some kind of initialization
              // which we can do by adding this attribute
              // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
              onDragStart={(e) => e.dataTransfer.setData("type", "remoteApp2")}
            >
              <RemoteApp2 />
            </div>
          </section>
        </div>
        <button
          className="btn"
          style={{ position: "fixed", top: "3rem", right: "1rem" }}
          onClick={this.handlePublish}
        >
          Publish
        </button>
      </>
    );
  }
}

ShowcaseLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};

ShowcaseLayout.defaultProps = {
  className: "layout",
  rowHeight: 60,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(),
};

export function generateLayout() {
  return _.map(_.range(0, 0), function (item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: 3,
      i: i.toString(),
      static: false,
      //   static: Math.random() < 0.05,
    };
  });
}

export function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("rgl-7")) || { lg: [] };
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls;
}

export function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem(
      "rgl-7",
      JSON.stringify({
        [key]: value,
      })
    );
  }
}
