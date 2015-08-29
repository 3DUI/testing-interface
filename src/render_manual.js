define(["react","marked"], function(React, Marked){
    return function(rawMarkup, name,  callback){
        var Manual = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            render: function(){
                var nameMap = {
                    discrete: "Discrete Sliders",
                    twoaxis:  "Two Axis Valuator",
                    arcball: "Arcball"},
                    controllerName = nameMap[this.props.name],
                    markup = Marked(this.props.rawMarkup.toString());
                return <div id="manual" className="container">
                    <div className="row" dangerouslySetInnerHTML={{__html: markup}} >
                    </div>
                    <div className="row">
                        <div className="row">
                            <legend>Ready to start?</legend>
                            Are you ready to start the training session for {controllerName}? Once you click confirm, the training will start immediately.
                        </div>
                        <div className="row">
                          <button className="btn btn-default" onClick={this.submit}>Confirm</button>
                        </div>
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
