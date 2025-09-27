import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coverImgDir = path.join(__dirname, "../../Comic/CoverImg");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, coverImgDir);
  },
  filename: (req, file, cb) => {
    if (!file) {
      return cb(null, "");
    }

    const ext = path.extname(file.originalname);
    const newFileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;

    if (file.fieldname === "NewCoverImg") {
      const oldCover = req.body.oldcover;
      if (oldCover) {
        const oldPath = path.join(coverImgDir, oldCover);
        try {
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.error("Lỗi khi xóa ảnh cũ:", err.message);
        }
      }
    }

    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const isValid =
    allowed.test(file.mimetype) ||
    allowed.test(path.extname(file.originalname).toLowerCase());
  cb(isValid ? null : new Error("Chỉ cho phép ảnh"), isValid);
};

const CoverUpdate = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default CoverUpdate;
