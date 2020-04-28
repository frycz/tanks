
EnemyTank = function (index, game, player, bullets, _x, _y) {

    var x = _x || game.world.randomX;
    var y = _y || game.world.randomY;

    this.game = game;
    this.health = 100;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 3000;
    this.minFireRate = 1000;
    this.maxSpeed = 300;
    this.actionRate = 5000; // change enemy action every 5 seconds
    this.oldAngle = 0;
    this.angleChange = 90 + 180*Math.random(); // rotate 30deg during one action
    this.nextFire = 0;
    this.nextAction = 0;
    this.alive = true;
    this.velocity = 0;

    this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');

    this.shadow.anchor.set(0.5);
    //this.tank.anchor.set(0.5);
    this.tank.anchor.setTo(0.5, 0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.tank.name = index.toString();
    this.tank.enemyTank = this;
    game.physics.enable(this.tank, Phaser.Physics.ARCADE);
    //this.tank.body.immovable = true;//false;
    this.tank.body.collideWorldBounds = true;
    //this.tank.body.bounce.setTo(1, 1);


    this.tank.angle = game.rnd.angle();
    this.oldAngle = this.tank.angle;
    //game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
    
    this.soundPlayed = false;
};

EnemyTank.prototype.damage = function() {

    this.health -= 34;

    if (this.health <= 0)
    {
        this.alive = false;

        this.shadow.kill();
        this.tank.kill();
        this.turret.kill();
        
        return true;
    }

    return false;

}

EnemyTank.prototype.update = function() {

    this.shadow.x = this.tank.x;
    this.shadow.y = this.tank.y;
    this.shadow.rotation = this.tank.rotation;

    this.turret.x = this.tank.x;
    this.turret.y = this.tank.y;
    this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);

    this.velocity = this.maxSpeed;
    
    if (this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300)
    {
        this.velocity = 0;

        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.turret.x, this.turret.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 1000);
            
            shot.play();
            this.soundPlayed = false;
        }
    } else if(this.game.physics.arcade.distanceBetween(this.tank, this.player) < 600){
        
        this.tank.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
        
        if(!this.soundPlayed){
            sherman.play();
            this.soundPlayed = true;
        }
        
    }else {
        
        //this.velocity = 0; // make tank not move
        if(this.game.time.now > this.nextAction){
            
            this.nextAction = this.game.time.now + this.actionRate;
            
            this.oldAngle = this.tank.angle;
            
        }
        
        if(this.tank.angle < this.oldAngle + this.angleChange){
            this.tank.angle++
        }
        
        this.soundPlayed = false;
    }
    
    game.physics.arcade.velocityFromRotation(this.tank.rotation, this.velocity, this.tank.body.velocity);

};

var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'tanks', { preload: preload, create: create, update: update, render: render });

function preload () {

    game.load.atlas('tank', 'images/tanks.png', 'images/tanks.json');
    game.load.atlas('enemy', 'images/enemy-tanks.png', 'images/tanks.json');
    game.load.image('logo', 'images/logo.png');
    game.load.image('bullet', 'images/bullet.png');
    game.load.image('earth', 'images/light_sand.png');
    
    game.load.audio('gunshot','images/gun_shot.wav');
    game.load.audio('bombexplosion','images/bomb_explosion.wav');
    game.load.audio('tankexplosion','images/tank_explosion.wav');
    game.load.audio('sherman','images/sherman.wav');
    
    game.load.image('tracks', 'images/tracks.png');
    game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);
    
}

var land;

var shadow;
var tank;
var turret;

var life = 100;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;
var tracks;
var maxSpeed = 300;

var logo;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 3000;
var minFireRate = 1000;
var nextFire = 0;

var protectionTime = 10*60;

function create () {
    
    shot = game.add.audio('gunshot');
    expl = game.add.audio('bombexplosion');
    tankExpl = game.add.audio('tankexplosion');
    sherman = game.add.audio('sherman');

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 4000, 4000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 1200, 800, 'earth');
    land.fixedToCamera = true;

    //  The base of our tank
    tank = game.add.sprite(2000, 2000, 'tank', 'tank1');
    tank.anchor.setTo(0.5, 0.5);
    tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    //  This will force it to decelerate and limit its speed
    game.physics.enable(tank, Phaser.Physics.ARCADE);
    ///tank.body.drag.set(0.2);
    tank.body.maxVelocity.setTo(400, 400);
    tank.body.collideWorldBounds = true;

    //  Finally the turret that we place on-top of the tank body
    turret = game.add.sprite(0, 0, 'tank', 'turret');
    turret.anchor.setTo(0.3, 0.5);

    //  The enemies bullet group
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(100, 'bullet');
    
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    //  Create some baddies to waste :)
    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemyTank(i, game, tank, enemyBullets, 200, 100 + i*100));
    }

    //  A shadow below our tank
    shadow = game.add.sprite(0, 0, 'tank', 'shadow');
    shadow.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    
    tank.bringToTop();
    turret.bringToTop();

    //  Explosion pool
    explosions = game.add.group();

    for (var i = 0; i < 20; i++)
    {
        var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
        explosionAnimation.anchor.setTo(0.5, 0.5);
        explosionAnimation.animations.add('kaboom');
    }
    
    tracks = game.add.group();
    tracks.enableBody = true;
    tracks.physicsBodyType = Phaser.Physics.ARCADE;

    for(var i = 0; i < 60; i++){
        var track = tracks.create(game.world.randomX, game.world.randomY, 'tracks');
        track.name = 'track_' + i;
        track.immovable = true;
    }

    //logo = game.add.sprite(200, 300, 'logo');
    //logo.fixedToCamera = true;

    game.input.onDown.add(removeLogo, this);

    game.camera.follow(tank);
    // disable deadzone
    ////game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function update () {
    
    if(protectionTime > 0){
        protectionTime--;
    }

    game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
    game.physics.arcade.overlap(tracks, tank, playerCollectsTracks, null, this);

    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(tank, enemies[i].tank);
            game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
            game.physics.arcade.overlap(tracks, enemies[i].tank, enemyCollectsTracks, null, this);
            enemies[i].update();
        }
    }

    if (cursors.left.isDown)
    {
        tank.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        tank.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = maxSpeed;
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed > 0)
    {
        game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    //  Position all the parts and align rotations
    shadow.x = tank.x;
    shadow.y = tank.y;
    shadow.rotation = tank.rotation;

    turret.x = tank.x;
    turret.y = tank.y;

    turret.rotation = game.physics.arcade.angleToPointer(turret);

    if (game.input.activePointer.isDown)
    {
        //  Boom!
        fire();
        
        
    }

}

function bulletExplosion(x,y){
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(x, y);
    explosionAnimation.play('kaboom', 30, false, true);
}

function enemyCollectsTracks(tank,track){
    track.kill();
    //debugger;
    console.log('enemy upgraded');
    
    var enemy = tank.enemyTank;
    var decision = Math.random();

    if(decision < 0.40){
        if(enemy.fireRate - 20 >= enemy.minFireRate){
            enemy.fireRate = enemy.fireRate - 50;
        }
    } else if(decision < 0.80){
        enemy.health = enemy.health + 10;
    } else {
        enemy.maxSpeed = enemy.maxSpeed + 15;
    }
}

function playerCollectsTracks(player,track){
    track.kill();
    
    var decision = Math.random();

    if(decision < 0.40){
        if(fireRate - 20 >= minFireRate){
            fireRate = fireRate - 50;
        }
    } else if(decision < 0.80){
        life = life + 10;
    } else {
        maxSpeed = maxSpeed + 15;
    }
}

function bulletHitPlayer (tank, bullet) {
    
    var bulletPower = 10;
    if(bullet.power){
        bulletPower = bullet.power;
    }
    
    if(protectionTime <= 0){
        life = life - bulletPower;
    }

    bullet.kill();
    
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(tank.x, tank.y);
    explosionAnimation.play('kaboom', 30, false, true);
    
    if(life <= 0){
        life = 0;
        tank.kill();
        tankExpl.play();
        var logo = game.add.sprite(200, 300, 'logo');
        logo.fixedToCamera = true;
    }
    
    expl.play();

}

function bulletHitEnemy (tank, bullet) {
    
    // get bullet coors before killing it
    var explosionX = tank.x;
    var explosionY = tank.y;

    bullet.kill();

    var damaged = enemies[tank.name].damage();
    if(damaged){
        tankExpl.play();
    }

    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(explosionX, explosionY);
    explosionAnimation.play('kaboom', 30, false, true);
    
    expl.play();

}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(turret.x, turret.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 0);
        shot.play();
    }

}

function render () {

    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    game.debug.text('Life: ' + life + '%', 32, 64);
    game.debug.text('Fire rate: ' + Phaser.Math.roundTo((1/(fireRate/1000)),-2) + ' bullets/s', 32, 96);
    game.debug.text('Max speed: ' + (maxSpeed/10) + ' mph', 32, 128);
    
    if(protectionTime > 0){
        game.debug.text('Protection time for: ' + Phaser.Math.roundTo(((protectionTime)/60),-2) + ' s', 32, 160);
    }
    
    var load = Phaser.Math.roundTo(((fireRate - (nextFire - game.time.now))/fireRate)*100);
    var loadInfo = (load < 100)? 'Loading...' + load + '%' : 'Fire!';
    
    game.debug.text(loadInfo, 32, 192);
}

