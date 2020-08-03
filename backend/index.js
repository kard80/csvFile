const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const download = require('downloadjs')

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())

// app.get('/', async (req, res) => {
//     const result = [];
//     fs.createReadStream('../frontend/src/uploads/1596430095946.csv')
//     .pipe(csv())
//     .on('data', data => result.push(data))
//     .on('end', () => {
//         res.send(result)
//     })
// })

app.get('/filename', async (req, res) => {
    const filename = await db.fileName.findAll();
    res.send(filename)
})

app.get('/filename/:filename', async (req, res) => {
    const filename = req.params.filename
    const result = [];
    fs.createReadStream(`../frontend/src/uploads/${filename}`)
    .pipe(csv())
    .on('data', data => result.push(data))
    .on('end', () => {
        res.send(result)
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/src/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.csv')
    }
})
const upload = multer({storage,})

app.post('/', upload.single('file'), (req, res) => {
    db.fileName.create({
        fileName: req.file.filename,
    })
    res.send(req.file)
   
})

app.post('/download', (req, res) => {
    download('File', '1596430095946.csv')
})


db.sequelize.sync({force: false})
    .then(() => {
        app.listen(8000, () => {
            console.log('Server is running on port 8000')
        })
    })