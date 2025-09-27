import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../Frame_avatar");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
    const { framename } = req.body;
    if (!framename || framename.trim() === "") {
      return cb(new Error("Thiếu tên frame trong request"), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /\.(png)$/i;
  const isValid =
    allowed.test(file.originalname.toLowerCase()) ||
    file.mimetype === "image/png";
  cb(isValid ? null : new Error("Chỉ cho phép ảnh PNG"), isValid);
};

const FrameUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default FrameUpload;
