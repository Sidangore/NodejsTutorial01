const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

//controllers
const errorController = require('./controllers/error');

//Utilities
const sequelize = require('./utility/database');

// Dynamic templating using the pug engine and can find the files in 'views'
app.set('view engine', 'ejs');
app.set('views', 'views');

//Models
const Product = require('./models/product');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//404 Page 
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

//call sequelize
sequelize.sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Siddhant', email: 'sid.angore@gmail.com' });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        // console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });