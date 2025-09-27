import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ComicName = req.body.title;
    const chapter_name = req?.body?.chapter_name;
    console.log(chapter_name);

    if (!ComicName || !chapter_name) {
      return cb(
        new Error("Thiếu tên truyện hoặc tên chapter trong request"),
        null
      );
    }

    const comicFolder = path.join(
      __dirname,
      "../../Comic/ComicChapter",
      ComicName
    );
    if (!fs.existsSync(comicFolder)) {
      fs.mkdirSync(comicFolder, { recursive: true });
    }
    const chapterFolder = path.join(comicFolder, chapter_name);
    if (!fs.existsSync(chapterFolder)) {
      fs.mkdirSync(chapterFolder, { recursive: true });
    }

    cb(null, chapterFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${Date.now()}${ext}`;

    file.savedFileName = path.posix.join(
      req.body.title,
      req.body.chapter_name,
      filename
    );
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const isValid =
    allowed.test(file.mimetype) ||
    allowed.test(path.extname(file.originalname).toLowerCase());
  cb(isValid ? null : new Error("Chỉ cho phép ảnh"), isValid);
};

const chapterUploads = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default chapterUploads;
