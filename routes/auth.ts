
const { Router } = require('express');
const router = Router();

import { check } from 'express-validator';
import { createUser, loginUser, deleteUser, updatePassword } from '../controllers/auth';
import { validateEntries } from '../middlewares/validate_entries';

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
        validateEntries
    ],
    createUser
)

router.get(
    '/login',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
        validateEntries
    ],
    loginUser
)

router.delete( 
    '/:id',
    deleteUser
)

router.post(
    '/update',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }), 
        validateEntries
    ],
    updatePassword
)


module.exports = router;
