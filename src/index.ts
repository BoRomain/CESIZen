import express = require("express");

const app = express();
const port: number = 3000;

app.get("/", (req, res) => {
  res.send("CESIZEN actif !");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
