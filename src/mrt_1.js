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
                    <div className="row" style={{"padding-bottom":"15px"}}>
                        What follows is the instructions for the Mental Rotations Test (MRT). First, we present two pages of instructions. The answers you provide in these sections are not recorded and are provided for practice purposes only.
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
