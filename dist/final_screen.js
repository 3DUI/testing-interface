"use strict";

define(["react"], function (React) {
    return function () {
        var FinalScreen = React.createClass({
            displayName: "FinalScreen",

            render: function render() {

                return React.createElement(
                    "div",
                    { id: "final", className: "container-fluid" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-6 col-xs-offset-3" },
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "legend",
                                    null,
                                    "Thank you for completing the experiment!"
                                ),
                                "You have now completed all the required activities for the experiment. Thank you for your participation. Please email steveryb@gmail.com the following string so he can renumerate you for your time.",
                                React.createElement("pre", { dangerouslySetInnerHTML: { __html: window.log.getRawSavedLogs() } })
                            )
                        )
                    )
                );
            }
        });

        React.render(React.createElement(FinalScreen, null), document.getElementById("content"));
    };
});
//# sourceMappingURL=final_screen.js.map
