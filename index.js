const express = require('express');
const app = express();

const PORT = 3000;

// For html templates
app.use(express.static(__dirname + '/views'));
// For assets
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

app.listen(PORT, () => {
  console.log(`BeansBot is running on port ${PORT}...`);
});