const Sequelize = require('sequelize')
const home = {}
const sequelize = new Sequelize('home', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

home.sequelize = sequelize
home.Sequelize = Sequelize

module.exports = home