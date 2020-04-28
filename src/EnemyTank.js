
var EnemyTank = function (index, game, player, _x, _y, moveSound, explosionSound, speed, health, fireRateCoef) {

    var x = _x || game.world.randomX;
    var y = _y || game.world.randomY;

    this.game = game;
    this.health = health || 100;
    this.player = player;
    this.fireRateCoef = fireRateCoef || 1;
    this.weaponPower;
    this.minFireRate = 1000;
    this.maxSpeed = speed || 300;
    this.actualMaxSpeed = this.maxSpeed;
    this.bulletSpeed = 1000;
    this.actionRate = 60*5; // change enemy action every 5 seconds
    this.oldAngle = 0;
    this.angleChange = 30 + 40*Math.random(); // rotate 30deg during one action
    this.nextFire = 0;
    this.nextAction = 0;
    
    this.chasePlayer = false;
    
    this.alive = true;
    this.velocity = 0;
    
    this.moveSound = moveSound;
    this.explosionSound = explosionSound;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5);
    //this.tank.anchor.set(0.5);
    this.tank.anchor.setTo(0.5, 0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    
    this.tank.enemy = this;
    
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    //this.tank.body.immovable = true;//false;
    this.tank.body.collideWorldBounds = true;
    //this.tank.body.bounce.setTo(1, 1);


    this.tank.angle = game.rnd.angle();
    this.oldAngle = this.tank.angle;
    //game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
    
    // set that moveSound was not played
    this.soundPlayed = false;
    
    var style = { font: "15px Arial", fill: "#ffffff" };  
    this.label_score = this.game.add.text(0,0, "", style);
    
};

EnemyTank.prototype.damage = function(damageValue) {

    this.health -= damageValue;
    this.actualMaxSpeed -= damageValue;
    if(this.actualMaxSpeed < 0){
        this.actualMaxSpeed = 0;
    }

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();
        this.label_score.destroy();
        
        this.explosionSound.play();
    }
}

EnemyTank.prototype.installWeapon = function(weapon){
    
    
    this.fireRate = this.fireRateCoef*weapon.getFireRate();
    this.bullets = weapon.getBullets();
    this.fireSound = weapon.getFireSound();
    this.bulletSpeed = weapon.getBulletSpeed();
    this.weaponPower = weapon.getPower();
    
    weapon.createExplosions();
}

EnemyTank.prototype.getTankValue = function(){
    return this.bulletSpeed*this.actualMaxSpeed*this.weaponPower/(this.fireRate*100);
}

EnemyTank.prototype.getBullets = function(){
    return this.bullets;
}

EnemyTank.prototype.decideToFire = function(){
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, this.bulletSpeed);
            
            this.fireSound.play();
            // when tank stops - enable sound playing when move
            //this.soundPlayed = false;
        }
}

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;
    
    this.label_score.setText('life: ' + this.health);
    this.label_score.x = this.tank.x - 40;
    this.label_score.y = this.tank.y - 50;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    this.velocity = this.actualMaxSpeed;
    if(this.actualMaxSpeed < this.maxSpeed){
       this.actualMaxSpeed = this.actualMaxSpeed + 0.5;
    }
    
    if(!this.player.player.isAlive()){
        return;
    }
    
    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        if(this.velocity > 0){
            this.velocity = this.velocity - 50;
            this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
        }

        this.decideToFire();
        
    } else if(this.game.physics.arcade.distanceBetween(this.tank, this.player) < 600){
        
        this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
        
        this.decideToFire();
        
        // tank moves toward player, check if sound can be played
        if(!this.soundPlayed){
            this.moveSound.play();
            // mark that sound was played to avoid constant sound playing
            this.soundPlayed = true;
        }
        
    }else {
        
       // this.velocity = 0; // make tank not move
        if(this.game.time.now > this.nextAction){
            
            this.nextAction = this.game.time.now + this.actionRate;
            
            this.chasePlayer = false;
            
            var chooseAction = Math.random();
            
            if(chooseAction < 0.5){
                this.oldAngle = this.tank.angle;
            } else {
                this.chasePlayer = true;
            }
            
        }
        
        if(this.tank.angle < this.oldAngle + this.angleChange){
            this.tank.angle++
        }
        if(this.chasePlayer){
            this.velocity = this.actualMaxSpeed;
            this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
        }
        
            // tank is far away. Enable sound playing then moves toward player
            this.soundPlayed = false;
    }
    
    this.game.physics.arcade.velocityFromRotation(this.tank.rotation, this.velocity, this.tank.body.velocity);

};
