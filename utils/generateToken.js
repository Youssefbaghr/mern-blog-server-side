import jwt from 'jsonwebtoken';

const jwtsecret = 'jhgfvhljvhlvlh6794576476RGCKGCGJ';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, jwtsecret, {
        expiresIn: '30d',
    });

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
    });
};

export default generateToken;
