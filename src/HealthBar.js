
var HealthBar = function(x,y,healthValue,levelValue,emptyLevelSprite,gotLevelSprite,leftLifeSprite,damagedLifeSprite){
    
    this.health;
    this.level;
    
}

HealthBar.prototype.update = function(x,y,healthValue,levelValue){
    
    var leftLifePoints = Math.round(healthValue/100);
    var damagedLifePoints = 10 - leftLifePoints;
    
    var gotLevelPoints = levelValue;
    var emptyLevelPoints = 5 - levelValue;
}
