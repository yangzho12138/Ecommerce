import express from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, 'uploads/')
    },
    filename(req, file, callback){
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`) // format the file name
    }
})

function checkFileType(file, callback){
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype){
        return callback(null, true) // null error
    }else{
        callback('Images only!') // return an error
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, callback){
        checkFileType(file, callback)
    }
})

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`) // path
})


export default router