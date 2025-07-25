const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✔️ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${Date.now()}-${base}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes("pdf")) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email ,jobId } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const saved = await prisma.subscription.create({
      data: { email, resumePath: ""  ,  jobId  },
    });

    res.status(200).json({ message: "Email saved successfully", data: saved });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/upload-resume/:id", upload.single("resume"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file)
      return res.status(400).json({ error: "Resume file is required" });
    const resumePath = req.file.path;
    const updated = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: { resumePath },
    });
    res
      .status(200)
      .json({ message: "Resume uploaded successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
