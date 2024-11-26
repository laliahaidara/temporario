const { Sequelize } = require('sequelize');

// Configuração do Sequelize para conectar ao banco de dados MySQL
const sequelize = new Sequelize('ej', 'usuarioteste', 'usuarioteste', {
  host: 'localhost', // ou o IP do servidor do banco
  dialect: 'mysql',  // Dialeto para o banco MySQL
  logging: false,    // Desabilita logs do SQL no console
});

module.exports = sequelize;
