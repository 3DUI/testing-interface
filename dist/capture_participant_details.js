"use strict";

define(["react", "dist/local_object"], function (React, LocalObject) {
    return function (callback) {
        var CaptureParticipants = React.createClass({
            displayName: "CaptureParticipants",

            handleChange: function handleChange(event) {
                this.setState({ value: parseInt(event.target.value) });
            },
            submit: function submit() {
                var val = this.state.value;
                if (val) {
                    React.unmountComponentAtNode(document.getElementById('content'));
                    var participantNumber = new LocalObject("participant_number", true);
                    participantNumber.set("val", val);
                    window.log.meta.participant_number = val;
                    window.log.saveLog("entered participant number", val);
                    callback();
                } else {
                    alert("Participant numbers are only integers. Please enter a valid integer");
                }
            },
            render: function render() {
                return React.createElement(
                    "div",
                    { id: "capture", className: "container-fluid" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "col-xs-8 col-xs-offset-2" },
                            React.createElement(
                                "div",
                                { className: "row" },
                                React.createElement(
                                    "legend",
                                    null,
                                    "Welcome"
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    "Thank you for participating in our evaluation of rotation controllers. Before you begin, could you please enter your participant number below. Once you've submitted this, you will be given instructions for how the experiment will progress."
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "row", style: { "paddingTop": "10px" } },
                                React.createElement(
                                    "div",
                                    { className: "form-group" },
                                    React.createElement(
                                        "label",
                                        { className: "col-md-4 control-label", htmlFor: "participant_input" },
                                        "Particpant Number"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "col-md-5" },
                                        React.createElement("input", { id: "participant_input", name: "participant_input", type: "text", placeholder: "12345", className: "form-control input-md", min: "0", step: "1", "data-bind": "value:replyNumber", required: "", onChange: this.handleChange }),
                                        React.createElement(
                                            "span",
                                            { className: "help-block" },
                                            "The participant number given to you, attached to your formal consent forms."
                                        )
                                    )
                                ),
                                React.createElement(
                                    "button",
                                    { id: "submit-participant-number", className: "btn  btn-default", onClick: this.submit },
                                    "I confirm I have signed the informed consent form for this experiment"
                                )
                            )
                        )
                    )
                );
            }
        });

        React.render(React.createElement(CaptureParticipants, null), document.getElementById("content"));
    };
});
//# sourceMappingURL=capture_participant_details.js.map
