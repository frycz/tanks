
var WeaponConfig = (function(){
    
    return {
        config:[
            { // 0
                fireRate: 1500,
                fireSoundName: 'gun_shot',
                explosionSoundName: 'bombexplosion',//'bullet_ricochet',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'gun_bullet',
                power: 7,
                bulletSpeed: 1000,
                
            },
            { // 1
                fireRate: 1500,
                fireSoundName: 'machine_gun_shot',
                explosionSoundName: 'bombexplosion',//'bullet_ricochet',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'machine_gun_bullet',
                power: 15,
                bulletSpeed: 1000
            },
            { // 2
                fireRate: 1500,
                fireSoundName: 'small_fire_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'small_fire_bullet',
                power: 34,
                bulletSpeed: 1000
            },
            { // 3
                fireRate: 1500,
                fireSoundName: 'laser_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'laser_bullet',
                power: 51,
                bulletSpeed: 1000
            },
            { // 4
                fireRate: 1500,
                fireSoundName: 'huge_fire_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'huge_fire_bullet',
                power: 76,
                bulletSpeed: 1000
            },
            { // 5
                fireRate: 1500,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'ultra_violet_bullet',
                power: 101,
                bulletSpeed: 1000
            },
            { // 6
                fireRate: 1000,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'lightblue',
                power: 151,
                bulletSpeed: 1000
            },
            { // 7
                fireRate: 800,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'green',
                power: 201,
                bulletSpeed: 1000
            },
            { // 8
                fireRate: 700,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'greenarrow',
                power: 226,
                bulletSpeed: 1000
            },
            { // 9
                fireRate: 600,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'redarrow',
                power: 251,
                bulletSpeed: 1000
            },
            { // 10
                fireRate: 500,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'yellow',
                power: 301,
                bulletSpeed: 1000
            },
            { // 11
                fireRate: 400,
                fireSoundName: 'ultra_violet_shot',
                explosionSoundName: 'bombexplosion',
                fireSound: null,
                explosionSound: null,
                explosionSprite: 'kaboom',
                bulletSprite: 'violet',
                power: 401,
                bulletSpeed: 1000
            }
        ],
        getWeaponWithLevel: function(level){
            
            if(level > this.config.length - 1){
                level = this.config.length - 1;
            }
            
            if(this.config[level].fireSound === null){
                this.config[level].fireSound = this.sounds[this.config[level].fireSoundName];
            }
            if(this.config[level].explosionSound === null){
                this.config[level].explosionSound = this.sounds[this.config[level].explosionSoundName];
            }
            return this.config[level]
        },
        attachSounds: function(sounds){
            this.sounds = sounds;
        }
    }
 
})();


