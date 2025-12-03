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
  "https://api.hubspot.com/crm/v3/objects/books?properties=name,author,genre";

 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };

 try {
  const resp = await axios.get(books, { headers });
  const data = resp.data.results;
  res.render("homepage", { title: "Books | HubSpot Custom Object", data });
 } catch (error) {
  console.error(error);
  res.send("Error fetching book records");
 }
});

app.get("/update-cobj", async (req, res) => {
 const email = req.query.email;

 const getBook = `https://api.hubapi.com/crm/v3/objects/books/${name}?idProperty=name&properties=name,author,genre`;
 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };

 try {
  const response = await axios.get(getBook, { headers });
  const data = response.data;

  // res.json(data);
  res.render("update", {
   name: data.properties.name,
   author: data.properties.author,
   genre: data.properties.genre,
  });
 } catch (err) {
  console.error(err);
 }
});

app.post("/update-cobj", async (req, res) => {
 const update = {
  properties: {
   name: req.body.name,
   author: req.body.author,
   genre: req.body.genre,
  },
 };

 const name = req.query.name;
 const updateBook = `https://api.hubapi.com/crm/v3/objects/books/${name}?idProperty=name`;
 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
 };

 try {
  await axios.patch(updateBook, update, { headers });
  res.redirect("back");
 } catch (err) {
  console.error(err);
 }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
