import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "uploads"))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

const uploader = multer({ storage: storage })

export default uploader;