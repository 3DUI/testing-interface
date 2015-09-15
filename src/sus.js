define(["react", "dist/name_map"], function(React, NameMap){
    return function(controllerName, callback){
        var answers = {};
        var SUS = React.createClass({
            submit: function(){
                window.log.saveLog("sus evaluation results", controllerName, answers);
                React.unmountComponentAtNode(document.getElementById('content'));
                callback();
            },
            selectedAnswer: function(row, index, selected){
                for(var i = 0; i < 5; i++){
                    delete answers[row+"_"+i];
                }
                answers[row+"_"+index] = selected;
            },
            render: function(){
                var that = this,
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
                                <td key={"td_"+row+"_"+i} style={{width: "16%"}}>
                                    <div>
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
                        return <tr key={"row_"+row}>
                            <th scope="row">{text}</th>
                            {buttons}
                        </tr>
                    });
                return <div id="confirm" className="container">
                    <div className="row">
                        <h1> Usability Questionnaire for {NameMap(this.props.controllerName)}</h1>
                    </div>
                    <div className="row" style={{"paddingTop": "20px", "paddingBottom":"10px"}}>
                        Now that you've completed an evaluation for the {NameMap(this.props.controllerName)} controller, we'd like to ask you to assess its usability.
                    </div>
                    <div className="row" style={{"paddingTop": "20px", "paddingBottom":"10px"}}>
                        <strong>Please complete the following questions to the best of your ability.</strong>
                    </div>
                    <div className="row">
                        <table className="table table-striped">
                            <thead> <tr>
                                <td></td>
                                <td>Strongly <br /> Disagree</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Strongly <br /> Agree</td>
                            </tr> </thead>
                            <tbody>
                                {questions}
                            </tbody>
                        </table>
                    </div>
                    <div className="row" style={{"paddingBottom":"20px"}}>
                      <center>
                      <button className="btn btn-default btn-lg" onClick={this.submit}>Submit</button>
                      </center>
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
