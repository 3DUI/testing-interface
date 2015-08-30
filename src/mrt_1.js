define(["react", "dist/mrt_question"], function(React, MRTQuestion){
    return function(callback){
        var Instructions = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function(id, num, selected){
                // TODO
            },
            render: function(){
                return <div id="confirm" className="container">
                    <div className="row">
                        <h1> MRT Instructions (1/2) </h1>
                    </div>
                    <div className="row">
                        We now would like you to complete the Mental Rotations tests. The instructions for this test are below.
                    </div>
                    <div className="row">
                        <img
                            src={'images/instructions_1.png'}
                        />
                    </div>
                    <MRTQuestion num="1" qid="intro" imgSrc="images/instructions_2.png" selectedAnswer={this.selectedAnswer}/>
                    <div className="row">
                        <img
                            src={'images/instructions_3.png'}
                        />
                    </div>
                    <div className="row">
                      <button className="btn btn-default" onClick={this.submit}>Continue</button>
                    </div>
                </div>
            }
        });

        React.render(
            <Instructions/>,
            document.getElementById("content")
        );
    }
});
