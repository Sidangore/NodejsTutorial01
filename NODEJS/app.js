const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

//controllers
const errorController = require('./controllers/error');

// Model
const User = require('./models/user');

// Dynamic templating using the pug engine and can find the files in 'views'
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const { getProducts } = require('./controllers/admin');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("60900906850142039031125a")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//404 Page 
app.use(errorController.get404);

mongoose
    .connect("mongodb+srv://angoresid:angoresid@cluster0.wtgd9.mongodb.net/shop?retryWrites=true", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    // To Create a New User
                    const user = new User({
                        username: 'Siddhant',
                        email: 'sid.angore@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            })
            .catch(err => {
                console.log(err);
            });
        app.listen(3000);
        console.log('Connected to DB!');
    })
    .catch(err => {
        console.log(err);
    });