"use strict";

define(["react"], function (React) {
    return React.createClass({
        render: function render() {
            var timerDiv = this.props.timed === "true" ? React.createElement("h4", { id: "timer" }) : "";
            var controllerButtons = this.props.showControllerSelection === "true" ? React.createElement(
                "div",
                { className: "row", style: { display: "none" } },
                React.createElement(
                    "span",
                    null,
                    React.createElement(
                        "h5",
                        null,
                        "Select rotation controller"
                    )
                ),
                React.createElement(
                    "button",
                    { id: "discrete", className: "btn btn-default" },
                    "Discrete"
                ),
                React.createElement(
                    "button",
                    { id: "two-axis", className: "btn btn-default" },
                    "Two-Axis Valuator"
                ),
                React.createElement(
                    "button",
                    { id: "arcball", className: "btn btn-default" },
                    "Arcball"
                )
            ) : "";
            return React.createElement(
                "div",
                { id: "experiment", className: "container-fluid" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement("legend", { id: "header-tasks" }),
                    React.createElement("h4", { id: "header-explanation" }),
                    timerDiv
                ),
                React.createElement("div", { className: "row", style: { position: 'relative' }, id: "three" }),
                React.createElement(
                    "div",
                    { className: "row", id: "orientation-labels" },
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "h4",
                                    null,
                                    "Reference Orientation"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "h4",
                                    null,
                                    "Model to Rotate"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row", id: "inspection-labels" },
                    React.createElement(
                        "div",
                        { className: "col-xs-12" },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "h4",
                                    null,
                                    "Model to Rotate"
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-xs-6 controls" },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "button",
                                    { id: "reload", style: { margin: "5px" }, className: "btn btn-default" },
                                    "Reset Model Orientation"
                                )
                            ),
                            controllerButtons
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "col-xs-6" },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "button",
                                    { id: "save", className: "btn btn-default" },
                                    "Submit Task"
                                )
                            )
                        )
                    )
                )
            );
        }
    });
});
//# sourceMappingURL=experiment_ui.js.map
