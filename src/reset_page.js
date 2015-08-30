define(["react"], function(React){
    return function(callback){
        var ResetPage = React.createClass({
            submit: function(reset){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback(reset);
            },
            render: function(){
                var that = this;
                return <div id="confirm" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3">
                            <div className="form-group">
                                <legend>Resume previous session</legend>
                                We have detected that you abandoned a previous session. Would you like to resume it? Note that if you chose to abandon this session, there will be no way to recover that data.
                            </div>
                              <button className="btn btn-default" onClick={function(){that.submit(false)}}>Resume</button>
                              <button className="btn btn-default" onClick={function(){that.submit(true)}}>Restart (possibly losing data)</button>
                          </div>
                    </div>
                </div>
            }
        });

        React.render(
            <ResetPage name={name} />,
            document.getElementById("content")
        );
    }
});
