const qrcode = require("qrcode-terminal");
const moment = require("moment");
const cheerio = require("cheerio");
const fs = require("fs");
const dl = require("./lib/downloadImage.js");
const fetch = require('node-fetch');
const urlencode = require("urlencode");
const axios = require("axios");
const imageToBase64 = require('image-to-base64');
const menu = require("./menu.js");
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
} = require("@adiwajshing/baileys");
var jam = moment().format("HH:mm");

function foreach(arr, func)
{
   for (var i in arr)
   {
      func(i, arr[i]);
   }
}
const conn = new WAConnection()
conn.on('qr', qr =>
{
   qrcode.generate(qr,
   {
      small: true
   });
   console.log(`[ ${moment().format("HH:mm:ss")} ] Please Scan QR with app!`);
});

conn.on('credentials-updated', () =>
{
   // save credentials whenever updated
   console.log(`credentials updated!`)
   const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
// uncomment the following line to proxy the connection; some random proxy I got off of: https://proxyscrape.com/free-proxy-list
//conn.connectOptions.agent = ProxyAgent ('http://1.0.180.120:8080')
conn.connect();

conn.on('user-presence-update', json => console.log(json.id + ' presence is ' + json.type))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
   console.log(`${json.to}${participant} acknlowledged message(s) ${json.ids} as ${json.type}`)
})

conn.on('message-new', async(m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   let id = m.key.remoteJid
   const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
   let imageMessage = m.message.imageMessage;
   console.log(`[ ${moment().format("HH:mm:ss")} ] (${id.split("@s.whatsapp.net")[0]} => ${text}`);


// Groups

if (text.includes("!buatgrup"))
   {
var nama = text.split("!buatgrup")[1].split("-nomor")[0];
var nom = text.split("-nomor")[1];
var numArray = nom.split(",");
for ( var i = 0; i < numArray.length; i++ ) {
    numArray[i] = numArray[i] +"@s.whatsapp.net";
}
var str = numArray.join("");
console.log(str)
const group = await conn.groupCreate (nama, str)
console.log ("created group with id: " + group.gid)
conn.sendMessage(group.gid, "hello everyone", MessageType.extendedText) // say hello to everyone on the group

}

// FF
if(text.includes("!cek")){
var num = text.replace(/!cek/ , "")
var idn = num.replace("0","+62");

console.log(id);
const gg = idn+'@s.whatsapp.net'

const exists = await conn.isOnWhatsApp (gg)
console.log(exists);
conn.sendMessage(id ,`${gg} ${exists ? " exists " : " does not exist"} on WhatsApp`, MessageType.text)
}
if (text == '!menu'){
conn.sendMessage(id, menu.menu ,MessageType.text);
}
else if (text == '!menu1'){
conn.sendMessage(id, menu.menu1 ,MessageType.text);
}
else if (text == '!menu2'){
conn.sendMessage(id, menu.menu2 ,MessageType.text);
}
else if (text == '!menu3'){
conn.sendMessage(id, menu.menu3 ,MessageType.text);
}

   if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '!sticker')
      {
         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '.webp', (error, stdout, stderr) =>
         {
            let stik = fs.readFileSync('temp/' + jam + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker)
         });
      }
   }

   if (messageType === MessageType.text)
   {
      let is = m.message.conversation.toLocaleLowerCase()

      if (is == '!pantun')
      {

         fetch('https://raw.githubusercontent.com/pajaar/grabbed-results/master/pajaar-2020-pantun-pakboy.txt')
            .then(res => res.text())
            .then(body =>
            {
               let tod = body.split("\n");
               let pjr = tod[Math.floor(Math.random() * tod.length)];
               let pantun = pjr.replace(/pjrx-line/g, "\n");
               conn.sendMessage(id, pantun, MessageType.text)
            });
      }

   }
   if (text.includes("!yt"))
   {
      const url = text.replace(/!yt/, "");
      const exec = require('child_process').exec;

      var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

      const ytdl = require("ytdl-core")
      if (videoid != null)
      {
         console.log("video id = ", videoid[1]);
      }
      else
      {
         conn.sendMessage(id, "gavalid", MessageType.text)
      }
      ytdl.getInfo(videoid[1]).then(info =>
      {
         if (info.length_seconds > 1000)
         {
            conn.sendMessage(id, " videonya kepanjangan", MessageType.text)
         }
         else
         {

            console.log(info.length_seconds)

            function os_func()
            {
               this.execCommand = function (cmd)
               {
                  return new Promise((resolve, reject) =>
                  {
                     exec(cmd, (error, stdout, stderr) =>
                     {
                        if (error)
                        {
                           reject(error);
                           return;
                        }
                        resolve(stdout)
                     });
                  })
               }
            }
            var os = new os_func();

            os.execCommand('ytdl ' + url + ' -q highest -o mp4/' + videoid[1] + '.mp4').then(res =>
            {
		const buffer = fs.readFileSync("mp4/"+ videoid[1] +".mp4")
               conn.sendMessage(id, buffer, MessageType.video)
            }).catch(err =>
            {
               console.log("os >>>", err);
            })

         }
      });

   }


   if (text.includes("!nulis"))
   {

      const
      {
         spawn
      } = require("child_process");
      console.log("writing...")
      const teks = text.replace(/!nulis/, "")
      const split = teks.replace(/(\S+\s*){1,10}/g, "$&\n")
      const fixedHeight = split.split("\n").slice(0, 25).join("\\n")
      console.log(split)
      spawn("convert", [
            "./assets/paper.jpg",
            "-font",
            "Indie-Flower",
            "-size",
            "700x960",
            "-pointsize",
            "18",
            "-interline-spacing",
            "3",
            "-annotate",
            "+170+222",
            fixedHeight,
            "./assets/result.jpg"
         ])
         .on("error", () => console.log("error"))
         .on("exit", () =>
         {
            const buffer = fs.readFileSync("assets/result.jpg") // can send mp3, mp4, & ogg -- but for mp3 files the mimetype must be set to ogg

            conn.sendMessage(id, buffer, MessageType.image)
            console.log("done")
         })
   }


   if (text.includes("!quotes"))
   {
      var url = 'https://jagokata.com/kata-bijak/acak.html'
      axios.get(url)
         .then((result) =>
         {
            let $ = cheerio.load(result.data);
            var author = $('a[class="auteurfbnaam"]').contents().first().text();
            var kata = $('q[class="fbquote"]').contents().first().text();

            conn.sendMessage(
               id,
               `
     _${kata}_
        
    
	*~${author}*
         `, MessageType.text
            );

         });
   }

   if (text.includes("!ptl"))
   {
    var items = ["ullzang girl", "cewe cantik", "hijab cantik", "korean girl"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes("!randomanime"))
   {
    var items = ["anime girl", "anime cantik", "anime", "anime aesthetic"];
    var cewe = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + cewe;
    
    axios.get(url)
      .then((result) => {
        var b = JSON.parse(JSON.stringify(result.data));
        var cewek =  b[Math.floor(Math.random() * b.length)];
        imageToBase64(cewek) // Path to the image
        .then(
            (response) => {
	var buf = Buffer.from(response, 'base64'); // Ta-da	
              conn.sendMessage(
            id,
              buf,MessageType.image)
       
            }
        )
        .catch(
            (error) => {
                console.log(error); // Logs an error if there was one
            }
        )
    
    });
    }

if (text.includes("!scdl")){
const fs = require("fs");
const scdl = require("./lib/scdl");

scdl.setClientID("iZIs9mchVcX5lhVRyQGGAYlNPVldzAoX");

scdl("https://m.soundcloud.com/abdul-muttaqin-701361735/lucid-dreams-gustixa-ft-vict-molina")
    .pipe(fs.createWriteStream("mp3/song.mp3"));
}



 else if (text.includes("!tts")) {
  var teks = text.split("!ttsid ")[1];
  var path = require('path');
  var text1 = teks.slice(6);
  text1 = suara;
  var suara = text.replace(/!ttsid/g, text1);
  var filepath = 'mp3/bacot.wav';
  
  
/*
 * save audio file
 */

gtts.save(filepath, suara, function() {
  console.log(`${filepath} MP3 SAVED!`)
});
await new Promise(resolve => setTimeout(resolve, 500));

	if(suara.length > 200){ // check longness of text, because otherways google translate will give me a empty file
  msg.reply("Text to long, split in text of 200 characters")
}else{

const buffer = fs.readFileSync(filepath)
	conn.sendMessage(id , buffer , MessageType.audio);

};


}






   // end of file


})
