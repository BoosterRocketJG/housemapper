const { google } = require('googleapis');
const sheets = google.sheets('v4');

exports.handler = async function (event, context) {
  try {
    const { key, value } = event.queryStringParameters;
    const auth = new google.auth.GoogleAuth({
      keyFile: 'netlify/functions/credentials.json', // Update with the path to your credentials
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const authClient = await auth.getClient();

    const spreadsheetId = 'your-spreadsheet-id'; // Update with your spreadsheet ID
    const range = 'Sheet1!A:Z'; // Update with the relevant sheet name and range

    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    const filteredRows = rows.filter(row => row.includes(value));

    return {
      statusCode: 200,
      body: JSON.stringify(filteredRows),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
