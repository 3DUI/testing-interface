define(["react"], function(React){
    return React.createClass({
        selectedAnswer: function(event, questionNum){
            this.props.selectedAnswer(this.props.qid, questionNum, event.target.checked);
        },

        render: function(){
            var that = this;
            var questions = [];
            var labels = [];
            for(var i = 0; i < 4; i++){
                (function(index){
                    questions.push(
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" onChange={function(event){that.selectedAnswer(event, index+1)}} />
                                {index+1}
                            </label>
                        </div>
                    );
                })(i)
            }
            for(var i = 0; i < 4; i++){
                (function(index){
                    labels.push(
                        <div style={{"position":"absolute", "left":(250+135*index) + "px"}}>
                            <b>{index + 1}</b>
                        </div>
                    )
                })(i)
            }
            return <div className="row">
                <h3>Q{this.props.num}</h3>
                <div className="row">
                    <div style={{"position":"relative", "padding-bottom":"30px"}}>
                        <img src={this.props.imgSrc} />
                        {labels}
                    </div>
                </div>
                <div className="row">
                    <b>Which two drawings match the one on the left?</b>
                </div>
                <div className="row">
                    {questions}
                </div>
            </div>
        }
    });
});
