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
                var that = this;
                var qImages = ["images/instructions_4.png", "images/intro_3a.png", "images/intro_4a.png"],
                    questions = qImages.map(function (src, i) {
                    return React.createElement(MRTQuestion, { key: "intro_" + i, num: i + 2, imgSrc: src, selectedAnswer: that.selectedAnswer, qid: "intro_" + i });
                });
                return React.createElement(
                    "div",
                    { id: "confirm", className: "container" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "h1",
                            null,
                            " MRT Instructions (2/2) "
                        )
                    ),
                    questions,
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement("img", {
                            src: 'images/instructions_5.png'
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
//# sourceMappingURL=mrt_2.js.map
