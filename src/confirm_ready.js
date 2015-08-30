define(["react", "dist/name_map"], function(React, NameMap){
    return function(name, callback){
        var ConfirmReady = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function(){
                return <div id="confirm" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3">
                            <div className="form-group">
                                <legend>Confirm</legend>
                                Are you ready to start the evaluation of {NameMap(this.props.name)}? Once you click confirm, the evaluation will start immediately.
                            </div>
                              <button className="btn btn-default" onClick={this.submit}>Confirm</button>
                          </div>
                    </div>
                </div>
            }
        });

        React.render(
            <ConfirmReady name={name} />,
            document.getElementById("content")
        );
    }
});
