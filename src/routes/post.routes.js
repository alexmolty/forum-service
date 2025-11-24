import postController from "../controllers/post.controller.js";
import express from "express";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post('/post/:author', validate('createPost'), postController.createPost)
router.get('/post/:id', postController.getPostById)

export default router;