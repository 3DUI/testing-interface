"use strict";

define(["react", "dist/mrt_question"], function (React, MRTQuestion) {
    return function (callback) {
        var Instructions = React.createClass({
            displayName: "Instructions",

            submit: function submit() {
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function selectedAnswer(id, num, selected) {
                // TODO
            },
            render: function render() {
                return React.createElement(
                    "div",
                    { id: "confirm", className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "h1",
                            null,
                            " MRT Instructions (1/2) "
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row", style: { "paddingBottom": "15px" } },
                        "What follows is the instructions for the Mental Rotations Test (MRT). First, we present two pages of instructions. The answers you provide in these sections are not recorded and are provided for practice purposes only."
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement("img", {
                            src: 'images/instructions_1.png'
                        })
                    ),
                    React.createElement(MRTQuestion, { num: "1", qid: "intro", imgSrc: "images/instructions_2.png", selectedAnswer: this.selectedAnswer }),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement("img", {
                            src: 'images/instructions_3.png'
                        })
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "button",
                            { className: "btn btn-default", onClick: this.submit },
                            "Continue"
                        )
                    )
                );
            }
        });

        React.render(React.createElement(Instructions, null), document.getElementById("content"));
    };
});
//# sourceMappingURL=mrt_1.js.map
