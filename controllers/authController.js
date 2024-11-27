const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');  // Verifique o caminho do seu model

// Estratégia local para autenticação de usuário
passport.use(new LocalStrategy({
    usernameField: 'Email',  // O campo que será usado para o login (o email no caso)
    passwordField: 'Senha',  // O campo para a senha
}, async (email, senha, done) => {
    try {
        // Busca o usuário no banco de dados pelo email
        const usuario = await userModel.findOne({ where: { Email: email } });

        if (!usuario) {
            return done(null, false, { message: 'Email ou senha incorretos.' });
        }

        // Compara a senha fornecida com a senha no banco
        const senhaValida = await bcrypt.compare(senha, usuario.Senha);

        if (!senhaValida) {
            return done(null, false, { message: 'Email ou senha incorretos.' });
        }

        // Se tudo estiver certo, retorna o usuário
        return done(null, usuario);
    } catch (error) {
        console.error(error);
        return done(error);
    }
}));

// Serializa o usuário na sessão
passport.serializeUser((user, done) => {
    done(null, user.cnpj);  // Guarda o cnpj do usuário na sessão
});

// Desserializa o usuário a partir da sessão
passport.deserializeUser(async (cnpj, done) => {
    try {
        const usuario = await userModel.findOne({ where: { cnpj: cnpj } });
        done(null, usuario);  // Retorna o usuário com o cnpj armazenado na sessão
    } catch (error) {
        done(error);
    }
});




