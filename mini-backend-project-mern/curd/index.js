const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const port = 8080;
const path = require("path");

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

let posts = [
  {
    id: uuidv4(),
    username: "faizan",
    message: "hello there!",
  },
  {
    id: uuidv4(),
    username: "nida",
    message: "how is everyone",
  },
];

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new-post.ejs");
});

app.post("/posts", (req, res) => {
  const { username, message } = req.body;
  const id = uuidv4();
  posts.unshift({ id, username, message });
  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);
  if (!post) {
    return res.send("Post not found");
  }
  res.render("post.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  const { id } = req.params;
  const post = posts.find((post) => post.id === id);
  res.render("post-edit.ejs", { post });
});

app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const {message} = req.body;
  const post = posts.find((post) => String(post.id) === String(id));
  if (!post) {
    return res.send("Post not found");
  }
  post.message = message;

  res.redirect(`/posts/${id}`);
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  posts = posts.filter((post) => String(post.id) !== String(id));
  res.redirect("/posts");
})

app.listen(port, () => {
  console.log("server start");
});
