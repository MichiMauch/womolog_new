import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();  // Laden der Umgebungsvariablen aus der .env-Datei

let credentials;

if (fs.existsSync(path.join(process.cwd(), 'lib', 'service-account.json'))) {
  // Lokale Entwicklung
  const keyFile = path.join(process.cwd(), 'lib', 'service-account.json');
  credentials = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
} else {
  // Vercel oder andere Umgebung, die Umgebungsvariablen verwendet
  credentials = {
    type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
    project_id: process.env.GOOGLE_SERVICE_ACCOUNT_PROJECT_ID,
    private_key_id: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
    auth_uri: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_URI,
    token_uri: process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  };
}

console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);  // Debugging-Ausgabe
console.log('Credentials:', credentials);  // Debugging-Ausgabe

export async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A2:K', // Bereich anpassen, um alle relevanten Daten zu erfassen
    });

    console.log('API Response:', response.data);  // Debugging-Ausgabe der gesamten Antwort

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found');
    }
    console.log('Rows:', rows);  // Debugging-Ausgabe der Zeilen
    return rows;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
  }
}

// Testaufruf der Funktion, um die Ausgabe zu überprüfen
getSheetData().then(data => {
  console.log('Fetched data:', data);
}).catch(error => {
  console.error('Error:', error);
});
