const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = new Sequelize('sqlite:db.sqlite');
const Accounts = sequelize.define('accounts', {
  id: {
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  account: {
    unique: true,
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bonus_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  balance: DataTypes.REAL,
}, {
  timestamps: false,
});

module.exports.sequelize = sequelize;
module.exports.Accounts = Accounts;