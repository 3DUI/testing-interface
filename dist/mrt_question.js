"use strict";

define(["react"], function (React) {
    return React.createClass({
        selectedAnswer: function selectedAnswer(event, questionNum) {
            this.props.selectedAnswer(this.props.qid, questionNum, event.target.checked);
        },

        render: function render() {
            var that = this;
            var questions = [];
            var labels = [];
            for (var i = 0; i < 4; i++) {
                (function (index) {
                    questions.push(React.createElement(
                        "div",
                        { key: "checkbox_q_" + i, className: "checkbox" },
                        React.createElement(
                            "label",
                            null,
                            React.createElement("input", { type: "checkbox", onChange: function (event) {
                                    that.selectedAnswer(event, index + 1);
                                } }),
                            index + 1
                        )
                    ));
                })(i);
            }
            for (var i = 0; i < 4; i++) {
                (function (index) {
                    labels.push(React.createElement(
                        "div",
                        { key: "label_q_" + i, style: { "position": "absolute", "left": 250 + 135 * index + "px" } },
                        React.createElement(
                            "b",
                            null,
                            index + 1
                        )
                    ));
                })(i);
            }
            return React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "h3",
                    null,
                    "Q",
                    this.props.num
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { style: { "position": "relative", "paddingBottom": "30px" } },
                        React.createElement("img", { src: this.props.imgSrc }),
                        labels
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "b",
                        null,
                        "Which two drawings match the one on the left?"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "row" },
                    questions
                )
            );
        }
    });
});
//# sourceMappingURL=mrt_question.js.map
