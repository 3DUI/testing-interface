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
                var that = this;
                var qImages = ["images/instructions_4.png", 
                    "images/intro_3a.png",
                    "images/intro_4a.png"],
                    questions = qImages.map(function(src, i){
                      return <MRTQuestion key={"intro_"+i} num={i+2} imgSrc={src} selectedAnswer={that.selectedAnswer} qid={"intro_"+i}/>  
                    });
                return <div id="confirm" className="container">
                    <div className="row">
                        <h1> MRT Instructions (2/3) </h1>
                    </div>
                    {questions}
                    <div className="row">
                        <img
                            src={'images/instructions_5.png'}
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
