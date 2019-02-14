// store all players
var players = [];

function Player(){

    // назначаем ид игрока по общему числу игроков
    this.playerId = players.length;
    // определяем позицию
    this.x = 1;
    this.y = 0;
    this.z = 1;
    this.r_x = 0;
    this.r_y = 0;
    this.r_z = 0;
    // определяем размеры
    this.sizeX = 1;
    this.sizeY = 1;
    this.sizeZ = 1;
    // определяем скорость перемещения
    this.speed = 0.1;
    this.turnSpeed = 0.03;

}

var addPlayer = function(id){

    // создаем нового игрока
    var player = new Player();
    // устанавливаем ид игрока
    player.playerId = id;
    // добавляем в массив
    players.push( player );

    return player;
};

var removePlayer = function(player){

    var index = players.indexOf(player);

    if (index > -1) {
        players.splice(index, 1);
    }
};

var updatePlayerData = function(data){
    // получаем игрока по ид
    var player = playerForId(data.playerId);
    // обновляем его координаты
    player.x = data.x;
    player.y = data.y;
    player.z = data.z;
    player.r_x = data.r_x;
    player.r_y = data.r_y;
    player.r_z = data.r_z;

    return player;
};

var playerForId = function(id){

    var player;
    // проходим циклом по всем игрокам
    for (var i = 0; i < players.length; i++){
        // находим нужного игрока по ид
        if (players[i].playerId === id){

            // добавляем в переменную и возвращаем
            player = players[i];
            break;

        }
    }

    return player;
};

// экспортируем массив игроков
module.exports.players = players;
// экспортируем нового игрока
module.exports.addPlayer = addPlayer;
module.exports.removePlayer = removePlayer;
module.exports.updatePlayerData = updatePlayerData;
module.exports.playerForId = playerForId;