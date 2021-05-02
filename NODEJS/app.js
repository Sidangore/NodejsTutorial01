const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Utilities
const mongoConnect = require('./utility/database').mongoConnect;

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
    User.findById("608e4059c236dc96be0b030c")
        .then(user => {
            req.user = new User(user.username, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//404 Page 
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});