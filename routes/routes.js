const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const router = express.Router();

// rota p página inicial
router.get('/', (req, res) => {
  const projects = [
    { title: "Projeto 1", description: "Descrição do Projeto 1" },
    { title: "Projeto 2", description: "Descrição do Projeto 2" },
    { title: "Projeto 3", description: "Descrição do Projeto 3" }
  ];

  res.render('home', { 
    user: req.user,  // passa o usuário logado
    projects: projects // passa os projetos
  });
});

// rota para a página "Sobre"
router.get('/about', (req, res) => {
  res.render('about'); // a view 'about.ejs' tem que estar na pasta 'views'
});

// rota para a página "Contato"
router.get('/contact', (req, res) => {
  res.render('contact'); // a view 'contact.ejs' tem que estar na pasta 'views'
});
// authRoutes.js
router.get('/login', (req, res) => {
  res.render('auth/login'); // O caminho considera que login.ejs está em views/auth
});
router.get('/register', (req, res) => {
  res.render('auth/register'); // O caminho considera que login.ejs está em views/auth
});



// middleware para verificar se o usuário está logado
const autenticar = (req, res, next) => {
  if (req.session && req.session.empresaLogada) {
    return next();
  }
  res.redirect('/login');
};

// rota para a página de perfil
router.get('/perfil', autenticar, async (req, res) => {
  const cnpj = req.session.empresaLogada;
  console.log(cnpj)

  try {
    const ej = await userModel.findByPk(cnpj);

    if (ej) {
      res.render('auth/perfil', { ej }); // renderiza a página 'perfil.ejs' com os dados da empresa
    } else {
      res.redirect('/login'); // redireciona caso a empresa não seja encontrada
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao carregar o perfil.');
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  console.log(req.body);
  try {
    const ej = await userModel.findOne({ where: { email } });

    if (ej) {
      const senhaValida = await bcrypt.compare(senha, ej.senha);
      if (senhaValida) {
        req.session.empresaLogada = ej.cnpj; // Armazena o cnpj na sessão
        return res.redirect('/perfil'); // Redireciona para o perfil
      }
    } else res.render('/login', { error: 'Email ou senha incorretos. Tente novamente.' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.redirect('/login', { error: 'Ocorreu um erro. Tente novamente.' });
  }
});

module.exports = router;
