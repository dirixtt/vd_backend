import { exec } from 'child_process';
import { readdirSync } from 'fs';
import path from 'path';

export function downloadVideo(url, format) {
  return new Promise((resolve, reject) => {
    const isInstagram = url.includes('instagram.com');
    const cookiePath = path.join('yt-cookies', 'instagram.txt');

    const args = format === 'mp3'
      ? `yt-dlp -x --audio-format mp3 -o "downloads/%(title)s.%(ext)s" ${url}`
      : `yt-dlp ${isInstagram ? `--cookies ${cookiePath}` : ''} -o "downloads/%(title)s.%(ext)s" ${url}`;

    const before = new Set(readdirSync('downloads'));

    exec(args, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);

      const after = new Set(readdirSync('downloads'));
      const newFile = [...after].find(f => !before.has(f));
      if (newFile) resolve(newFile);
      else reject(new Error('Файл не найден'));
    });
  });
}
