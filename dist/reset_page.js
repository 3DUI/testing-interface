"use strict";

define(["react"], function (React) {
    return function (callback) {
        var ResetPage = React.createClass({
            displayName: "ResetPage",

            submit: function submit(reset) {
                React.unmountComponentAtNode(document.getElementById('content'));
                callback(reset);
            },
            render: function render() {
                var that = this;
                return React.createElement(
                    "div",
                    { id: "confirm", className: "container-fluid" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-6 col-xs-offset-3" },
                            React.createElement(
                                "div",
                                { className: "form-group" },
                                React.createElement(
                                    "legend",
                                    null,
                                    "Resume previous session"
                                ),
                                "We have detected that you abandoned a previous session. Would you like to resume it? Note that if you chose to abandon this session, there will be no way to recover that data."
                            ),
                            React.createElement(
                                "button",
                                { className: "btn btn-default", onClick: function () {
                                        that.submit(false);
                                    } },
                                "Resume"
                            ),
                            React.createElement(
                                "button",
                                { className: "btn btn-default", onClick: function () {
                                        that.submit(true);
                                    } },
                                "Restart (possibly losing data)"
                            )
                        )
                    )
                );
            }
        });

        React.render(React.createElement(ResetPage, { name: name }), document.getElementById("content"));
    };
});
//# sourceMappingURL=reset_page.js.map
