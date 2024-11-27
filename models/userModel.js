const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserModel = sequelize.define('User', {
  cnpj: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // Nome da tabela no banco
  timestamps: false,  // Sem createdAt e updatedAt
});

module.exports = UserModel;
