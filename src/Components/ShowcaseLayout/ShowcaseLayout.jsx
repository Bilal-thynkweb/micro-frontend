import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import RemoteApp from "widget1/Img";
import RemoteApp2 from "widget2/Img";
import { MyContext } from "../../context/stateContext";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default class ShowcaseLayout extends React.Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout },
      newCounter: 0,
      layoutRef: React.createRef(),
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
    const { setState } = this.context;
    setState((s) => ({ ...s, mounted: true }));
  }

  //   generateDOM() {
  //     return _.map(this.state.layouts.lg, function (l, i) {
  //       return (
  //         <div key={i} className={l.static ? "static" : ""}>
  //           {i === 0 ? <RemoteApp2 /> : <RemoteApp />}
  //           {/* {l.static ? (
  //             <span
  //               className="text"
  //               title="This item is static and cannot be removed or resized."
  //             >
  //               Static - {i}
  //             </span>
  //           ) : (
  //             <RemoteApp />
  //             // <span className="text">{i}</span>
  //           )} */}
  //         </div>
  //       );
  //     });
  //   }

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
    this.setState({
      currentBreakpoint: breakpoint,
    });
    const { setState } = this.context;
    setState((s) => ({ ...s, currentBreakpoint: breakpoint }));
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
    const { setState } = this.context;
    setState((s) => ({ ...s, compactType: compactType }));
  }

  onLayoutChange(layout, layouts) {
    this.props.onLayoutChange(layout, layouts);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: generateLayout() },
    });
    const { setState } = this.context;
    setState((s) => ({ ...s, lg: generateLayout() }));
  }

  onDrop = (layout, layoutItem, _event) => {
    if (
      _event.dataTransfer.getData("type") === "remoteApp" ||
      _event.dataTransfer.getData("type") === "remoteApp2"
    ) {
      this.setState({
        layouts: {
          lg: this.state.layouts.lg.concat({
            i: this.state.newCounter.toString(),
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h + 0.5,
            additional: _event.dataTransfer.getData("type"),
          }),
        },
        newCounter: this.state.newCounter + 1,
      });
      const { setState } = this.context;
      setState((s) => ({
        ...s,
        layouts: {
          lg: this.state.layouts.lg.concat({
            i: this.state.newCounter.toString(),
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h + 0.5,
            additional: _event.dataTransfer.getData("type"),
          }),
        },
      }));
    }
  };

  handlePublish = () => {
    console.log(this.state.layoutRef);
    const layoutCopy = this.state.layoutRef.current.cloneNode(true);
    layoutCopy.firstChild.style.background = "unset";
    layoutCopy.firstChild
      .querySelectorAll(".react-grid-item")
      .forEach((item) => {
        item.style.resize = "none";
        item.style.border = "none";
        item.style.background = "unset";
      });
    this.props.pageRef.current = layoutCopy;
    this.props.navigate("/home");
  };

  render() {
    const { state } = this.context;
    console.log("state", state);
    return (
      <>
        <div className="flex" style={{ marginTop: "5rem" }}>
          {/* <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button> */}
          <div className="w-full" ref={state.layoutRef}>
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
              style={{ width: "7rem" }}
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
              style={{ width: "7rem" }}
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
