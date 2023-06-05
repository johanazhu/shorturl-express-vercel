const express = require("express");
const cors = require("cors");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const app = express();

const port = process.env.PORT || 3000;

const inmemoryDatabase = {};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(express.static("public"));
app.use(express.static(__dirname + "/public/"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  if (validateUrl(url)) {
    const short_url = shortid.generate();
    inmemoryDatabase[short_url] = url;

    res.json({ original_url: url, short_url: short_url });
  }
  res.json({ error: "invalid url" });
});

app.get("/api/shorturl/:shorturl", function (req, res) {
  const { shorturl } = req.params;
  if (Object.prototype.hasOwnProperty.call(inmemoryDatabase, short_url)) {
    res.redirect(inmemoryDatabase[shorturl]);
  }
  res.json({ error: "invalid url" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
