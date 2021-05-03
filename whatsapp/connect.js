/*
HAI NAMAKU AQULZZ
YAH DISINI AKU SEBAGAI PEMULA MAU MENCOBA MEMBUAT BOT KU SENDIRI
YANG PASTINYA BANYAK COPY PASTE
OKE TERIMA KASIH
*/
const { WAConnection, MessageType } = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const fs = require('fs')
const { color } = require('../lib/color')

const fdciabdul = new WAConnection()
exports.fdciabdul = fdciabdul

exports.connect = async() => {
    let authofile = './fdciabdul.json'
	fdciabdul.on('qr', qr => {
        qrcode.generate(qr, { small: true })
        console.log(`QR Siap, Scan Pack`)
    })
    /*
	fdciabdul.on('credentials-updated', () => {
		fs.writeFileSync(authofile, JSON.stringify(fdciabdul.base64EncodedAuthInfo(), null, '\t'))
		console.log(color('Wait....'))
	})
    */
	fs.existsSync(authofile) && fdciabdul.loadAuthInfo(authofile)
	fdciabdul.on('connecting', () => {
		console.log(color('Connecting...'))
	})
	fdciabdul.on('open', () => {
		console.log(color('Welcome Owner'))
	})
	await fdciabdul.connect({timeoutMs: 30*1000})
    fs.writeFileSync(authofile, JSON.stringify(fdciabdul.base64EncodedAuthInfo(), null, '\t'))
    return fdciabdul
}