define(["react", "dist/local_object"], function(React, LocalObject){
    return function(callback){
        var CaptureParticipants = React.createClass({
            handleChange: function(event){
                this.setState({value: parseInt(event.target.value)});
            },
            submit: function(){
               var val = this.state.value;
               if(val){
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
            render: function(){
                return <div id="capture" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-8 col-xs-offset-2">
                            <div className="row">
                                <legend>Welcome</legend>
                                <div>Thank you for participating in our evaluation of rotation controllers. Before you begin, could you please enter your participant number below. Once you've submitted this, you will be given instructions for how the experiment will progress.</div>
                            </div>
                            <div className="row" style={{"padding-top":"10px"}}>
                                <div className="form-group">
                                      <label className="col-md-4 control-label" htmlFor="participant_input">Particpant Number</label>  
                                        <div className="col-md-5">
                                              <input id="participant_input" name="participant_input" type="text" placeholder="12345" className="form-control input-md" min="0" step="1" data-bind="value:replyNumber" required="" onChange={this.handleChange} />
                                                <span className="help-block">The participant number given to you, attached to your formal consent forms.</span>  
                                       </div>
                                </div>

                              <button id="submit-participant-number" className="btn  btn-default" onClick={this.submit}>I confirm I have signed the informed consent form for this experiment</button>
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
