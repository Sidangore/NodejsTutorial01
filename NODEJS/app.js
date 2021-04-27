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
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { getProducts } = require('./controllers/admin');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            // console.log('this is the user: ', req.user.id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//404 Page 
app.use(errorController.get404);

//Associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


//call sequelize
sequelize.sync() //Write; {force: true} in sync() to drop all the existing tables and create a freash look
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
        // user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });