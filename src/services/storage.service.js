const { ImageKit } = require('@imagekit/nodejs')

const client = new ImageKit({
    privateKey : process.env.IMAGE_KIT_URI
})

async function uploadFile(buffer, originalName, folder) {

    const extension = await originalName.split(".").pop()

    const fileName = `${Date.now()}.${extension}`


    const result = await client.files.upload({
        file : buffer.toString('base64'),
        fileName,
        folder
    })

    return result;
}


module.exports = {
    uploadFile
}