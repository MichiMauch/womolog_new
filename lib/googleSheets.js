import { google } from 'googleapis';
import path from 'path';

const keyFile = path.join(process.cwd(), 'lib', 'service-account.json');

export async function getSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  try {
    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A2:F', // Bereich anpassen, um alle relevanten Daten zu erfassen
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found');
    }
    return rows;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
  }
}
