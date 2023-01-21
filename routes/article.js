const auth = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/UploadMiddleware");

const express = require("express");
const router = express.Router();
const articleController = require("../controller/ArticleController");

//create new Article
router.post("/articles", upload, articleController.createArticle);

// get list articles by name
router.get("/articles", auth, articleController.listOfArticles);

//get article by id
router.get("/articles/:id", auth, articleController.getArticleById);

module.exports = router;