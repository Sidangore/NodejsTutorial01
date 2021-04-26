const Sequelize = require('sequelize');

const sequelize = new Sequelize('Nodejs-complete', 'root', 'Siddhant1', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;