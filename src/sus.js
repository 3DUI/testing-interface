define(["react"], function(React){
    return function(controllerName, callback){
        var SUS = React.createClass({
            submit: function(){
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function(row, index, selected){
                // TODO
            },
            render: function(){
                var that = this;
                var nameMap = {
                    discrete: "Discrete Sliders",
                    twoaxis:  "Two Axis Valuator",
                    arcball: "Arcball"},
                    questionTexts = [
                        "I think that I would like to use this system frequently",
                        "I found the system unnecessarily complex",
                        "I thought the system was easy to use",
                        "I think that I would need the support of a technical person to be able to use this system",
                        "I found the various functions in this system were well integrated",
                        "I thought there was too much inconsistency in this system",
                        "I would imagine that most people would learn to use this system very quickly",
                        "I found the system very cumbersome to use",
                        "I felt very confident using the system",
                        "I needed to learn a lot of things before I could get going with this system",
                    ],
                    btnFnBuilder = function(row, i){
                        return function(event){
                            that.selectedAnswer(row, i, event.target.checked);
                        }
                    },
                    questions = questionTexts.map(function(text, row){
                        var buttons = [];
                        for(var i = 0; i < 5; i++){
                            buttons.push(
                                <td>
                                    <div class="radio">
                                        <input 
                                            type="radio" 
                                            name={"sus-radio-row-"+row} 
                                            id={"sus-radio-row-"+row+"-id-"+i}
                                            onChange={btnFnBuilder(row, i)}
                                            />
                                    </div>
                                </td>
                            );
                        }
                        return <tr>
                            <th scope="row">{text}</th>
                            {buttons}
                        </tr>
                    });
                return <div id="confirm" className="container">
                    <div className="row">
                        <h1> Usability Questionnaire for {nameMap[this.props.controllerName]}</h1>
                    </div>
                    <div className="row">
                        <table className="table table-bordered">
                            <thead> <tr>
                                <td></td>
                                <td>Strongly Disagree</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Strongly Agree</td>
                            </tr> </thead>
                            <tbody>
                                {questions}
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                      <button className="btn btn-default" onClick={this.submit}>Confirm</button>
                    </div>
                </div>
            }
        });

        React.render(
            <SUS controllerName={controllerName}/>,
            document.getElementById("content")
        );
    }
});
