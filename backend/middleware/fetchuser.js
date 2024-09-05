const jwt = require('jsonwebtoken');
const sec = 'subhamayganguly@'
// Get user from id topken and encrypt that
const fetchuser = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: "Acccess Denied"})
    }
    try {
        const data = jwt.verify(token, sec);
        req.user  = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Acccess Denied"})
    }
}


module.exports = fetchuser