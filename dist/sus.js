"use strict";

define(["react", "dist/name_map"], function (React, NameMap) {
    return function (controllerName, callback) {
        var answers = {};
        var SUS = React.createClass({
            displayName: "SUS",

            submit: function submit() {
                window.log.saveLog("sus evaluation results", controllerName, answers);
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function selectedAnswer(row, index, selected) {
                // TODO
                for (var i = 0; i < 5; i++) {
                    delete answers[row + "_" + i];
                }
                answers[row + "_" + index] = selected;
            },
            render: function render() {
                var that = this,
                    questionTexts = ["I think that I would like to use this system frequently", "I found the system unnecessarily complex", "I thought the system was easy to use", "I think that I would need the support of a technical person to be able to use this system", "I found the various functions in this system were well integrated", "I thought there was too much inconsistency in this system", "I would imagine that most people would learn to use this system very quickly", "I found the system very cumbersome to use", "I felt very confident using the system", "I needed to learn a lot of things before I could get going with this system"],
                    btnFnBuilder = function btnFnBuilder(row, i) {
                    return function (event) {
                        that.selectedAnswer(row, i, event.target.checked);
                    };
                },
                    questions = questionTexts.map(function (text, row) {
                    var buttons = [];
                    for (var i = 0; i < 5; i++) {
                        buttons.push(React.createElement(
                            "td",
                            { style: { width: "16%" } },
                            React.createElement(
                                "div",
                                null,
                                React.createElement("input", {
                                    type: "radio",
                                    name: "sus-radio-row-" + row,
                                    id: "sus-radio-row-" + row + "-id-" + i,
                                    onChange: btnFnBuilder(row, i)
                                })
                            )
                        ));
                    }
                    return React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            { scope: "row" },
                            text
                        ),
                        buttons
                    );
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
                            " Usability Questionnaire for ",
                            NameMap(this.props.controllerName)
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row", style: { "paddingTop": "20px", "paddingBottom": "10px" } },
                        "Now that you've completed an evaluation for the ",
                        NameMap(this.props.controllerName),
                        " controller, we'd like to ask you to assess its usability."
                    ),
                    React.createElement(
                        "div",
                        { className: "row", style: { "paddingTop": "20px", "paddingBottom": "10px" } },
                        React.createElement(
                            "strong",
                            null,
                            "Please fill the following questions to the best of your ability."
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "table",
                            { className: "table table-striped" },
                            React.createElement(
                                "thead",
                                null,
                                " ",
                                React.createElement(
                                    "tr",
                                    null,
                                    React.createElement("td", null),
                                    React.createElement(
                                        "td",
                                        null,
                                        "Strongly ",
                                        React.createElement("br", null),
                                        " Disagree"
                                    ),
                                    React.createElement("td", null),
                                    React.createElement("td", null),
                                    React.createElement("td", null),
                                    React.createElement(
                                        "td",
                                        null,
                                        "Strongly ",
                                        React.createElement("br", null),
                                        " Agree"
                                    )
                                ),
                                " "
                            ),
                            React.createElement(
                                "tbody",
                                null,
                                questions
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "row", style: { "paddingBottom": "20px" } },
                        React.createElement(
                            "center",
                            null,
                            React.createElement(
                                "button",
                                { className: "btn btn-default btn-lg", onClick: this.submit },
                                "Submit"
                            )
                        )
                    )
                );
            }
        });

        React.render(React.createElement(SUS, { controllerName: controllerName }), document.getElementById("content"));
    };
});
//# sourceMappingURL=sus.js.map
