"use strict";

define(["react", "marked"], function (React, Marked) {
    return function (rawMarkup, callback) {
        var Manual = React.createClass({
            displayName: "Manual",

            submit: function submit() {
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function render() {
                var markup = Marked(this.props.rawMarkup.toString());
                return React.createElement(
                    "div",
                    { id: "manual", className: "container" },
                    React.createElement("div", { className: "row", dangerouslySetInnerHTML: { __html: markup } }),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "form-group" },
                            React.createElement(
                                "legend",
                                null,
                                "Continue"
                            ),
                            "Press the button below to confirm you've understood everything above and are ready to continue. If you need to refer back to anything read above, you can consult the hard copy of the manual."
                        ),
                        React.createElement(
                            "button",
                            { className: "btn btn-default", onClick: this.submit },
                            "Ready to Continue"
                        )
                    )
                );
            }
        });

        React.render(React.createElement(Manual, { rawMarkup: rawMarkup, name: name }), document.getElementById("content"));
    };
});
//# sourceMappingURL=render_manual.js.map
