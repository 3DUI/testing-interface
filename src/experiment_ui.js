define(["react"], function(React){
    return React.createClass({
        render: function(){
            var timerDiv = this.props.timed === "true" ? <h4 id="timer"></h4> : "";
            var controllerButtons = this.props.showControllerSelection === "true" ? 
                        <div classname="row" style={{display:"none"}}>
                            <span><h5>Select rotation controller</h5></span>
                            <button id="discrete" className="btn btn-default">Discrete</button>
                            <button id="two-axis" className="btn btn-default">Two-Axis Valuator</button>
                            <button id="arcball" className="btn btn-default">Arcball</button>
                        </div> : "";
            return <div id="experiment" className="container-fluid" style={{padding:0+'px'}}>
                <div classname="row">
                    <legend id="header-tasks"></legend>
                    <h4 id="header-explanation"></h4>
                    {timerDiv}
                </div>
                <div classname="row" style={{position:'relative'}} id="three"></div>
                <div classname="row" id="orientation-labels">
                    <div className="col-xs-6">
                        <center>
                        <div classname="row">
                            <h4>Reference Orientation</h4>
                        </div>
                        </center>
                    </div>
                    <div className="col-xs-6">
                        <center>
                        <div classname="row">
                            <h4>Model to Rotate</h4>
                        </div>
                        </center>
                    </div>
                </div>
                <div className="row" id="inspection-labels">
                    <div className="col-xs-12">
                        <center>
                        <div classname="row">
                            <h4>Model to Rotate</h4>
                        </div>
                        </center>
                    </div>
                </div>
                <div classname="row">
                    <legend></legend>
                    <div className="col-xs-6">
                    </div>
                    <div className="col-xs-12 controls">
                        <center>
                        <div classname="row">
                        </div>
                        <div classname="row">
                            <span><h5>Task Controls</h5></span>
                            <button id="save" className="btn btn-default">Submit Task</button>
                            <button id="reload" className="btn btn-default">Reset Orientation</button>
                            <button id="undo" className="btn btn-default">Undo Task Submission</button>
                        </div>
                        {controllerButtons}
                        </center>
                    </div>
                </div>
            </div>
        }
    });
});
