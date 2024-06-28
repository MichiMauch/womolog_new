import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  // Pfad zum Skript
  const scriptPath = path.resolve(process.cwd(), 'scripts/processImages.js');

  // Skript ausführen
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).json({ error: error.message });
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      res.status(500).json({ error: stderr });
      return;
    }

    // Filtern der relevanten Ausgaben
    const filteredOutput = stdout.split('\n').filter(line => {
      return line.includes('Konvertiert:') || line.includes('Bucket Name:') || line.includes('Hochgeladen:') || line.includes('Alle Bilder wurden konvertiert und hochgeladen.');
    }).join('\n');

    // Ausgabe des Skripts zurückgeben
    res.status(200).json({ output: filteredOutput });
  });
}
