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
                        <div className="row">
                            <legend>Continue</legend>
                            Press below to confirm you've understood everything above and are ready to continue. If you need to refer back to anything you've read above, please use the paper versions. 
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
