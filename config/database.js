const { Sequelize } = require('sequelize');

// Configuração do Sequelize para conectar ao banco de dados MySQL
const sequelize = new Sequelize('ej', 'root', '', {
  host: 'localhost', // ou o IP do servidor do banco
  dialect: 'mysql',  // Dialeto para o banco MySQL
  logging: false,    // Desabilita logs do SQL no console
});

sequelize.authenticate()
    .then(() => {
        console.log('Conexão estabelecida com sucesso.');
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });


module.exports = sequelize;
