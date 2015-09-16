"use strict";

define(["react"], function (React) {
    return function (headerText, text, buttonText, callback) {
        var NextScreen = React.createClass({
            displayName: "NextScreen",

            submit: function submit() {
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function render() {
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
                                    headerText
                                ),
                                this.props.text
                            ),
                            React.createElement(
                                "button",
                                { className: "btn btn-default", onClick: this.submit },
                                this.props.buttonText
                            )
                        )
                    )
                );
            }
        });

        React.render(React.createElement(NextScreen, { text: text, buttonText: buttonText }), document.getElementById("content"));
    };
});
//# sourceMappingURL=next_screen.js.map
