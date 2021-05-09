const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const user = require('../models/user');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password.');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            if (err) { console.log(err); }
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid Email or Password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) { console.log(err); }
        res.redirect('/')
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email Exists Already! Signup with New Email.');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        username: username,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(() => {
                    req.flash('success', 'Account Created! Use that to Login.');
                    res.redirect('/login');
                    return transporter.sendMail({ 
                        to: email,
                        from: 'sid.angore@gmail.com',
                        subject: 'Successfully Signed Up!',
                        text: 'Now enjoy the shop products...',
                        html: '<strong> You successfully signed up on our shop! </strong>'
                    });
                })
                .then(() => {
                    console.log('Email Sent!');
                })
                .catch(err => {
                    console.log('Error while sending:', err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset-password', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        const url = "http://localhost:3000/reset/" + token.toString();
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user === null) {
                    req.flash('error', 'No Account Found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user
                    .save()
                    .then(() => {
                        transporter.sendMail({ 
                                to: req.body.email,
                                from: 'sid.angore@gmail.com',
                                subject: 'Reset Password!',
                                text: 'Forgotten your password or wanna change. Reset Now...',
                                html: `
                            <a href="${url}"> Reset Password </a>
                            `
                            })
                            .then(() => {
                                console.log('Reset password link sent');
                            })
                            .catch(err => {
                                console.log('Error while sending:', err);
                            });
                        res.redirect('/');
                    });
            })
            .catch(err => {
                console.log(err);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/new-password',
                errorMessage: req.flash('error'),
                successMessage: req.flash('success'),
                userID: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userID = req.body.userID;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userID })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    resetUser.password = hashedPassword;
                    resetUser.resetToken = null;
                    resetUser.resetTokenExpiration = null;
                    return resetUser.save()
                        .then(() => {
                            req.flash('success', 'Password Resetted Successfully!');
                            res.redirect('/login');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}