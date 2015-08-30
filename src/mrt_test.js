define(["react", "dist/mrt_question", "dist/timer"], function(React, MRTQuestion,Timer){
    return function(callback){
        var Test = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function(id, num, selected){
                // TODO
            },
            render: function(){
                var that = this;
                var qImages = [],
                    questions;

                for(var i = 1; i <= 24; i++){
                    qImages.push("images/"+i+"a.png");
                }
                questions = qImages.map(function(src, i){
                  return <MRTQuestion imgSrc={src} selectedAnswer={that.selectedAnswer} qid={"test_"+i}/>  
                });
                return <div id="confirm" className="container">
                    <div className="row">
                        <h1> MRT Test </h1>
                        <h2 id="timer"></h2>
                    </div>
                    {questions}
                </div>
            }
        });

        React.render(
            <Test/>,
            document.getElementById("content")
        );
        
        var timer = new Timer("#timer", 1000*5, callback);
        timer.start();
    }
});
