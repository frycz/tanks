
var Items = function(x,y,game,size,spriteName,randomize){
    
    this.game = game;
    this.group = this.game.add.group();
    this.tracks = this.group;

    this.tracks.enableBody = true;
    this.tracks.physicsBodyType = Phaser.Physics.ARCADE;

    for(var i = 0; i < size; i++){
        if(randomize){
            x = game.world.randomX;
            y = game.world.randomY;
        }
        var track = this.tracks.create(x, y, spriteName);
        track.name = 'track_' + i;
        track.body.immovable = true;
    }
    
    
}

Items.prototype = new Group();
Items.prototype.constructor = Items;

