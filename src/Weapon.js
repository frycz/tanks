
var Weapon = function(game,config){
    
    /*
     * {
                fireRate: 3000,
                fireSound: 'bomb',
                explosionSound: 'kaboom',
                explosionSprite: '...',
                bulletSprite: 'bullet'
            }
     */
    
    this.game = game; 
    this.config = config;
    this.power = this.config.power;
    this.fireSound = this.config.fireSound;
    this.fireRate = this.config.fireRate;
    this.bulletSpeed = this.config.bulletSpeed;
    this.explosions = new Explosions(this.game,30,this.config.explosionSprite,this.config.explosionSound);
    this.playerBullets = new Bullets(this.game,30,this.config.bulletSprite,this.explosions,this.config.power);
    
    
}

Weapon.prototype.getFireRate = function(){
    return this.fireRate;
}

Weapon.prototype.getBullets = function(){
    return this.playerBullets;
}

Weapon.prototype.getFireSound = function(){
    return this.fireSound;
}

Weapon.prototype.getBulletSpeed = function(){
    return this.bulletSpeed;
}

Weapon.prototype.getPower = function(){
    return this.power;
}

Weapon.prototype.createExplosions = function(){
    // this call is shit...
    this.explosions.create();
}


/*
Weapon.prototype.fire = function(x,y){
    var bullet = this.playerBullets.getFirstExists(false); // no arguments implemented in bullets. to fix
        bullet.reset(x,y);

        bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed, this.game.input.activePointer, 0);
        this.shotSound.play();
}*/