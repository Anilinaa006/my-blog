import multer from "multer";
import path from "path";
import fs from "fs";

const projectRoot = path.dirname(process.cwd());
const avatarsDir = path.join(projectRoot, "uploads", "avatars");
const commentsDir = path.join(projectRoot, "uploads", "comments");

console.log("[upload] projectRoot:", projectRoot);
console.log("[upload] commentsDir:", commentsDir);

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

if (!fs.existsSync(commentsDir)) {
  fs.mkdirSync(commentsDir, { recursive: true });
}

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("只支持 JPEG、PNG、GIF、WebP 格式的图片"));
  }
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${userId}_${Date.now()}${ext}`);
  },
});

const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, commentsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id || Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `comment_${userId}_${Date.now()}${ext}`);
  },
});

export const upload = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const commentUpload = multer({
  storage: commentStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
