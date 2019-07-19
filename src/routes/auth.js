const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');


router.post('/register', async(req,res)=>{

    //VALIDATION

    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK IF USER EXISTS

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //HASING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //CREATING NEW USER

    const user = new User({
        email: req.body.email,
        password: hashPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async(req,res) => {

    //VALIDATE DATA

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //CHECK IF EMAIL EXIST

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email doesn't exist");

    //VALIDATE PASSWORD
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid password');

    //ASSIGN TOKEN
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);


});

module.exports = router;