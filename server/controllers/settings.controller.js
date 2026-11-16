const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '../data/settings.json');
const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

const getSettings = (req, res) => {
  res.json(settings);
};

module.exports = {
  getSettings,
};
