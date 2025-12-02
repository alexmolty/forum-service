import postController from "../controllers/post.controller.js";
import {Router} from "express";
import validate from "../middlewares/validation.middleware.js";

const router = Router();

router.post('/post/:author', validate('createPost'), postController.createPost)
router.get('/post/:id', postController.getPostById)
router.delete('/post/:id', postController.deletePost)
router.patch('/post/:id/like', postController.addLike)
router.get('/posts/author/:author', postController.findPostsByAuthor)
router.patch('/post/:id/comment/:commenter', validate('addComment'), postController.addComment)
router.get('/posts/tags', validate('findPostsByTags', 'query'), postController.findPostsByTags)
router.get('/posts/period', validate('dateFormat', 'query') ,postController.findPostsByPeriod)
router.patch('/post/:id', validate('updatePost'), postController.updatePost)
export default router;
