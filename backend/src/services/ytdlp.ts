import path from "path";
import fs from "fs";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function convertToMp3(url: string): Promise<string> {
  const tmpDir = os.tmpdir();
  const jobId = Date.now().toString();
  const outputTemplate = path.join(tmpDir, `${jobId}-%(title)s.%(ext)s`);

  try {
    await execFileAsync("yt-dlp", [
      url,
      "--extract-audio",
      "--audio-format", "mp3",
      "--audio-quality", "0",
      "--output", outputTemplate,
      "--no-playlist",
      "--js-runtimes", "nodejs",
      "--extractor-retries", "3",
      "--no-check-certificates",
    ]);
  } catch (err: any) {
    throw new Error(`Falha no yt-dlp: ${err.stderr || err.message}`);
  }

  const files = fs.readdirSync(tmpDir);
  const mp3 = files.find(f => f.startsWith(jobId) && f.endsWith(".mp3"));

  if (!mp3) throw new Error("Erro: MP3 não foi gerado");

  return path.join(tmpDir, mp3);
}