const { app, BrowserWindow } = require('electron')
const express = require('express')

let window

const createWindow = (number, message) => {
	const expresss = express();
	  
	const sendMessage = (number, message) => {
		window.loadURL(`https://web.whatsapp.com/send?phone=${number}&text=${message}`,
			{ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36' }
		)

		// btnClick
		// this class of the send button can change
		// stay tuned on whatsapp web, inspecting the element
		window.webContents.executeJavaScript(`
			let sendedMessage = false

			const timer = () => {
				let btnClick = document.getElementsByClassName("_1U1xa")[0];

				if (btnClick && sendedMessage === false) {
					btnClick.click()
					sendedMessage = true
				}
				
				if (sendedMessage) {
					ipcRenderer.send("para", {status:true})
					sendedMessage = false
					${window.hide()}
				}
			}

			setInterval(timer, 2000)
		`)
	}
	  
	expresss.listen(3400);
	
  	expresss.get('/whatsapp/:number/:message', (request, response) => {
		sendMessage(request.params.number, request.params.message)
		response.send("trying send message...")
	})
	  
	window = new BrowserWindow({
		center: true,
		resizable: true,
		webPreferences: { nodeIntegration: false, show: false }
	})

	window.loadFile('index.html')
}

app.on('ready', createWindow)