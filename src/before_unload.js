define(function(){
    BeforeUnloadController = {
        stopUnload: function(){
            window.onbeforeunload = function(){
                return "Closing this window may result in losing experimental results. Are you sure you want to exit?";
            }
        },

        allowUnload: function(){
            window.onbeforeunload = null;
        }
    };
    return BeforeUnloadController;
});
