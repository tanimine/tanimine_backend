import { Router } from 'express'
import { signUp, signIn, verify, logout, forgotPassword, resetPassword } from '../../controllers/auth.controller'
import { requireUser } from '../../middleware/requireUser'
const router = Router()

router.post('/signUp', signUp)
router.post('/verify', verify)
router.post('/signIn', signIn)
router.post('/logout', requireUser, logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

export default router
