define(["react"], function(React){
    return function(){
        var FinalScreen = React.createClass({
            render: function(){

                return <div id="final" className="container-fluid">
                    <div className="row">
                        <div className="col-xs-6 col-xs-offset-3">
                            <div className="row">
                                <legend>Thank you for completing the experiment!</legend>
                                You have now completed all the required activities for the experiment. Thank you for your participation. Please see the experimental facilitator for your renumeration.
                            </div>
                        </div>
                    </div>
                </div>
            }
        });

        React.render(
            <FinalScreen />,
            document.getElementById("content")
        );
    }
});
