const app = require('express')()
const {exec} = require("child_process")
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

// SerialPort.list().then(p => console.log(p))
const port = new SerialPort("/dev/ttyACM0", { baudRate: 115200 })
const parser = new Readline()
port.pipe(parser)

app.get('/', function serveIndexHtml(req, res) {
	res.sendFile(__dirname + '/index.html')
})

io.on('connection', function socketSetup(socket) {
	parser.on('data', function fromSerialToBrowser(line) {
		io.emit("dataFromNodeJS", line)
		console.log(line)
	})
})

http.listen(3000)
exec("chromium-browser --noerrdialogs --kiosk --start-fullscreen http://localhost:3000 --incognito --disable-translate", (error, stdout, stderr) => console.log("ey"))
