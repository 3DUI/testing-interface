define(["react","marked"], function(React, Marked){
    return function(rawMarkup, callback){
        var Manual = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function(){
                var markup = Marked(this.props.rawMarkup.toString());
                return <div id="manual" className="container">
                    <div className="row" dangerouslySetInnerHTML={{__html: markup}} >
                    </div>
                    <div className="row">
                        <div className="form-group">
                            <legend>Continue</legend>
                            Press the button below to confirm you've understood everything above and are ready to continue. If you need to refer back to anything read above, you can consult the hard copy of the manual.
                        </div>
                          <button className="btn btn-default" onClick={this.submit}>Ready to Continue</button>
                    </div>
                </div>
            }
        });

        React.render(
            <Manual rawMarkup={rawMarkup} name={name} />,
            document.getElementById("content")
        );
    }
});
