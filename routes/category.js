const express = require('express');
const controller = require('../controllers/category');
const passport = require('passport');
const upload = require('../middleware/upload');
const router = express.Router();

const {create, getAll, getById, update, remove} = controller;


router.get('/', passport.authenticate('jwt', {session: false}), getAll);
router.get('/:id', passport.authenticate('jwt', {session: false}), getById);
router.delete('/:id', passport.authenticate('jwt', {session: false}), remove);
router.post('/', passport.authenticate('jwt', {session: false}), upload.single('image'), create);
router.patch('/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), update);

module.exports = router;