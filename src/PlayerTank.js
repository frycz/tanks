
// bullet, enemies array
var PlayerTank = function(x,y,game,cursors,bullets/*,enemies*/,shotSound, explosionSound,spaceKey, targetSprite){
    
    // game :-)
    // bullets - Bullets object
    // enemies - array of EnemyTank objects
    // cursors - game cursors ref
    
    this.life = 100;
    
    this.maxSpeed = 340;
    this.fireRate = 3000;
    this.minFireRate = 1000;
    this.bulletSpeed = 1000;
    this.nextFire = 0;
    
    this.actualWeaponLevel = 0;//0;
    
    this.fireAllowed = false;
    
    this.enemies;
    this.target;
    
    this.targetChangeTime = 3*60; // 3s
    this.actualTargetChangeTime = 0;
    
    this.game = game;
    this.cursors = cursors;
    this.spaceKey = spaceKey;
    this.bullets = bullets;
    //this.enemies = enemies; // ?
    this.targetSprite = targetSprite;
    
    this.shotSound = shotSound;
    this.explosionSound = explosionSound;
    
    //this.player = this;
    
    this.shadow = game.add.sprite(x, y, 'tank', 'shadow');
    this.shadow.anchor.setTo(0.5, 0.5);
    
    this.tank = this.game.add.sprite(x, y, 'tank', 'tank1');
    this.tank.player = this;
    this.tank.anchor.setTo(0.5, 0.5);
    
    // is it used?
    this.tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    this.game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    ///tank.body.drag.set(0.2);
    //this.tank.body.maxVelocity.setTo(400, 400); ??
    this.tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    this.turret = this.game.add.sprite(x, y, 'tank', 'turret');
    this.turret.anchor.setTo(0.3, 0.5);
    
    this.spaceKey.onDown.add(this.allowFire, this);
    this.spaceKey.onUp.add(this.disableFire, this);
    
    
}

PlayerTank.prototype.allowFire = function(){
    this.fireAllowed = true;
}
PlayerTank.prototype.disableFire = function(){
    this.fireAllowed = false;
}

PlayerTank.prototype.getTarget = function(enemies){
    
    var tankX = this.tank.x;
    var tankY = this.tank.y;
    var enemyNumber = 0;
    var enemyDistance = Math.sqrt(Math.pow((tankX - enemies[0].tank.x),2) + Math.pow((tankY - enemies[0].tank.y),2));

    for(var i = 1; i < enemies.length; i++){
        if(enemies[i].alive){
            var e_x = enemies[i].tank.x;
            var e_y = enemies[i].tank.y;
            var tmpEnemyDistance = Math.sqrt(Math.pow((tankX - e_x),2) + Math.pow((tankY - e_y),2));
            if(tmpEnemyDistance < enemyDistance){
                enemyDistance = tmpEnemyDistance;
                enemyNumber = i;
            }
        }
    }
    
    return enemies[enemyNumber].tank;
}

PlayerTank.prototype.update = function(enemies){
    
    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    if(this.target === undefined || this.actualTargetChangeTime > this.targetChangeTime){
        this.target = this.getTarget(enemies);
        this.actualTargetChangeTime = 0;
    } else {
        this.actualTargetChangeTime++;
    }

    this.targetSprite.x = this.target.x;
    this.targetSprite.y = this.target.y;
    //this.turret.rotation = this.game.physics.arcade.angleToPointer(this.turret);
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.target);
     
    if (/*this.game.input.activePointer.isDown || */this.fireAllowed)
    {
        //  Boom!
        this.fire();

    }
    
    if (this.cursors.left.isDown)
    {
        this.tank.angle -= 4;
    }
    else if (this.cursors.right.isDown)
    {
        this.tank.angle += 4;
    }

    if (this.cursors.up.isDown)
    {
        //  The speed we'll travel at
        this.currentSpeed = this.maxSpeed;
    }
    else
    {
        if (this.currentSpeed > 0)
        {
            this.currentSpeed -= 4;
        }
    }
    if (this.currentSpeed > 0)
    {
        this.game.physics.arcade.velocityFromRotation(this.tank.rotation, this.currentSpeed, this.tank.body.velocity);
    }
}

PlayerTank.prototype.load = function(saveData){
    
    if(saveData != undefined){
        this.life = saveData.life;
        this.maxSpeed = saveData.maxSpeed;
        this.fireRate = saveData.fireRate;
        this.bulletSpeed = saveData.bulletSpeed;
        this.actualWeaponLevel =  saveData.actualWeaponLevel;
    }
}

PlayerTank.prototype.save = function(){
    
    return {
        life: this.life,
        maxSpeed: this.maxSpeed,
        fireRate: this.fireRate,
        bulletSpeed: this.bulletSpeed,
        actualWeaponLevel: this.actualWeaponLevel
    }
}

PlayerTank.prototype.installWeapon = function(weapon){
    
    this.weapon = weapon;
    this.fireRate = weapon.getFireRate();
    this.bullets = weapon.getBullets();
    this.fireSound = weapon.getFireSound();
    this.bulletSpeed = weapon.getBulletSpeed();
    
    weapon.createExplosions();
}


PlayerTank.prototype.fire = function(){

    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
        this.nextFire = this.game.time.now + this.fireRate;

        var bullet = this.bullets.getFirstExists(false); // no arguments implemented in bullets. to fix

        bullet.reset(this.turret.x, this.turret.y);

        //bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed, this.game.input.activePointer, 0);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.target, this.bulletSpeed);
        this.fireSound.play();
    }

}

PlayerTank.prototype.isAlive = function(){
    
    var isPlayerAlive = true;
    
    if(this.life <= 0){
        
        isPlayerAlive = false;
    }
    
    return isPlayerAlive;
}

PlayerTank.prototype.kill = function(){
    this.tank.kill();
    this.explosionSound.play();
}

PlayerTank.prototype.beHitWithPower = function(powerValue,playerProtectionTime){

    if(playerProtectionTime == undefined || playerProtectionTime <= 0){
        this.updateLife(-1*powerValue);
    }
    
    if(!this.isAlive()){
        this.kill();
    }
}

PlayerTank.prototype.updateLife = function(updateValue){
    this.life = this.life + updateValue;
    
    if(updateValue > 0){
        var mask = $('.heart-symbol');
        mask.css({opacity:0.9});
        mask.animate({opacity:0},200);
    } else if(updateValue < 0) {
        var mask = $('.hit-mask');
        mask.css({opacity:0.3});
        mask.animate({opacity:0},200);
    }
    
    this.game.onLifeUpdated.notify('',{
            life: this.life
        })
}
PlayerTank.prototype.getLife = function(){
    return this.life;
}

PlayerTank.prototype.damage = function(){
    
}
