exports.getLoginPage = (req, res) => {
    res.render('auth/login', { 
        error: null,
        user: null 
    });
};

exports.getRegisterPage = (req, res) => {
    res.render('auth/register', { 
        error: null,
        user: null 
    });
}; 