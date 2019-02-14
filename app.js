var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var world = require('./js/server_world');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/js/client_world.js', function(req, res){
    res.sendFile(__dirname + '/js/client_world.js');
});
app.get('/js/controls/OrbitControls.js', function(req, res){
    res.sendFile(__dirname + '/js/controls/OrbitControls.js');
});

// Handle connection
io.on('connection', function(socket){
    console.log('a user connected');

    // получаем ид пользователя
    var id = socket.id;
    // инициализурем нового пользователя
    world.addPlayer(id);

    // находим пользователя по ид
    var player = world.playerForId(id);

    // транслируем игроку о добавлении его на карту
    socket.emit('createPlayer', player);

    // транслируем загрузку других игроков новому пользователю
    socket.broadcast.emit('addOtherPlayer', player);

    // слушаем запрос на получение информации о других игроках
    socket.on('requestOldPlayers', function(){
        // проходим циклом по всем игрокам
        for (var i = 0; i < world.players.length; i++){
            // если ид не равен текущему пользователю
            if (world.players[i].playerId != id)
            // вызываем добавление нового пользователя
                socket.emit('addOtherPlayer', world.players[i]);
        }
    });

    // слушаем информацию об обновлении позиции игрока
    socket.on('updatePosition', function(data){
        // обновляем данные о позиции
        var newData = world.updatePlayerData(data);
        // транслируем новые данные на игровой сервер
        socket.broadcast.emit('updatePosition', newData);
    });

    // слушаем событие выхода и удаляем игрока
    socket.on('disconnect', function(){
        console.log('user disconnected');
        io.emit('removeOtherPlayer', player);
        world.removePlayer( player );
    });

});

// Handle environment changes
var port = process.env.OPENSHIFT_NODEJS_PORT || 8000;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
});