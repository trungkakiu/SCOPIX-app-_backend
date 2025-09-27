import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const targetPath = path.join(__dirname, "../../ImgStorage/UserAvatar");
    console.log("Đường dẫn lưu ảnh:", targetPath);
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

const allowedMime = ["image/jpeg", "image/png", "image/webp"];
const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, cb) => {
  if (!file) return cb(null, false);

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép ảnh JPG, PNG, WEBP"), false);
  }
};

const UserAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default UserAvatar;
