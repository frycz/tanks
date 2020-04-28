
var Explosions = function(game,size,spritesheetName,explosionSound){
   
   this.game = game;
   this.group = null;
   this.size = size;
   this.spritesheetName = spritesheetName;
   this.explosions = null;
   this.explosionSound = explosionSound;

    
}

Explosions.prototype = new Group();
Explosions.prototype.constructor = Explosions;

Explosions.prototype.create = function(){
    
    this.explosions = this.game.add.group();
    this.group = this.explosions;
    var explosionAnimation = null;
    
    for (var i = 0; i < this.size; i++)
    {
        explosionAnimation = this.explosions.create(0, 0, this.spritesheetName, [0], false);
        //explosionAnimation.scale.setTo(0.8,0.8);
        explosionAnimation.scale.setTo(1,1);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add(this.spritesheetName);
    }
}

Explosions.prototype.play = function(x,y){
    var explosionAnimation = this.getFirstExists(false);
    explosionAnimation.bringToTop();
    explosionAnimation.reset(x, y);
    explosionAnimation.play('kaboom', 30, false, true);
    this.explosionSound.play();
}
