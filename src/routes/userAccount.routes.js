import {Router} from "express";
import userAccountController from "../controllers/userAccount.controller.js";
import validate from "../middlewares/validation.middleware.js";
import userAccountService from "../services/userAccount.service.js";

const router = Router();

router.post('/register', validate('register'),userAccountController.register)
router.post('/login', userAccountController.login)
router.delete('/user/:login', validate('deleteUser', 'params'), userAccountController.deleteUser)
router.patch('/user/:login', validate('updateUser'),userAccountController.updateUser)
router.patch('/user/:login/role/:role', validate('changeRole', 'params'),userAccountController.addRole)
router.delete('/user/:login/role/:role', validate('changeRole', 'params'), userAccountController.deleteRole)
router.patch('/password', validate('changePassword'), userAccountController.changePassword)
router.get('/user/:login', validate('getUser', 'params') ,userAccountController.getUser)
export default router;