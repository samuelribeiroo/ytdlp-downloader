import { Express, Request, Router, Response } from "express";
import { convertToMp3 } from "../services/ytdlp";
import fs from "fs";
import path from "path";

const router = Router();

router.post("/convert", async (request: Request, response: Response) => {
  const { url } = request.body;

  if (!url || typeof url !== "string") {
    response.status(400).json({ error: "URL inválida ou não informada" });
    return;
  }

  try {
    const mp3path = await convertToMp3(url);
    const filename = path.basename(mp3path);

    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    response.setHeader("Content-Type", "audio/mpeg");

    const stream = fs.createReadStream(mp3path);
    stream.pipe(response);

    stream.on("close", () => {
      fs.unlink(mp3path, () => {});
    });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
});

export default router;

