const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {

    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {
        const passwordResalt = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResalt) {
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60*60});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова'
            })
        }
    } else {
        res.status(404).json({
            message: 'Пользователя с таким email не существует'
        })
    }
};

module.exports.register = async function (req, res) {

    const candidate = await User.findOne({email: req.body.email});

    if (candidate) {

        res.status(409).json({
            message: 'Такой email уже существует. Попробуйте другой'
        })
    } else {

        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt);

        const user = new User({
            email: req.body.email,
            password: password
        });

        try {
            await user.save();
            res.status(201).json(user)
        } catch (e) {
            errorHandler(res, e);
        }
        
    }

};