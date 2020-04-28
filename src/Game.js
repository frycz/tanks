
(function(Phaser){
    
var game = null;
var gameWidth = null;
var gameHeight = null;


function loadNextLevel(){
    $('#game-info').css({background:'url(images/approved.jpg) no-repeat center center'});
    level++;
    actualDisplayTime = 0;
    
    amoHelpItemsCount = 0;
    speedHelpItemsCount = 0;
    healthHelpItemsCount = 0;
    
    playerSaveData = player.save();
    game.state.start('main');
}

function repeatLevel(){
    //$('body').css({backgroundColor:'#C40000'});
    $('#game-info').css({background:'url(images/badluck.jpg) no-repeat center center'});
    
    actualDisplayTime = 0;
    points = points - (50*level);
    amoHelpItemsCount = amoHelpItemsCount + 2;
    speedHelpItemsCount = speedHelpItemsCount + 2;
    healthHelpItemsCount = healthHelpItemsCount + 2;
    game.state.start('main');
}

function preload () {
    
    
    game.stage.backgroundColor = '#898989';

    game.load.atlas('tank', 'images/tanks.png', 'images/tanks.json');
    game.load.atlas('enemy', 'images/enemy-tanks.png', 'images/tanks.json');
    game.load.image('logo', 'images/logo.png');
    
    //game.load.tilemap('desert', 'images/desert_bad.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'images/desert.png');
    
    // bullets
    game.load.image('gun_bullet', 'images/bubble.png');
    game.load.image('machine_gun_bullet', 'images/bullet2.png');
    game.load.image('small_fire_bullet', 'images/small_fire.png');
    game.load.image('laser_bullet', 'images/blue1.png');
    game.load.image('huge_fire_bullet', 'images/huge_fire.png');
    game.load.image('ultra_violet_bullet', 'images/ultra_violet.png');
    game.load.image('lightblue', 'images/lightblue.png'); // 6
    game.load.image('green', 'images/ultra_violet.png'); // 7
    game.load.image('greenarrow', 'images/greenarrow.png'); // 8
    game.load.image('redarrow', 'images/redarrow.png'); // 9
    game.load.image('yellow', 'images/yellow.png'); // 10
    game.load.image('violet', 'images/violet.png'); // 11
   
    game.load.audio('gun_shot','images/gun_shot.wav');
    game.load.audio('machine_gun_shot','images/machine_gun2.wav');
    game.load.audio('small_fire_shot','images/fireball.wav');
    game.load.audio('laser_shot','images/laser_gun_shot.wav');
    game.load.audio('huge_fire_shot','images/fireball2.wav');
    game.load.audio('ultra_violet_shot','images/ultra_violet_shot.mp3');
    
    game.load.image('earth', 'images/light_sand.png');
    
    game.load.audio('bombexplosion','images/bomb_explosion.wav');
    game.load.audio('bullet_ricochet','images/bullet_ricochet.mp3');
    game.load.audio('tankexplosion','images/tank_explosion.wav');
    game.load.audio('tankmove','images/sherman.wav');
    game.load.audio('collected','images/collected.wav');
    
    game.load.audio('amunation_collected','images/gun_reload.wav');
    game.load.audio('health_collected','images/health_collected.wav');
    game.load.audio('speed_collected','images/speed_collected.mp3');
    
    game.load.audio('lost_sound','images/lost_sound.wav');
    
    game.load.image('tracks', 'images/tracks.png');
    
    game.load.image('target', 'images/target.png');
    
    game.load.image('amunation_item', 'images/amunation_item.png');
    game.load.image('health_item', 'images/heart_small.png');
    game.load.image('speed_item', 'images/speed_item.png');
    
    game.load.image('winner', 'images/winner.png');
    
    game.load.spritesheet('kaboom', 'images/explosion.png', 64, 64, 23);
    
    //game.load.atlas('generic', 'images/skins/generic-joystick.png', 'images/skins/generic-joystick.json');
    
    game.load.image('winner', 'images/badluck.jpg');
    game.load.image('winner', 'images/start.png');
    game.load.image('winner', 'images/approved.jpg');
    
}

var player;
var playerBullets;

var points = 0;
var level = 1;

var land;

var enemies = [];
var enemyBullets;
var enemiesTotal;
var enemiesAlive;
var explosions;

var amoItems;
var healthItems;
var speedItems;

var targetSprite;

var playerWeapon;

var logo;

var cursors;
var spaceKey;

var shotSound;
var bombExplosionSound;
var tankExplosionSound;
var enemyMoveSound;
var collectedSound;

var amunationCollectedSound;
var healthCollectedSound;
var speedCollectedSound;

var lostSound;

var playerProtectionTime = 0;//10*60;

var informationDisplayTime = 2*60;
var actualDisplayTime = 0;

var playerSaveData = null;

var amoItemsCount = 10;
var speedItemsCount = 10;
var healthItemsCount = 10;

var amoHelpItemsCount = 0;
var speedHelpItemsCount = 0;
var healthHelpItemsCount = 0;

var map;
var layer;

var timer = Date.now()
var counter = 0;

function create () {

    bombExplosionSound = game.add.audio('bombexplosion');
    tankExplosionSound = game.add.audio('tankexplosion');
    enemyMoveSound = game.add.audio('tankmove');
    collectedSound = game.add.audio('collected');
    
    amunationCollectedSound = game.add.audio('amunation_collected');
    healthCollectedSound = game.add.audio('health_collected');
    speedCollectedSound = game.add.audio('speed_collected');
    
    lostSound = game.add.audio('lost_sound');
    
    shotSound = game.add.audio('gun_shot');
    
    WeaponConfig.attachSounds({
        
        gun_shot: shotSound,
        machine_gun_shot: game.add.audio('machine_gun_shot'),
        small_fire_shot: game.add.audio('small_fire_shot'),
        laser_shot: game.add.audio('laser_shot'),
        huge_fire_shot: game.add.audio('huge_fire_shot'),
        ultra_violet_shot: game.add.audio('ultra_violet_shot'),
        
        bombexplosion: bombExplosionSound,
        bullet_ricochet: game.add.audio('bullet_ricochet')

    })
    

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 5000, 5000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, gameWidth, gameHeight, 'earth');
    land.fixedToCamera = true;
    
    /*
    var map = game.add.tilemap('desert');
    map.addTilesetImage('Desert', 'tiles');
    map.fixedToCamera = true;
    
    var layer = map.createLayer('Ground');*/
    /*
    //  The 'mario' key here is the Loader key given in game.load.tilemap
    map = game.add.tilemap('desert');

    //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
    //  The second parameter maps this name to the Phaser.Cache key 'tiles'
    map.addTilesetImage('Desert', 'tiles');

    //  Creates a layer from the World1 layer in the map data.
    //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
    
    map.setCollisionByExclusion([]);
    layer = map.createLayer('Ground');
*/
    //  This resizes the game world to match the layer dimensions
    //layer.resizeWorld();

    cursors = game.input.keyboard.createCursorKeys();

    spaceKey = this.game.input.keyboard.addKey(70);
    

    explosions = new Explosions(game,20,'kaboom',bombExplosionSound);
    
    //playerBullets = new Bullets(game,30,'bullet',explosions);
    targetSprite = game.add.sprite(-1000, -1000, 'target');
    targetSprite.anchor.setTo(0.5,0.5);

    player = new PlayerTank(2000,2000,game,cursors,playerBullets,shotSound,tankExplosionSound,spaceKey,targetSprite);
    
    
    
    enemyBullets = new Bullets(game,100,'gun_bullet',explosions);
    
    
    // create enemies
    
    enemies = [];
    
    /*
     (index, game, player, _x, _y, moveSound, explosionSound, speed, health, fireRate)
     {
                healthItems: 20,
                weaponItems: 20,
                speedItems: 20,
                tanks: [
                    {
                        count: 5,
                        weaponLevel: 1,
                        speed: 500,
                        fireRate: 1000,
                        health: 200
                    }
                ]
                
            }
     */

    enemiesTotal = 0;
    enemiesAlive = 0;
    
    var levelConfig = LevelConfig.get(level);
    for(var i = 0; i < levelConfig.tanks.length; i++){
        for(var j = 0; j < levelConfig.tanks[i].count; j++){
        
            enemies.push(new EnemyTank(i, game, player.tank, 200, 100 + j*100, enemyMoveSound, tankExplosionSound,levelConfig.tanks[i].speed,levelConfig.tanks[i].health,levelConfig.tanks[i].fireRateCoef));
            var enemyWeapon = new Weapon(game,WeaponConfig.getWeaponWithLevel(levelConfig.tanks[i].weaponLevel));
            enemies[enemiesTotal].installWeapon(enemyWeapon);
            
            enemiesTotal++;
            enemiesAlive++;
        }
    }
    
    amoItemsCount = levelConfig.healthItemsCount + amoHelpItemsCount;
    speedItemsCount = levelConfig.weaponItemsCount + speedHelpItemsCount;
    healthItemsCount = levelConfig.speedItemsCount + healthHelpItemsCount;
    
    if(playerSaveData != null){
            playerWeapon = new Weapon(game,WeaponConfig.getWeaponWithLevel(Math.floor(playerSaveData.actualWeaponLevel/10)));
            player.installWeapon(playerWeapon);
            player.load(playerSaveData);
    } else {
        playerWeapon = new Weapon(game,WeaponConfig.getWeaponWithLevel(Math.floor(player.actualWeaponLevel/10)));
        player.installWeapon(playerWeapon);
    }
    
    explosions.create();

    
    amoItems = new Items(game.world.randomX, game.world.randomY, game, amoItemsCount, 'amunation_item', true);
    speedItems = new Items(game.world.randomX, game.world.randomY, game, speedItemsCount, 'speed_item', true);
    healthItems = new Items(game.world.randomX, game.world.randomY, game, healthItemsCount, 'health_item', true);


    game.camera.follow(player.tank);

    game.camera.focusOnXY(0, 0);

    //var pad = this.game.plugins.add(Phaser.VirtualJoystick);
    
    //var stick = pad.addStick(0, 0, 200, 'generic');
    //this.stick.alignBottomLeft(20);

    //var buttonA = pad.addButton(500, 520, 'generic', 'button1-up', 'button1-down');
    //buttonA.onDown.add(function(){console.log('pressed')}, this);
    
    var playerLife = player.getLife();
    var armor = (playerLife - 100 > 0) ? playerLife - 100 : 0;
    var life = playerLife - armor;
    
    $('#life-bar').css({width: life + '%'});
    $('#armor-bar').css({width: armor + '%'});
    

    game.onLifeUpdated.attach('',function(sender,caller,args){

    var armor = (args.life - 100 > 0) ? args.life - 100 : 0;
    var life = args.life - armor;
    
    $('#life-bar').css({width: life + '%'});
    $('#armor-bar').css({width: armor + '%'});
    
}   )

$('body').css({backgroundColor:'white'});
$('#game-info').css({background:'none'});

}

function removeLogo () {

    game.input.onDown.remove(removeLogo, this);
    logo.kill();

}

function update () {

    var current = Date.now()
    var diff = current - timer
    diff > 16 && console.log(diff)
    timer = current
    
    if(playerProtectionTime > 0){
        playerProtectionTime--;
    }

    counter++
    var condition = counter%3

    player.update(enemies);

    land.tilePosition.x = -game.camera.x;
land.tilePosition.y = -game.camera.y;

    if (condition) {
    // where should it be???
    game.physics.arcade.overlap(enemyBullets.group, player.tank, bulletHitPlayer, null, this);
    
    //game.physics.arcade.overlap(tracks.group, player.tank, playerCollectsTracks, null, this);
    
    
    game.physics.arcade.overlap(amoItems.group, player.tank, playerCollectsAmo, null, this);
    game.physics.arcade.overlap(healthItems.group, player.tank, playerCollectsHealth, null, this);
    game.physics.arcade.overlap(speedItems.group, player.tank, playerCollectsSpeed, null, this);
    
   /*game.physics.arcade.collide(amoItems.group, player.tank);
   game.physics.arcade.collide(healthItems.group, player.tank);
   game.physics.arcade.collide(speedItems.group, player.tank);*/
    game.physics.arcade.overlap(player.weapon.getBullets().group, layer, bulletHitWall, null, this);
   
   game.physics.arcade.collide(player.tank, layer);
    }

    enemiesAlive = 0;
    
    

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;

            if (condition) {
            game.physics.arcade.collide(player.tank, enemies[i].tank);
            
            for(var j = i + 1; j < enemies.length; j++){
                game.physics.arcade.collide(enemies[i].tank, enemies[j].tank);
            }
            // here should be enemies collision defined
            game.physics.arcade.overlap(player.weapon.getBullets().group, enemies[i].tank, bulletHitEnemy, null, this);
            //game.physics.arcade.overlap(tracks.group, enemies[i].tank, enemyCollectsTracks, null, this);
            game.physics.arcade.overlap(enemies[i].getBullets().group, player.tank, bulletHitPlayer, null, this);
            
            game.physics.arcade.overlap(enemies[i].getBullets().group, layer, bulletHitWall, null, this);
            //bulletHitWall
            
            game.physics.arcade.collide(enemies[i].tank, layer, function(tank,layer){
                tank.rotation = tank.rotation + 90;
            });
        }
            
            enemies[i].update();
        }
    }
    
    if(enemiesAlive == 0){
        if(informationDisplayTime > actualDisplayTime){
            actualDisplayTime++;
        } else {
            loadNextLevel();
        }
    }

    

}

function enemyCollectsTracks(enemyTank,track){
    track.kill();
    
    var enemy = enemyTank.enemy;
    
    var decision = Math.random();

    // make decision what to upgrade
    // this function is a glue between track items and enemy tanks
    // 
    // one thing can be improved: give upgradeHealth,... methods to protect properties

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


function playerCollectsAmo(playerTank,track){
    
    // this function is a glue between track items and player
    // get and set methods can be implemented in player object
    
    var player = playerTank.player;
    
    track.kill();

    // weapon level test
    player.actualWeaponLevel = player.actualWeaponLevel + 2;
    if(player.actualWeaponLevel%10 == 0){
        var weaponLevel = player.actualWeaponLevel/10;
        player.installWeapon(new Weapon(game,WeaponConfig.getWeaponWithLevel(weaponLevel)));
    } else {
        player.fireRate = 0.95*player.fireRate;
    }
    
    amunationCollectedSound.play();
}

function playerCollectsHealth(playerTank,track){
    
    // this function is a glue between track items and player
    // get and set methods can be implemented in player object
    
    var player = playerTank.player;
    
    track.kill();
    
    if(player.life < 200){
        player.updateLife(10);
    }


    healthCollectedSound.play();
}

function playerCollectsSpeed(playerTank,track){
    
    // this function is a glue between track items and player
    // get and set methods can be implemented in player object
    
    var player = playerTank.player;
    
    track.kill();

    if(player.maxSpeed < 800){
        player.maxSpeed = player.maxSpeed + 15;
    }


    speedCollectedSound.play();
}

function bulletHitPlayer (playerTank, bullet) {

    var explosionX = playerTank.x;
    var explosionY = playerTank.y;
    
    var player = playerTank.player;
    
    bullet.explode(explosionX,explosionY);
    
    // let's set default damage as 10
    var bulletPower = 10;
    if(bullet.power){
        bulletPower = bullet.power;
    }
    
    player.beHitWithPower(bulletPower,playerProtectionTime);
    
    if(!player.isAlive()){
        //var logo = game.add.sprite(200, 300, 'logo');
        //logo.fixedToCamera = true;
        repeatLevel();
    } 
}

function bulletHitEnemy (enemyTank, bullet) {

    var explosionX = enemyTank.x;
    var explosionY = enemyTank.y;
    
    // let's set default damage as 10
    var bulletPower = 34;
    if(bullet.power){
        bulletPower = bullet.power;
    }

    bullet.explode(explosionX,explosionY);

    var enemy = enemyTank.enemy;

    enemy.damage(bulletPower);
    
    if(!enemy.alive){
        points = points + enemy.getTankValue();
    }

}

function bulletHitWall (bullet,wall) {

    var explosionX = bullet.x;
    var explosionY = bullet.y;

    //wall.destroy(); not working
    bullet.explode(explosionX,explosionY);

}

function render () {

    // //game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    //game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
    $('.killed').html((enemiesTotal - enemiesAlive) + ' / ' + enemiesTotal);
    
    //game.debug.text('Life: ' + player.life + '%', 32, 64);
    //game.debug.text('Fire rate: ' + Phaser.Math.roundTo((1/(player.fireRate/1000)),-2) + ' bullets/s', 32, 96);
    //game.debug.text('Max speed: ' + (player.maxSpeed/10) + ' mph', 32, 128);
    $('#max-speed').css("width", (player.maxSpeed/800)*100+"%");
    $('.max-speed-level').html((player.maxSpeed/10)+" mph");
    
    if(playerProtectionTime > 0){
        //game.debug.text('Protection time for: ' + Phaser.Math.roundTo(((playerProtectionTime)/60),-2) + ' s', 32, 160);
    }
    
    var load = Phaser.Math.roundTo(((player.fireRate - (player.nextFire - game.time.now))/player.fireRate)*100);
    var loadInfo = (load < 100)? 'Loading...' + load + '%' : 'Fire!';
    
    
    if(load < 100){
        
        if($('#fire').hasClass('progress-bar-warning')){
            $('#fire').removeClass('progress-bar-warning').addClass('progress-bar-danger');
        }
        if($('.fire-info').hasClass('fire')){
            $('.fire-info').html('Loading...');
            $('.fire-info').removeClass('fire').addClass('loading');
        }

        $('#fire').css("width", load+"%");
        
    } else {
        
        $('#fire').css("width", "100%");
        
        if($('#fire').hasClass('progress-bar-danger')){
            $('#fire').removeClass('progress-bar-danger').addClass('progress-bar-warning');
        }
        if($('.fire-info').hasClass('loading')){
            $('.fire-info').html('Fire!');
            $('.fire-info').removeClass('loading').addClass('fire');
        }
    }
    
    //game.debug.text(loadInfo, 32, 192);
    
    //game.debug.text('Points: ' + Math.round(points), 32, 224);
    $('.points').html(Math.round(points));
    
    //game.debug.text('Level: ' + level, 32, 256);
    $('.level').html(level);
    
    //game.debug.text('WeaponLevel: ' + player.actualWeaponLevel, 32, 288);
    $('#weapon-level').css("width", (player.actualWeaponLevel%10)*10+"%");
    $('.next-weapon-level').html((player.actualWeaponLevel%10)*10+"%");
    
    if(enemiesAlive == 0){
        //var winner = game.add.sprite(437, 300, 'winner');
        //winner.fixedToCamera = true;
        //game.debug.text('Victory!!!', 32, 320);
    }
    
}

function start(){
    
gameWidth = $(window).width();
gameHeight = $(window).height();// - 100;

game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, 'tanks',null,true,false);

//var game = new Phaser.Game(window.width, window.height, Phaser.AUTO, 'tanks');

// events
game.onLifeUpdated = new ExternalEvent(this);
game.onLifeUpdated = new ExternalEvent(this);
    
    game.state.add('main', { preload: preload, create: create, update: update, render: render });
    game.state.add('boot', { preload: function(){
        game.stage.backgroundColor = '#222222';
    }, create: create, update: update, render: render });

    game.state.start('boot');
    game.state.start('main');
}

$('#play-now').click(function(){
    $('#welcome-screen').hide();
    $('#panel-top').show();
    $('#panel-bottom').show();
    $('#hit-mask').show();
    $('#game-info').show();
    start();
})

    
})(Phaser);