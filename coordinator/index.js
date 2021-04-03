const express = require('express')
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs')
const path = require('path');
const  axios  = require('axios');
var app = express()
var port = 5000
var http = require('http').createServer(app);
const io = require('socket.io')(http);
let portDocker = 4000;

app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))
app.use(express.static(path.join(__dirname,'public')))


io.sockets.on('connection', (socket) => {
    console.log('A new user connected');
    setInterval(() => {
        socket.emit('hours', `${global.clock.toLocaleTimeString()}`);
    }, 1000);
});

var monitoring=[]
setInterval(async ()=>{
    monitoring=[]
    var urls=getUrls()
    for (let i = 0; i < urls.length; i++) {
        let server =String(urls[i]).replace('\r','')
        let state=axios.get(`${server}/test`,{})
        .then(()=>{
            return true
        })
        .catch(()=>{
            return false
        })
        monitoring.push({server:server,state:await state})
        io.sockets.emit('servers-data',monitoring)
    }
}, 10000)

function getUrls() {
    var urls = fs.readFileSync('./urls.txt', { encoding: "utf-8" }).split('\n')
    urls.pop()
    return urls
}

//hora del coordinador e intancias conectadas ws

//metodo post para crear instancia
app.post('/new_server', (req, res) => {
    console.log('llego')
    try {
        portDocker++;
        shell.exec(`sh new_server.sh ${portDocker}`)
        fs.appendFile('./urls.txt', `http://127.0.0.1:${portDocker}\n`, (err) => {
            if (err) throw err;
            console.log('new server has been added!');
            res.sendStatus(200);
        });
    } catch { res.sendStatus(500) }
})

app.post('/', (req, res) => {
    res.send('ok');
})

http.listen(port, () => {
    console.log(`listening on port: ${port}`);
});