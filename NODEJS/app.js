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

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

//404 Page 
app.use(errorController.get404);

//call sequelize
sequelize.sync().then(result => {
    // console.log(result);
    app.listen(3000);
}).catch(err => {
    console.log(err);
});