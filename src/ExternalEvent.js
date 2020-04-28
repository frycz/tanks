// Observer
function ExternalEvent(sender) {
    this._sender = sender;
    this._listeners = [];
    this._names = [];
    this._callers = [];
}

ExternalEvent.prototype = {
    detach : function (name){
        var self = this;
        for(var i = 0; i < self._names.length; i++){
            if(self._names[i] == name){
                self._listeners.splice(i, 1);
                self._callers.splice(i, 1);
                self._names.splice(i, 1);
            }
        }
    },
    attach : function (caller,listener,name) {
        var self = this;
        // allowPush not needed. Can be deleted
        var allowPush = true;
        if(!name){
            name = '';
        }
        if(allowPush){
            self._listeners.push(
                function(object,actualCaller,args){
                    if(caller == actualCaller){
                        listener(object,actualCaller,args);
                    }
                } 
            )
            self._names.push(name);
            self._callers.push(caller);
        }

        return this._listeners.length;
    },
    notify : function (actualCaller,args) {
        //debugger;
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, actualCaller, args);
            
            // check if result is a view
            
        }
    },
    clear: function(){
        this._listeners = [];
    }
};