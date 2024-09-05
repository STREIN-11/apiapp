const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fetchuser = require('../middleware/fetchuser')

const sec = 'subhamayganguly@'

// Route: 1 = Create New Users
router.post('/create', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }
    // const user = User(req.body);
    // user.save();
    // res.send(req.body);
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ error: "Already Exist" })
        }
        // Create New Users...
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: pass
        });
        const data={
            user:{
                id: user.id
            }
        }
        const token = jwt.sign(data,sec);
        // res.json(user);
        res.json({token});
    } catch (error) {
        console.error(error.message);
    }
})


// Route: 2 = Login Users using Email & passwords
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ result: result.array() });
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            res.status(400).json({error: "Try correct password"})
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            res.status(400).json({error: "Try correct password"})
        }
        const data={
            user:{
                id: user.id
            }
        }
        const token = jwt.sign(data,sec);
        res.json({msg:"Welcome",token});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})

// Route: 3 = to get user data
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Servar Error");
    }
})
module.exports = router