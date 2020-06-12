const fs = require("fs"); 
const moment = require("moment");
const qrcode = require("qrcode-terminal"); 
const { Client, MessageMedia } = require("whatsapp-web.js"); 
const mqtt = require("mqtt"); 
const listen = mqtt.connect("mqtt://test.mosquitto.org"); 
const fetch = require("node-fetch"); 
const User = require("./user.js"); 
const delay = require("delay"); 
let urlen = require("urlencode"); 
const puppeteer = require("puppeteer"); 
const cheerio = require("cheerio");
const corona = require("./CoronaService/covid19.js"); 
const SESSION_FILE_PATH = "./session.json";
// file is included here
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
client = new Client({	  
    
	     puppeteer: {
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        headless: true
    },	      
    session: sessionCfg
});
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.

client.initialize();

// ======================= Begin initialize WAbot

client.on("qr", qr => {
  // NOTE: This event will not be fired if a session is specified.
  qrcode.generate(qr, {
    small: true
  });
  console.log(`[ ${moment().format("HH:mm:ss")} ] Please Scan QR with app!`);
});

client.on("authenticated", session => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Authenticated Success!`);
  // console.log(session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
    if (err) {
      console.error(err);
    }
  });
});
client.on('message', async (msg) => {
    if(msg === '!join') {
        const chat = await msg.getChat();
        
        let text = "sini oy ";
        let mentions = [];

        for(let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);
            
            mentions.push(contact);
            text += `@${participant.id.user} `;
        }

        chat.sendMessage(text, { mentions });
    }
});
client.on("auth_failure", msg => {
  // Fired if session restore was unsuccessfull
  console.log(
    `[ ${moment().format("HH:mm:ss")} ] AUTHENTICATION FAILURE \n ${msg}`
  );
  fs.unlink("./session.json", function(err) {
    if (err) return console.log(err);
    console.log(
      `[ ${moment().format("HH:mm:ss")} ] Session Deleted, Please Restart!`
    );
    process.exit(1);
  });
});

client.on("ready", () => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] Whatsapp bot ready!`);
});

// ======================= Begin initialize mqtt broker

listen.on("connect", () => {
  listen.subscribe("corona", function(err) {
    if (!err) {
      console.log(`[ ${moment().format("HH:mm:ss")} ] Mqtt topic subscribed!`);
    }
  });
});

// ======================= WaBot Listen on Event

client.on("message_create", msg => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  // console.log(after); // message after it was deleted.
  if (before) {
    console.log(before.body); // message before it was deleted.
  }
});

client.on("message_revoke_me", async msg => {
  // Fired whenever a message is only deleted in your own view.
  // console.log(msg.body); // message before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  if (ack == 3) {
    // The message was read
  }
});

client.on("group_join", notification => {
  // User has joined or been added to the group.
  console.log("join", notification);
  notification.reply("User joined.");
});

client.on("group_leave", notification => {
  // User has left or been kicked from the group.
  console.log("leave", notification);
  notification.reply("User left.");
});

client.on("group_update", notification => {
  // Group picture, subject or description has been updated.
  console.log("update", notification);
});

client.on("disconnected", reason => {
  console.log("Client was logged out", reason);
});

// ======================= WaBot Listen on message

client.on("message", async msg => {
  console.log(
    `[ ${moment().format("HH:mm:ss")} ] Message:`,
    msg.from.replace("@c.us", ""),
    `| ${msg.type}`,
    msg.body ? `| ${msg.body}` : ""
  );

  if (msg.type == "ciphertext") {
    // Send a new message as a reply to the current one
    msg.reply("kirim ! menu atau !help untuk melihat menu.");
  } else if (msg.body == "!ping reply") {
    // Send a new message as a reply to the current one
    msg.reply("pong");
  }
else if (msg.body.startsWith("!fb ")) {

const request = require('request');
var req = msg.body.split(" ")[1];
const { exec } = require("child_process");
var crypto = require('crypto');
var fs = require('fs'); 
var chat = await msg.getChat();
var filename = 'video'+crypto.randomBytes(4).readUInt32LE(0)+'saya';
var path = require('path');
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'https://fbdownloader.net/download/?url='+ req,
},function(error, response, body){
    let $ = cheerio.load(body);
   var gehu = $('a[rel="noreferrer no-follow"]').attr('href');

exec('wget "' + gehu + '" -O mp4/gue.mp4', (error, stdout, stderr) => {
     const media = MessageMedia.fromFilePath('mp4/gue.mp4');
chat.sendMessage(media);
	 
	if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
});
}else if (msg.body.startsWith("!ig ")) {
    msg.reply(`*Hai, Kita Proses Dulu Ya . . .*`);
    let link = msg.body.split(" ")[1];
	var namafile = link.split("/p/")[1].split("/")[0];
	var chat = await msg.getChat();
	const { exec } = require("child_process");
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-gpu",
        "--window-size=1920x1080",
      ],
    });
    const page = await browser.newPage();
    await page
      .goto("https://id.savefrom.net/download-from-instagram", {
        waitUntil: "networkidle2",
      })
      .then(async () => {
        await page.type("#sf_url", `${link}`);
        await page.click("#sf_submit");
        try {
          msg.reply("Mendownload Video!");
          await page.waitForSelector(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const element = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.link-box.single > div.def-btn-box > a"
          );
          const text = await (await element.getProperty("href")).jsonValue();
          const judul = await page.$(
            "#sf_result > div > div.result-box.video > div.info-box > div.meta > div"
          );
          const judul1 = await (await judul.getProperty("title")).jsonValue();
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > Berhasil Dilakukan`
          );
          msg.reply(
            `*BERHASIL!!!*
Judul : ${judul1}
			  
			  
 👾 Instagram Downloader By InsideHeartz 👾`
          );
		  
exec('wget "' + text + '" -O mp4/'+ namafile +'.mp4', (error, stdout, stderr) => {
  const media = MessageMedia.fromFilePath('mp4/'+ namafile +'.mp4');

	chat.sendMessage(media);
	if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
          browser.close();
        } catch (error) {
          console.log(
            `[${moment().format("hh:mm:ss")}][!fb][${
              msg.from
            }] > GAGAL Dilakukan`
          );
          msg.reply(
            `[GAGAL] PASTIKAN LINK VIDEO BERSIFAT PUBLIK DAN DAPAT DIAKSES OLEH SEMUA ORANG!*`
          );
          browser.close();
        }
      })
      .catch((err) => {
        console.log(
          `[${moment().format("hh:mm:ss")}][!fb][${msg.from}] > GAGAL Dilakukan`
        );
        msg.reply(
          `[GAGAL] Server Sedang Down!\n\nSilahkan Coba Beberapa Saat Lagi!`
        );
        browser.close();
      });
	 
	 
  } 
  else if (msg.body.startsWith("!brainly ")) {
var tanya = msg.body.split(" ")[1];
const fetch = require('node-fetch')
const url = "https://tools.aqin.my.id/api/brainly/?q="+ tanya;
const solution = () => {
  fetch(url).then(res => res.json()).then((res) => {
    res.data.questionSearch.edges.forEach(item => {
      console.log("==[content]==")
      client.sendMessage(
        msg.from,
        `		$(item.node.content) `);
      console.log("=============")

      console.log("==[answer]==")
      item.node.answers.nodes.forEach(item => {
        msg.reply(item['content']);
      })
      console.log("=========")
    })
  })
}

}
else if (msg.body.startsWith("!sial ")) {
const request = require('request');
var req = msg.body;
var tanggal = req.split(" ")[1];
var kk = req.split(" ")[2];
var bulan = kk.replace("0", "");
var tahun = req.split(" ")[3];
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/primbon_hari_naas.php',
  body: "tgl="+ tanggal +"&bln="+ bulan +"&thn="+ tahun +"&submit=+Submit%21+"
},function(error, response, body){
    let $ = cheerio.load(body);
var y = $.html().split('<b>PRIMBON HARI NAAS</b><br><br>')[1];
    var t = y.split('.</i><br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
    var d = h.replace("&amp;", '&')
console.log(""+ d);
msg.reply(` 

-----------------------------------

 Cek Hari Naas Kamu ~
 
 
 ${d}
 
 
 ----------------------------------
  👾 InsideBot 2020👾
 
 `); 
});
}

else if (msg.body.startsWith("!pasangan ")) {
const request = require('request');
var req = msg.body;
var gh = req.split("!pasangan ")[1];

var namamu = gh.split("&")[0];
var pasangan = gh.split("&")[1];
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/kecocokan_nama_pasangan.php?nama1='+ namamu +'&nama2='+ pasangan +'&proses=+Submit%21+',
 
},function(error, response, body){
    let $ = cheerio.load(body);
var y = $.html().split('<b>KECOCOKAN JODOH BERDASARKAN NAMA PASANGAN</b><br><br>')[1];
    var t = y.split('.<br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
    var d = h.replace("&amp;", '&')
console.log(""+ d);
msg.reply(` 

-----------------------------------

 *Cek Kecocokan Jodoh Berdasarkan Nama ~*
 
 
 ${d}
 
 
 ----------------------------------
  👾 InsideBot 2020 👾
 
 `); 
});
}
else if (msg.body.startsWith("!ytmp3 ")) {
var url = msg.body.split(" ")[1];
var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
var chat = await msg.getChat();
if(videoid != null) {
   console.log("video id = ",videoid[1]);
} else {
    msg.reply("Videonya gavalid gan.");
}
msg.reply(" Tunggu sebentar kak .. Lagi di proses ☺");
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "ffmpeg", 
    "outputPath": "./mp3",    // Where should the downloaded and en>
    "youtubeVideoQuality": "highest",       // What video quality sho>
    "queueParallelism": 2,                  // How many parallel down>
    "progressTimeout": 2000                 // How long should be the>
});

//Download video and save as MP3 file
YD.download(videoid[1]);

YD.on("finished", function(err, data) {
const media = MessageMedia.fromFilePath(data.file);
msg.reply(` 
 
   Mp3 Berhasil di download
   
  ----------------------------------

Nama File : *${data.videoTitle}*
Nama : *${data.title}*
Artis : *${data.artist}*

   ----------------------------------
👾                          👾
  _Ytmp3 WhatsApp By InsideBot_
`);
chat.sendMessage(media);
});
YD.on("progress", function(data) {
});
}
else if (msg.body.startsWith("!quotes")) {
const request = require('request');
request.get({
  headers: {
'user-agent' : 'Mozilla/5.0 (Linux; Android 8.1.0; vivo 1820) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Mobile Safari/537.36'
},
  url: 'https://jagokata.com/kata-bijak/acak.html',
},function(error, response, body){
    let $ = cheerio.load(body);
    var author = $('a[class="auteurfbnaam"]').contents().first().text();
   var kata = $('q[class="fbquote"]').contents().first().text();

client.sendMessage(
        msg.from,
        `
     _${kata}_
        
    

	*~${author}*
         `
      );

});
}

else if (msg.body.startsWith("!nama ")) {
const cheerio = require('cheerio');
const request = require('request');
var nama = msg.body.split("!nama ")[1];
var req = nama.replace(/ /g,"+");
request.get({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/arti_nama.php?nama1='+ req +'&proses=+Submit%21+',
},function(error, response, body){
    let $ = cheerio.load(body);
    var y = $.html().split('arti:')[1];
    var t = y.split('method="get">')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
console.log(""+ h);
msg.reply(
            `
      *Arti Dari Namamu*

  ----------------------------------
         Nama _*${nama}*_ ${h}
  ----------------------------------

  _InsideBot_
`
        );
});
}
else if (msg.body.startsWith("!sifat ")) {
const cheerio = require('cheerio');
const request = require('request');
var req = msg.body.split("[")[1].split("]")[0];
var nama = req.replace(/ /g," ");
var pesan = msg.body;
var y = pesan.replace(/ /g,"+ ");
var tanggal = y.split("]+")[1].split("-")[0];
var bulan = y.split("-")[1];
var tahun = y.split("-")[2];
request.post({
  headers: {'content-type' : 'application/x-www-form-urlencoded'},
  url:     'http://www.primbon.com/sifat_karakter_tanggal_lahir.php',
  body:    "nama="+ req +"&tanggal="+ tanggal +"&bulan="+ bulan +"&tahun="+ tahun +"&submit=+Submit%21+"
},function(error, response, body){
 let $ = cheerio.load(body);
    $('title').after('body')
    var y = $.html().split('<b>Nama :</b>')[1];
    var t = y.split('</i><br><br>')[1];
    var f = y.replace(t ," ");
    var x = f.replace(/<br\s*[\/]?>/gi, "\n");
    var h  = x.replace(/<[^>]*>?/gm, '');
console.log(""+ h);
            msg.reply(
            `
            *Sifat Dari Nama dan Tanggal Lahir*
         
  ----------------------------------
         Nama ${h}
  ----------------------------------

  _Primbon WhatsApp By InsideBot_
`
        );
});
  }else if (msg.body.startsWith("!quora ")) {
const imel = msg.body.split(" ")[1];
var url = 'http://tools.aqin.my.id/api/quora/api.php?q=' + imel;
const fetch = require("node-fetch");
fetch(url)
.then(res => res.text())
    .then(body =>
client.sendMessage(
      msg.from,
      `
 ${body}


Powered by _fdcibot_
`));
}
 else if (msg.body.startsWith("!yt ")) {
const url = msg.body.split(" ")[1];
const fs = require('fs');
const chat = await msg.getChat();
var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);

 const media = MessageMedia.fromFilePath('mp4/'+ videoid[1] +'.mp4');
 client.sendMessage(
      msg.from,
      `
 Tunggu....


`);
var ytdl = require('ytdl-core');
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

ytdl(url)
  .pipe(fs.createWriteStream('mp4/'+ videoid[1] +'.mp4'));
  chat.sendMessage(media);
}
 else if (msg.body.startsWith("!cek ")) {
const imel = msg.body.split(" ")[1];
var url = 'https://taqin.my.id/cek.php?email=' + imel;
const fetch = require("node-fetch");
fetch(url)
.then(res => res.text())
    .then(body =>
client.sendMessage(
      msg.from,
      `
 ${body}


Powered by _fdcibot_
`));
}
 else if (msg.body.startsWith("!resi ")) {
    let kurir = msg.body.split(" ")[1];
    let resi = msg.body.split(" ")[2];
    console.log(kurir + resi);
    if (kurir.length != 2 || resi.length != 6) {
      fetch(`https://api.terhambar.com/resi?resi=${resi}&kurir=${kurir}`)
        .then((resss) => resss.json())
        .then((resst) => {
          if (resst.status != "OK") {
            msg.reply("*Maaf Server Mencapai Batas Harian! Coba Lagi Besok!*");
          } else {
            let ar = [];
            let sem = "";
            for (let i = 0; i < Object.keys(resst.lacak.stats).length; i++) {
              let sendlah =
                "moment().format('hh:mm:ss') : " +
                resst.lacak.stats[i].moment().format("hh:mm:ss") +
                "\nKeterangan : " +
                resst.lacak.stats[i].keterangan +
                "\nKota : " +
                resst.lacak.stats[i].kota +
                "\n\n";
              ar.push(sendlah);
              sem = ar.join("");
            }
            console.log(
              `[${moment().format("hh:mm:ss")}][!fb][${
                msg.from
              }] > Berhasil Dilakukan`
            );
            msg.reply(
              "*Berhasil Melacak*\n\n" +
              "Nama Penerima : " +
              resst.name +
              "\nKurir : " +
              resst.kurir +
              "\nmoment().format('hh:mm:ss') Input Resi : " +
              resst.tlg_input +
              `\n\n*Pelacakan* :\n${sem}`
            );
          }
        });
    } else {
      console.log(
        `[${moment().format("hh:mm:ss")}][!resi][${msg.from}] > GAGAL Dilakukan`
      );
      msg.reply("*DATA TIDAK BISA DILACAK!*");
    }
  } else if (msg.body == "!resi") {
    let balas = `_CEK RESI VIA WHATSAPP_\n\nformat cek resi *_!resi kurir nomor resi_*\n\ncontoh > *!resi jnt 6969696969*\n`;
    msg.reply(balas);
    console.log(
      `[${moment().format("hh:mm:ss")}][!resi][${
        msg.from
      }] > Berhasil Dilakukan`
    );
  } 
 else if (msg.body == "p" ||
    msg.body === "P") {
    // Send a new message to the same chat
    client.sendMessage(msg.from, "kok");
  } else if (msg.body == " assallamuallaikum") {
    client.sendMesssage(msg.from, "Waalaikumusallam");
  } else if (msg.body.startsWith("!sendto ")) {
    // Direct send a new message to specific id
    let number = msg.body.split(" ")[1];
    let messageIndex = msg.body.indexOf(number) + number.length;
    let message = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes("@c.us") ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, message);
  } else if (msg.body == "!chats") {
    const chats = await client.getChats();
    client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
  } else if (msg.body == "info" || msg.body == "!help" || msg.body == "!menu") {
    let localData = client.localData;
    // console.log(localData);
    client.sendMessage(
      msg.from,
      `  
◦•●◉✿ ஜ۩۞۩ஜ 𝐈𝐧𝐬𝐢𝐝𝐞 𝐁𝐨𝐭 ஜ۩۞۩ஜ  ✿◉●•◦

  


👾 List Menu Bot :

 ◦🌉 *_ɦσɾσรcσρε* ~_ 

🌠 *!nama* <nama>
 *_cari arti dari namamu_* 

 contoh _!nama Maudy Ayunda_ 
 
 🌠 *!quotes*
 *_random quotes dari tokoh terkenal_* 

🌠 *!sifat* [nama] tt-mm-yy
 *_cari sifat berdasarkan nama dan tanggal lahir_* 

 contoh _!sifat [Maudy Ayunda] 31-08-199_ 

🌠 *!sial* tt mm yy
 *_cek hari apes mu_* 

 contoh _!sial 17 08 1945_ 

🌠 *!pasangan* namamu & pasanganmu
 *_Cek kecocokan jodoh_* 

 contoh _!pasangan Riska & Ali_ 

🗃 *_ժօաղlօαժҽɾ* ~_

🔖 *!fb* <url>
 *downloader facebook_* 
 
🔖 *!ig* <url>
 *downloader instagram* 

🔖 *!ytmp3* <url>
 *konversi youtube ke mp3_* 


              🅜🅞🅡🅔    
   🅕🅔🅐🅣🅤🅡🅔🅢 🅘🅢 
🅒🅞🅞🅜🅘🅝🅖 🅢🅞🅞🅝

 _Powered By_ : 💞 *InsideHeartz*

`
    );
  } else if (msg.body == "!localData") {
    let localData = client.localData;
    // console.log(localData);
    client.sendMessage(
      msg.from,
      `
            *Connection localData*
            User name: ${localData.pushname}
            My number: ${localData.me.user}
            Device: ${localData.phone.device_manufacturer} | ${localData.phone.device_model}
            Platform: ${localData.platform} ${localData.phone.os_version} 
            WhatsApp version: ${localData.phone.wa_version}
        `
    );
  } else if (msg.body == "!medial" && msg.hasMedia) {
    const attachmentData = await msg.downloadMedia();
    // console.log(attachmentData)
    msg.reply(`
            *Media localData*
            MimeType: ${attachmentData.mimetype}
            Filename: ${attachmentData.filename}
            Data (length): ${attachmentData.data.length}
        `);
  } else if (msg.body == "!quotel" && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();

    quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
  } else if (msg.body == "!resendmedia" && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      const attachmentData = await quotedMsg.downloadMedia();
      client.sendMessage(msg.from, attachmentData, {
        caption: "Here's your requested media."
      });
    }
  } else if (msg.body == "!location") {
    msg.reply(
      new Location(37.422, -122.084, "Googleplex\nGoogle Headquarters")
    );
  } else if (msg.body == "!mention") {
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Hi @${contact.number}!`, {
      mentions: [contact]
    });
  } else if (msg.body == "!delete" && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.fromMe) {
      quotedMsg.delete(true);
    } else {
      msg.reply("I can only delete my own messages");
    }
  } else if (msg.body === "!archive") {
    const chat = await msg.getChat();
    chat.archive();  

  } else if (msg.body === "!recording") {
    const chat = await msg.getChat();
    // simulates recording audio in the chat
    chat.sendStateRecording();
  } else if (msg.body === "!clearstate") {
    const chat = await msg.getChat();
    // stops typing or recording in the chat
    chat.clearState();
  } else if (msg.body === "!mati") {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply("Maaf, perintah ini tidak bisa digunakan di dalam grup!");
    } else {
      User.checkUser(msg.from).then(result => {
        if (result) {
          User.removeUser(msg.from).then(result => {
            if (result) {
              client.sendMessage(
                msg.from,
                "Berhasil menonaktifkan, anda tidak akan mendapat notifikasi lagi."
              );
            } else {
              client.sendMessage(
                msg.from,
                "Gagal menonaktifkan, nomor tidak terdaftar."
              );
            }
          });
        } else {
          client.sendMessage(
            msg.from,
            "Gagal menonaktifkan, nomor tidak terdaftar."
          );
        }
      });
    }
  } else if (msg.body === "!aktif" || msg.body === "!daftar") {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply("Maaf, perintah ini tidak bisa digunakan di dalam grup!");
    } else {
      User.addUser(msg.from).then(result => {
        if (!result) {
          client.sendMessage(msg.from, "Notifikasi sudah aktif.");
        } else {
          client.sendMessage(msg.from, "Berhasil mengaktifkan notifikasi.");
        }
      });
    }
  } else if (msg.body === "!coronaOld") {
    fs.readFile("./CoronaService/data.json", "utf-8", function(err, data) {
      if (err) throw err;
      const localData = JSON.parse(data);
      const newCases = localData.NewCases === "" ? 0 : localData.NewCases;
      const newDeaths = localData.NewDeaths === "" ? 0 : localData.NewDeaths;
      client.sendMessage(
        msg.from,
        `                *COVID-19 Update!!*
Negara: ${localData.Country}

*Kasus aktif: ${localData.ActiveCases}*
*Total Kasus: ${localData.TotalCases}*
Kasus Baru: ${newCases}

*Meninggal: ${localData.TotalDeaths}*
Meninggal Baru: ${newDeaths}

*Total Sembuh: ${localData.TotalRecovered}*
            
Sumber: _https://www.worldometers.info/coronavirus/_
            `
      );
      var imageAsBase64 = fs.readFileSync(
        "./CoronaService/corona.png",
        "base64"
      );
      var CoronaImage = new MessageMedia("image/png", imageAsBase64);
      client.sendMessage(msg.from, CoronaImage);
    });
  } else if (
    msg.body === "!corona" ||
    msg.body === "Corona" ||
    msg.body === "/corona"
  ) {
    corona.getAll().then(result => {
      var aktifIndo =
        result[0].confirmed - result[0].recovered - result[0].deaths;
      // var aktifGlob = result[1].confirmed - result[1].recovered - result[1].
      // Kasus *Global*
      // Total Kasus: ${result[1].confirmed}
      // Kasus aktif: ${aktifGlob}
      // Sembuh: ${result[1].recovered}
      // Meninggal: ${result[1].deaths}
      // Update Pada:
      // ${result[1].lastUpdate}
      client.sendMessage(
        msg.from,
        `
                    *COVID-19 Update!!*

Kasus *Indonesia* 🇮🇩

😞 Total Kasus: ${result[0].confirmed}
😷 Kasus aktif: ${aktifIndo}
😊 Sembuh: ${result[0].recovered}
😭 Meninggal: ${result[0].deaths}

🕓 Update Pada: 
${result[0].lastUpdate.replace("pukul", "|")} WIB
     

Stay safe ya semuanya , jaga kesehatan nya masing masing`
      );
      var imageAsBase64 = fs.readFileSync(
        "./CoronaService/corona.png",
        "base64"
      );
      var CoronaImage = new MessageMedia("image/png", imageAsBase64);
      client.sendMessage(msg.from, CoronaImage);
    });

    // ============================================= Groups
  } else if (msg.body.startsWith("!subject ")) {
    // Change the group subject
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newSubject = msg.body.slice(9);
      chat.setSubject(newSubject);
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("!echo ")) {
    // Replies with the same message
    msg.reply(msg.body.slice(6));
  } else if (msg.body.startsWith("!desc ")) {
    // Change the group description
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newDescription = msg.body.slice(6);
      chat.setDescription(newDescription);
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("baca ")) {
    const newStatus = msg.body.split(" ")[1];
    const fetch = require("node-fetch");
    let url =
      "https://al-quran-8d642.firebaseio.com/surat/" +
      newStatus +
      ".json?print=pretty";

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(resJSON => {
        resJSON.forEach(item => {
          client.sendMessage(
            msg.from,
            `
  Ayat ۝, :  
       *${item.ar}*
  ----------------------------------
  Terjemah : 
       _${item.id}_
  ----------------------------------

  _Al-Quran WhatsApp By Abdul Muttaqin_
`
          );
        });
      });
  } else if (msg.body == "!leave") {
    // Leave the group
    let chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("!join ")) {
    const inviteCode = msg.body.split(" ")[1];
    try {
      await client.acceptInvite(inviteCode);
      msg.reply("Joined the group!");
    } catch (e) {
      msg.reply("That invite code seems to be invalid.");
    }
  } else if (msg.body == "!grouplocalData") {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
    } else {
      msg.reply("This command can only be used in a group!");
    }
  }
});

listen.on("message", (topic, message) => {
  console.log(`[ ${moment().format("HH:mm:ss")} ] MQTT: ${message.toString()}`);
  fs.readFile("./CoronaService/user.json", "utf-8", function(err, data) {
    if (err) throw err;
    const userData = JSON.parse(data);
    for (var i = 0; i < userData.length; i++) {
      let number = userData[i].user;
      // number = number.includes('@c.us') ? number : `${number}@c.us`;
      setTimeout(function() {
        console.log(
          `[ ${moment().format("HH:mm:ss")} ] Send Corona Update to ${number}`
        );
        if (message.toString() === "New Update!") {
          fs.readFile("./CoronaService/data.json", "utf-8", function(
            err,
            data
          ) {
            if (err) throw err;
            const localData = JSON.parse(data);
            const newCases = localData.NewCases === "" ? 0 : localData.NewCases;
            const newDeaths =
              localData.NewDeaths === "" ? 0 : localData.NewDeaths;
            client.sendMessage(
              number,
              `
                    *COVID-19 Update!!*
Negara: ${localData.Country}

Kasus aktif: ${localData.ActiveCases}
Total Kasus: ${localData.TotalCases}
*Kasus Baru: ${newCases}*
        
Meninggal: ${localData.TotalDeaths}
*Meninggal Baru: ${newDeaths}*
        
Total Sembuh: ${localData.TotalRecovered}
                    
Dicek pada: ${moment()
                .format("LLLL")
                .replace("pukul", "|")} WIB
Sumber: 
_https://www.worldometers.info/coronavirus/_
                    `
            );
          });
        }
        // Delay 3 Sec
      }, i * 3000);
    }
  });
});
