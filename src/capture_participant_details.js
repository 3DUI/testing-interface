define(["react", "dist/experiment_design"], function(React, ExperimentalDesign){
    return function(callback){
        var CaptureParticipants = React.createClass({
            handleChange: function(event){
                this.setState({value: parseInt(event.target.value)});
            },
            submit: function(){
               var val = this.state.value;
               if(val){
                    window.log.meta.participantNumber = val;
                    window.log.meta.experimentDesign = ExperimentalDesign(val);
                    React.unmountComponentAtNode(document.getElementById('content'));
                    callback();
               } else {
                    alert("Participant numbers are only integers. Please enter a valid integer");
               }
            },
            render: function(){
                return <div id="capture" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3">
                            <div className="row">
                                <legend>Welcome</legend>
                                Thank you for participating in our experiment! Before you begin, could you please enter your participant number below. Once you've submitted, you will be given instructions for how to use the interface.
                            </div>
                            <div className="row">
                                <legend>Participant Information</legend>
                                <div className="form-group">
                                      <label className="col-md-4 control-label" for="participant_input">Particpant Number</label>  
                                        <div className="col-md-5">
                                              <input id="participant_input" name="participant_input" type="text" placeholder="12345" className="form-control input-md" min="0" step="1" data-bind="value:replyNumber" required="" onChange={this.handleChange} />
                                                <span className="help-block">The participant number given to you, attached to your formal consent forms.</span>  
                                       </div>
                                </div>

                              <button id="submit-participant-number" className="btn  btn-default" onClick={this.submit}>Submit</button>
                            </div>
                          </div>
                    </div>
                </div>
            }
        });

        React.render(
            <CaptureParticipants />,
            document.getElementById("content")
        );
    };
});
