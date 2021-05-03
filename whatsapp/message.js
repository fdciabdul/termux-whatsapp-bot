const {
	MessageType,
	Mimetype,
    WAConnection
} = require("@adiwajshing/baileys");
const fs = require('fs');
const conn = require('./connect');
const axios = require('axios');
const request = require('request');
const { resolve } = require("path");

const xinz = conn.xinz

exports.sendText = (from, text) => {
    xinz.sendMessage(from, text, MessageType.text)
}
exports.sendImage = (from, image, caption, qul) => {
	xinz.sendMessage(from, image, MessageType.image, {quoted: qul, caption: caption})
}
exports.sendVideo = (from, video, caption, qul) => {
	xinz.sendMessage(from, video, MessageType.video, {quoted: qul, caption: caption})
}
exports.sendGif = (from, gif) => {
	xinz.sendMessage(from, gif, MessageType.video, {mimetype: "video/gif"})
}
exports.reply = (from, text, qul) => {
    xinz.sendMessage(from, text, MessageType.text, {quoted: qul})
}
exports.sendSticker = (from, filename, qul) => {
	xinz.sendMessage(from, filename, MessageType.sticker, {quoted: qul})
}
exports.sendKontak = (from, nomor, nama) => {
	const vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
	xinz.sendMessage(from, {displayname: nama, vcard: vcard}, MessageType.contact)
}
exports.sendFakeStatus = (from, teks, faketeks) => {
	xinz.sendMessage(from, teks, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)} } } })
}
exports.FakeStatusForwarded = (from, teks, faketeks) => {
	xinz.sendMessage(from, teks, MessageType.text, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)} }, contextInfo: {"forwardingScore": 999, "isForwarded": true} } })
}
exports.FakeStatusImgForwarded = (from, image, caption, faketeks) => {
	xinz.sendMessage(from, image, MessageType.image, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)} } }, caption: caption, contextInfo: {"forwardingScore": 999, "isForwarded": true} })
}
exports.sendFakeStatusWithImg = (from, image, caption, faketeks) => {
	xinz.sendMessage(from, image, MessageType.image, { quoted: { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "mimetype": "image/jpeg", "caption": faketeks, "jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)} } }, caption: caption })
}
exports.sendMention = (from, text, orangnya, qul) => {
	xinz.sendMessage(from, text, MessageType.extendedText, {contextInfo: {mentionedJid: orangnya}, quoted: qul})
}
exports.hideTag = async function(from, text){
	let anu = await xinz.groupMetadata(from)
	let members = anu.participants
	let ane = []
	for (let i of members){
		ane.push(i.jid)
	}
	xinz.sendMessage(from, text, MessageType.text, {contextInfo: {"mentionedJid": ane}})
}
exports.hideTagImg = async function(from, image){
	let anu = await xinz.groupMetadata(from)
	let members = anu.participants
	let ane = []
	for (let i of members){
		ane.push(i.jid)
	}
	xinz.sendMessage(from, image, MessageType.image, {contextInfo: {"mentionedJid": ane}})
}
exports.hideTagSticker = async function(from, sticker){
	let anu = await xinz.groupMetadata(from)
	let members = anu.participants
	let ane = []
	for (let i of members){
		ane.push(i.jid)
	}
	xinz.sendMessage(from, sticker, MessageType.sticker, {contextInfo: {"mentionedJid": ane}})
}
exports.hideTagKontak = async function(from, nomor, nama){
	let vcard = 'BEGIN:VCARD\n' + 'VERSION:3.0\n' + 'FN:' + nama + '\n' + 'ORG:Kontak\n' + 'TEL;type=CELL;type=VOICE;waid=' + nomor + ':+' + nomor + '\n' + 'END:VCARD'
	let anu = await xinz.groupMetadata(from)
	let members = anu.participants
	let ane = []
	for (let i of members){
		ane.push(i.jid)
	}
	xinz.sendMessage(from, {displayname: nama, vcard: vcard}, MessageType.contact, {contextInfo: {"mentionedJid": ane}})
}
exports.getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}
exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.runtime = function(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}
exports.FakeTokoForwarded = (from, teks, fake) => {
	anu = {
		key: {
			fromMe: false,
			participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
		},
		message: {
			"productMessage": {
				"product": {
					"productImage":{
						"mimetype": "image/jpeg",
						"jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)
					},
					"title": fake,
					"description": "Self Aqulzz nih Boss",
					"currencyCode": "IDR",
					"priceAmount1000": "50000000",
					"retailerId": "Self Bot",
					"productImageCount": 1
				},
				"businessOwnerJid": `0@s.whatsapp.net`
		}
	}
}
	xinz.sendMessage(from, teks, MessageType.text, {quoted: anu, contextInfo: {"forwardingScore": 999, "isForwarded": true}})
}
exports.sendFakeToko = (from, teks, fake) => {
	anu = {
		key: {
			fromMe: false,
			participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
		},
		message: {
			"productMessage": {
				"product": {
					"productImage":{
						"mimetype": "image/jpeg",
						"jpegThumbnail": fs.readFileSync(`./media/aqul.jpeg`)
					},
					"title": fake,
					"description": "Self Aqulzz nih Boss",
					"currencyCode": "IDR",
					"priceAmount1000": "50000000",
					"retailerId": "Self Bot",
					"productImageCount": 1
				},
				"businessOwnerJid": `0@s.whatsapp.net`
		}
	}
}
	xinz.sendMessage(from, teks, MessageType.text, {quoted: anu})
}
exports.sendFakeThumb = async function(from, url, title, desc, comnya, fotonya){
	var anoim = {
		detectLinks: false
	}
	var qul = await xinz.generateLinkPreview(url)
	qul.title = title
	qul.description = desc
	qul.jpegThumbnail = fotonya ? fotonya : fs.readFileSync(`./media/aqul.jpeg`)
	qul.canonicaUrl = comnya
	xinz.sendMessage(from, qul, MessageType.extendedText, anoim)
}
exports.sendFakeImg = function(from, imageasli, caption, thumbnail, qul){
	let ai = {
		thumbnail: thumbnail ? thumbnail : fs.readFileSync(`./media/aqul.jpeg`),
		quoted: qul ? qul : ''
	}
	xinz.sendMessage(from, imageasli, MessageType.image, ai)
}
exports.sendMediaURL = async(to, url, text="", qul, mids=[]) =>{
	if(mids.length > 0){
		text = normalizeMention(to, text, mids)
	}
	const fn = Date.now() / 10000;
	const filename = fn.toString()
	let mime = ""
	var download = function (uri, filename, callback) {
		request.head(uri, function (err, res, body) {
			mime = res.headers['content-type']
			request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
		});
	};
	download(url, filename, async function () {
		console.log('done');
		let media = fs.readFileSync(filename)
		let type = mime.split("/")[0]+"Message"
		if(mime === "image/gif"){
			type = MessageType.video
			mime = Mimetype.gif
		}
		if(mime.split("/")[0] === "audio"){
			mime = Mimetype.mp4Audio
		}
		xinz.sendMessage(to, media, type, { quoted: qul, mimetype: mime, caption: text,contextInfo: {"mentionedJid": mids}})
		
		fs.unlinkSync(filename)
	});
}
exports.getGroupAdmins = function(participants){
    admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}
exports.getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}
exports.setName = async function(query){
    const response = await xinz.updateProfileName(query)
    return response
}
exports.setBio = async function(query){
    const response = await xinz.setStatus(query)
    return response
}
exports.kick = function(from, orangnya){
	for (let i of orangnya){
		xinz.groupRemove(from, [i])
	}
}
exports.add = function(from, orangnya){
	xinz.groupAdd(from, orangnya)
}
exports.promote = function(from, orangnya){
	xinz.groupMakeAdmin(from, orangnya)
}
exports.demote = function(from, orangnya){
	xinz.groupDemoteAdmin(from, orangnya)
}
exports.upTextStatus = function(text){
	xinz.sendMessage('status@broadcast', text, MessageType.extendedText)
}
exports.upImgStatus = function(image, text){
	xinz.sendMessage('status@broadcast', image, MessageType.image, {caption: text})
}
exports.upVidStatus = function(video, text){
	xinz.sendMessage('status@broadcast', video, MessageType.video, {caption: text})
}
exports.createGroup = function(nama, member){
	xinz.groupCreate(nama, member)
	let anj = {
		status: true,
		creator: 'aqulzz',
		grup: nama,
		peserta: member,
		message: 'Pembuatan grup berhasil'
	}
	return anj
}
exports.getGroup = async function(totalchat){
	let grup = []
	let a = []
	let b = []
	for (c of totalchat){
		a.push(c.jid)
	}
	for (d of a){
		if (d && d.includes('g.us')){
			b.push(d)
		}
	}
	for (e of b){
		let ingfo = await xinz.groupMetadata(e)
		grup.push(ingfo)
	}
	return grup
}