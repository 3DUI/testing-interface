define(["react"], function(React){
    return React.createClass({
        selectedAnswer: function(event, questionNum){
            this.props.selectedAnswer(this.props.qid, questionNum, event.target.checked);
        },

        render: function(){
            var that = this;
            var questions = [];
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
            return <div className="row">
                <h3>Q{this.props.num}</h3>
                <div className="row">
                    <img src={this.props.imgSrc} />
                </div>
                <div className="row">
                    <b>Which two drawings are correct?</b>
                </div>
                <div className="row">
                    {questions}
                </div>
            </div>
        }
    });
});
