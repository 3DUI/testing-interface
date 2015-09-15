define(["react"], function(React){
    return function(headerText, text, buttonText, callback){
        var NextScreen = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function(){
                return <div id="confirm" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3">
                            <div className="form-group">
                                <legend>{headerText}</legend>
                                {this.props.text}
                            </div>
                              <button className="btn btn-default" onClick={this.submit}>{this.props.buttonText}</button>
                          </div>
                    </div>
                </div>
            }
        });

        React.render(
            <NextScreen text={text} buttonText={buttonText}/>,
            document.getElementById("content")
        );
    }
});
