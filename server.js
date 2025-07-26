import express from 'express';
import cors from 'cors';
import { downloadVideo } from './downloader.js';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('downloads'));

app.post('/api/download', async (req, res) => {
  const { url, format } = req.body;
  console.log('Получен запрос:', url, format); // 👈 добавь это

  try {
    const filename = await downloadVideo(url, format);
    console.log('Скачан файл:', filename); // 👈 добавь это
    res.json({ url: `/downloads/${filename}` });

  } catch (e) {
    console.error('Ошибка загрузки:', e); // 👈 добавь это
    res.status(500).json({ error: e.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend запущен на порт ${PORT}`));

// ⏰ Every 20 minutes, delete all files in 'downloads/'
cron.schedule('*/20 * * * *', () => {
  const folder = path.join(process.cwd(), 'downloads');
  fs.readdir(folder, (err, files) => {
    if (err) return console.error('Ошибка чтения папки:', err);
    for (const file of files) {
      const filePath = path.join(folder, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Не удалось удалить файл:', filePath, err);
        else console.log('Удален файл:', filePath);
      });
    }
  });
});

