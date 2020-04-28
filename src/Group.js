
var Group = function(){
    this.group;
}

Group.prototype.countDead = function(){
    return this.group.countDead();
}

Group.prototype.getFirstDead = function(){
    return this.group.getFirstDead();
}

Group.prototype.getFirstExists = function(arg){ // what is this arg
    return this.group.getFirstExists(arg);
}

Group.prototype.getGroup = function(){
    return this.group;
}
