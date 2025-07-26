import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export function downloadVideo(url, format) {
  return new Promise((resolve, reject) => {
    const outputTemplate = "downloads/%(title)s.%(ext)s";
    let command = "";

    if (format === 'mp3') {
      command = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" --print after_move:filepath ${url}`;
    } else {
      command = `yt-dlp -f best -o "${outputTemplate}" --print after_move:filepath ${url}`;
    }

    exec(command, (error, stdout) => {
      if (error) return reject(error);

      const fullPath = stdout.trim(); // абсолютный путь к файлу
      const baseName = path.basename(fullPath);

      if (!fs.existsSync(fullPath)) {
        return reject(new Error("Файл не найден"));
      }

      resolve(baseName); // возвращаем только имя файла
    });
  });
}
