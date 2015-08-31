define(["react", "dist/mrt_question", "dist/timer"], function(React, MRTQuestion,Timer){
    return function(callback){
        var TEST_LIMIT = 10*60*1000;
        var answers = {};
        var Test = React.createClass({
            selectedAnswer: function(qid, num, selected){
                answers[qid+"_"+num] = selected;
            },
            render: function(){
                var that = this;
                var qImages = [],
                    questions;

                for(var i = 1; i <= 24; i++){
                    qImages.push("images/"+i+"a.png");
                }
                questions = qImages.map(function(src, i){
                  return <MRTQuestion num={i+1} imgSrc={src} selectedAnswer={that.selectedAnswer} qid={"test_"+i}/>  
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
        
        var timerCallback = function(){
            React.unmountComponentAtNode(document.getElementById('content'));
            window.log.saveLog("mrt test results", answers);
            callback();
        };
        var timer = new Timer("#timer", TEST_LIMIT, timerCallback);
        timer.start();
    }
});
