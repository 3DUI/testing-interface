define(["jquery"], function($){
    return function(callback){
        $("#experiment").hide();
       var enteredNumber = function(){
           return parseInt($("#participant_input").val());
       };
        
       $("#submit-participant-number").click(function(){ 
           var val = enteredNumber();
           if(val){
                window.log.meta.participantNumber = val;
                $("#capture").hide();
                callback();
           } else {
                alert("Participant numbers are only integers. Please enter a valid integer");
           }
       });
    };
});
