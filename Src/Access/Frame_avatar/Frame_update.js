import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frameFir = path.join(__dirname, "../../Access/Frame_avatar");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, frameFir);
  },
  filename: (req, file, cb) => {
    if (!file) {
      return cb(null, false);
    }

    const ext = path.extname(file.originalname);
    const newFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    if (file && file.fieldname === "NewFrameImg" && req.body.url) {
      const oldPath = path.join(frameFir, req.body.url);

      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
          console.log(`Đã xóa ảnh cũ: ${req.body.url}`);
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ:", err.message);
        }
      }
    }

    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file) return cb(null, false);
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = file.mimetype === "image/png" || ext === ".png";
  cb(isValid ? null : new Error("Chỉ cho phép ảnh PNG"), isValid);
};

const Frame_update = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default Frame_update;
