const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcryptjs'); // Criptografar senhas
const userModel = require('./models/userModel'); // Modelo da Empresa Júnior
const routes = require('./routes/routes'); // Rotas gerais (projetos, etc.)
const authRoutes = require('./routes/authRoutes'); // Rotas de autenticação
const path = require('path'); // Lida com caminhos de arquivos

// Inicializa o express
const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para receber dados do corpo da requisição
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
app.use(
  session({
    secret: 'usuarioteste', // Substitua por uma string segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Defina true se você estiver usando HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Middleware para definir a variável 'user' em todas as views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Adiciona `user` como variável global
  next();
});

// Rotas de autenticação
app.use('/auth', authRoutes);

// Middleware de autenticação
function verificarAutenticacao(req, res, next) {
  if (!req.session.user) { // Verifica se o usuário está logado
    return res.redirect('/login'); // Se não estiver autenticado, redireciona para o login
  }
  next(); // Se estiver autenticado, continua o processamento da rota
}

// Rota para login
app.get('/auth/login', (req, res) => {
  res.render('auth/login'); // Página de login
});

// Rota POST para login
app.post('/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const ej = await userModel.findOne({ where: { Email: email } });

    if (ej) {
      const senhaValida = await bcrypt.compare(senha, ej.Senha);
      if (senhaValida) {
        // Armazenando os dados completos do usuário na sessão
        req.session.user = {
          cnpj: ej.cnpj,
          nome: ej.Nome,
          email: ej.Email,
        };
        return res.redirect('/auth/perfil'); // Redireciona para o perfil
      }
    }
    res.render('auth/login', { error: 'Email ou senha incorretos.' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('auth/login', { error: 'Ocorreu um erro. Tente novamente.' });
  }
});

// Rota para registro
app.get('/register', (req, res) => {
  res.render('auth/register'); // Página de registro
});

// Rota POST para registro
app.post('/auth/register', async (req, res) => {
  const { cnpj, Nome, Email, Senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    await userModel.create({
      cnpj,
      Nome,
      Email,
      Senha: senhaCriptografada,
    });

    res.redirect('/auth/login'); // Depois do registro, redireciona para o login
  } catch (error) {
    console.error('Erro no registro:', error);
    res.render('auth/register', { error: 'Erro ao cadastrar. Tente novamente.' });
  }
});

// Rota para logout
app.get('/auth/logout', (req, res) => {
  req.session.destroy(); // Destroi a sessão
  res.redirect('/auth/login'); // Redireciona para o login depois do logout
});

// Rota protegida: perfil
app.get('/auth/perfil', verificarAutenticacao, (req, res) => {
  res.render('auth/perfil', { user: req.session.user }); // Exemplo de como acessar os dados da sessão
});

// Outras rotas gerais (projetos, etc.)
app.use('/', routes); // Rotas de projetos ou outras funcionalidades

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
