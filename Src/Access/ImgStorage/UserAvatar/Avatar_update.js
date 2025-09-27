import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarDir = path.join(__dirname, "../../ImgStorage/UserAvatar");

if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const newFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    req.newAvatar = newFileName;

    const oldImg = req.body.oldImg;
    console.log("Ảnh cũ cần xóa:", oldImg);
    if (oldImg) {
      const cleanOldImg = oldImg?.replace(/"/g, "").trim();
      const oldPath = path.join(avatarDir, cleanOldImg);

      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
          console.log("Đã xóa ảnh cũ:", oldImg);
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ:", err.message);
        }
      } else {
        console.log("Không tìm thấy ảnh cũ:", oldImg);
      }
    }

    cb(null, newFileName);
  },
});

const allowedMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/*",
];
const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, cb) => {
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
