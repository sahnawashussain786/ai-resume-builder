import { Router } from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import { parsePdf } from "../services/pdfParser.js";
import { parseDocx } from "../services/docxParser.js";
import { textToResumeJson } from "../services/resumeExtractor.js";
import { normalizeContent } from "../services/normalize.js";

const router = Router();
router.use(auth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ].includes(file.mimetype);
    cb(ok ? null : new Error("Only PDF, DOCX or TXT files are allowed"), ok);
  },
});

router.post("/resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    let text = "";
    if (req.file.mimetype === "application/pdf")
      text = await parsePdf(req.file.buffer);
    else if (req.file.mimetype === "text/plain")
      text = req.file.buffer.toString("utf8");
    else text = await parseDocx(req.file.buffer);

    if (!text || !text.trim())
      return res
        .status(422)
        .json({
          message:
            "Could not extract any text from this file (scanned PDFs are not supported).",
        });

    const content = normalizeContent(textToResumeJson(text));
    res.json({ source: "file", fileName: req.file.originalname, content });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
