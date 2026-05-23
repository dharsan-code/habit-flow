const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        res.status(401).send({message: 'No Token provided'});
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];    

    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        next();
    }
    catch(err){
        res.status(401).json({message: 'Invalid token'});
    }
}