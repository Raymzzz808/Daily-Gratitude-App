import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Quote from 'inspirational-quotes';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const title = "The Daily Gratitude App";
const posts =[];
const postContent = [];
const postdate = [];
const date ="";
var authorizedUser = false;
const users =[];

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true })); 

app.get("/", (req, res) => {
  const quote = Quote.getRandomQuote();
  res.render("../views/index.ejs",{
    content: req.body['entry-content'],
    postTitle: req.body['entry-title'],
    title,
    posts,
    postContent,
    date,
    quote,
  });
});

app.get("/login",(req,res)=>{
  const username = req.body['username'];
  const password = req.body['password'];
  res.render("../views/login.ejs",{
    title,
    password,
    username
  });
});

//function to checkPassword
function pC(req, res, next){
  let password = req.body["password"];
  if (req.body.password === '123'){
      authorizedUser = true;
  } 
  next();
};

//LOGIN SUCESS
app.post("/user", pC, (req, res) => {
  // If the AU is correct
  if (authorizedUser){
      res.render("../views/index.ejs",{
        content: req.body['entry-content'],
        postTitle: req.body['post-title'],
        title,
        posts,
        postContent,
        date});
  } else {
      //RESPONSE = index.html
      res.render("../views/signup.ejs",{title});
  }
});


//GET SIGN-UP PAGE
app.get("/signup", (req,res)=>{
  res.render("../views/signup.ejs",{
    title
  });
});

//GET MEDITATION PAGE
app.get("/meditate",(req,res)=>{
  res.render("../views/meditate.ejs",{
    title
  });
});

function nU(req,res,next){
  let login = {
    id: req.body['username'],
    fName:req.body['first-name'],
    lName: req.body['last-name'],
    pw: req.body['password'],
    email:req.body['email']
  };

  users.push(login);
  console.log(users);
  next();
};

//NEW USER SIGN UP.
app.post("/newUser",nU, (req,res)=>{
  const login = {
    id: req.body['username'],
    fName:req.body['first-name'],
    lName: req.body['last-name'],
    pw: req.body['password'],
    email:req.body['email']
  };

  res.render("../views/index.ejs",{
  content: req.body['entry-content'],
  postTitle: req.body['post-title'],
  title,
  posts,
  postContent,
  date});
});


//POST METHOD when SAVED/SUBMITTED
app.post("/submit",(req,res)=>{
  const date = new Date().toLocaleDateString();
  const entryTitle = req.body['entry-title'];
  const entryContent = req.body['entry-content'];
  posts.push(entryTitle);
  postContent.push(entryContent);
  postdate.push(date);
  res.render("../views/index.ejs",{
    title,
    posts,
    postContent,
    date:postdate,
    content:postContent,
  });
});

//UPDATE POST
app.post("/save",(req,res)=>{
  const date = new Date().toLocaleDateString();
  const entryTitle = req.body['entry-title'];
  const entryContent = req.body['entry-content'];
  posts.push(entryTitle);
  postContent.push(entryContent);
  postdate.push(date);
  res.render("../views/index.ejs",{
    title,
    posts,
    postContent,
    date:postdate,
    content:postContent
  });
});

//EDIT POST FORM
app.post("/edit/",(req, res) => {
  const index = posts.indexOf(req.body.title);
  const indexC = postContent.indexOf(req.body.content);
  let postTitleEdit = req.body.title;
  let formattedContent = req.body.content;
  if (req.body.title != req.body.postTitleEdit || req.body.content != req.body.postContentEdit){
    posts[index] = req.body['entry-title'];
    postContent[indexC] = req.body['entry-content'];   
  } else if (!req.body['entry-title'] || !req.body['entry-title']) {
    let posts = posts;
    }; 
  res.render("../views/edit.ejs", {
      postTitleEdit,
      posts: posts,
      postContentEdit: formattedContent,
      title
  });
});

//DELETE POST
app.post("/delete",(req,res)=>{
  const deleteContent = req.body['entry-content'];
  const index = posts.indexOf(req.body['entry-title']);
  if (index === -1) {
      posts.pop(index);
      postContent.pop(index);
  } 
  res.render("../views/index.ejs",{
    deleteContent,
    title,
    posts,
    postContent,
    date:postdate,
    content:postContent
  });
});

//ABOUT PAGE
app.get("/about",(req,res)=>{
  res.render("../views/about.ejs",{
    content: req.body['entry-content'],
    postTitle: req.body['entry-title'],
    title,
    posts,
    postContent,
    date});
});

//DONATE PAGE
app.get("/donate",(req,res)=>{
  res.render("../views/donate.ejs",{    
    content: req.body['entry-content'],
    postTitle: req.body['entry-title'],
    title,
    posts,
    postContent,
    date
  });
});

//SHARE PAGE
app.get("/share",(req,res)=>{
  res.render("../views/share.ejs",{
    content: req.body['entry-content'],
    postTitle: req.body['entry-title'],
    title,
    posts,
    postContent,
    date
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});