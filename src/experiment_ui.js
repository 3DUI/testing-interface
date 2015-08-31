define(["react"], function(React){
    return React.createClass({
        render: function(){
            var timerDiv = this.props.timed === "true" ? <h4 id="timer"></h4> : "";
            var controllerButtons = this.props.showControllerSelection === "true" ? 
                        <div className="row" style={{display:"none"}}>
                            <span><h5>Select rotation controller</h5></span>
                            <button id="discrete" className="btn btn-default">Discrete</button>
                            <button id="two-axis" className="btn btn-default">Two-Axis Valuator</button>
                            <button id="arcball" className="btn btn-default">Arcball</button>
                        </div> : "";
            return <div id="experiment" className="container-fluid">
                <div className="row">
                    <legend id="header-tasks"></legend>
                    <h4 id="header-explanation"></h4>
                    {timerDiv}
                </div>
                <div className="row" style={{position:'relative'}} id="three"></div>
                <div className="row" id="orientation-labels">
                    <div className="col-xs-6">
                        <center>
                        <div className="row">
                            <h4>Reference Orientation</h4>
                        </div>
                        </center>
                    </div>
                    <div className="col-xs-6">
                        <center>
                        <div className="row">
                            <h4>Model to Rotate</h4>
                        </div>
                        </center>
                    </div>
                </div>
                <div className="row" id="inspection-labels">
                    <div className="col-xs-12">
                        <center>
                        <div className="row">
                            <h4>Model to Rotate</h4>
                        </div>
                        </center>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 controls">
                        <center>
                        <div className="row">
                            <button id="reload" style={{margin:"5px"}} className="btn btn-default">Reset Model Orientation</button>
                        </div>
                        {controllerButtons}
                        </center>
                    </div>
                    <div className="col-xs-6">
                        <center>
                        <div className="row">
                            <button id="save" className="btn btn-default">Submit Task</button>
                        </div>
                        </center>
                    </div>
                </div>
            </div>
        }
    });
});
