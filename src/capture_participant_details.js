define(["src/rotating_models","jquery"], function(RotatingModels, $){
    // TODO: make this control which set of tasks is loaded
    return function(){

        $("#experiment").hide();
       var enteredNumber = function(){
           return parseInt($("#participant_input").val());
       };
        
       $("#submit-participant-number").click(function(){ 
           var val = enteredNumber();
           if(val){
                window.log.meta.participantNumber = val;
                RotatingModels();
                $("#capture").hide();
                $("#experiment").show();
           } else {
                alert("Participant numbers are only integers. Please enter a valid integer");
           }
       });
    };
});
