
var Bullets = function(game,size,spriteName,explosion,power){
    
    this.game = game;
    this.group = this.game.add.group();
    this.bullets = this.group;
    this.power = power;
    
    this.explosion = explosion;
    
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(size, spriteName);
    // bullets.createMultiple(30, 'bullet', 0, false); <- used to create player bullets
    
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    
    
}

Bullets.prototype = new Group();
Bullets.prototype.constructor = Bullets;

Bullets.prototype.getFirstDead = function(){
    
    var bullets = this;
    var bullet = this.group.getFirstDead();
    bullet.power = this.power;
    
    bullet.explode = function(x,y){
        bullets.explosion.play(x,y);
        this.kill();
    }
    return bullet;
}

Bullets.prototype.getFirstExists = function(arg){ // what is this arg
    
    var bullets = this;
    var bullet =  this.group.getFirstExists(arg);
    bullet.power = this.power;
    
    bullet.explode = function(x,y){
        bullets.explosion.play(x,y);
        this.kill();
    }
    return bullet;
}

