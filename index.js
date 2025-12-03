require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get("/", async (req, res) => {
 const books =
  "https://api.hubspot.com/crm/v3/objects/2-53954181?properties=name,author,genre";

 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };

 try {
  const resp = await axios.get(books, { headers });
  const data = resp.data.results;
  res.render("homepage", { title: "Books | HubSpot Custom Object", data });
 } catch (error) {
  console.error("HubSpot Error:", error.response?.data || error);
  res.send("Error fetching book records");
 }
});

app.get("/update-cobj", (req, res) => {
 res.render("updates", {
  title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
 });
});

// --- Create Book ---
app.post("/update-cobj", async (req, res) => {
 const newRecord = {
  properties: {
   name: req.body.name,
   author: req.body.author,
   genre: req.body.genre,
  },
 };

 const createUrl = "https://api.hubspot.com/crm/v3/objects/2-53954181";
 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };

 try {
  await axios.post(createUrl, newRecord, { headers });
  res.redirect("/");
 } catch (err) {
  console.error("HubSpot Error:", err.response?.data || err);
  res.send("Error creating book record");
 }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
