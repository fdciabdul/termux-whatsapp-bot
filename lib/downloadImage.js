const fs = require('fs')
const fetch = require('node-fetch')

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET'
        }).then((response) => {
            if (response.status !== 200) {
                return reject(new Error(`Failed to download ${url}: ${response.status}`))
            }
            const file = fs.createWriteStream(filename)
            response.body.pipe(file)
            file.on('error', (err) => reject(err))
            file.on('finish', () => {
                file.close()
                resolve(filename)
            })
        }).catch((err) => {
            reject(err)
        })
    })
}

module.exports = downloadImage
