const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const router = express.Router();

// Rota POST para cadastrar a Empresa Júnior
router.post('/cadastro', async (req, res) => {
  const { ID, Nome, Email, Senha } = req.body;

  try {
    // Verifica se já existe uma Empresa Júnior com o mesmo ID
    const existente = await userModel.findOne({ where: { ID } });
    if (existente) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este ID.' 
      });
    }

    // Gera o hash da senha (criptografia)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    // Cria a nova Empresa Júnior no banco de dados
    await userModel.create({
      ID,
      Nome,
      Email,
      Senha: senhaCriptografada,
    });

    // Redireciona para a página de login após o cadastro
    res.status(201).redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar Empresa Júnior.');
  }
});

// Rota POST para registro no formato `/register`
router.post('/register', async (req, res) => {
  const { ID, Nome, Email, Senha } = req.body;

  try {
    // Valida se o ID ou o Email já foram cadastrados
    const existente = await userModel.findOne({ where: { ID } });
    if (existente) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este ID.' 
      });
    }

    const existenteEmail = await userModel.findOne({ where: { Email } });
    if (existenteEmail) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este Email.' 
      });
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(Senha, salt);

    // Cria o registro no banco de dados
    await userModel.create({
      ID,
      Nome,
      Email,
      Senha: senhaCriptografada,
    });

    // Redireciona para a página de login após o registro
    res.status(201).redirect('/auth/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar Empresa Júnior.');
  }
});

// Rota POST para login de Empresa Júnior
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const ej = await userModel.findOne({ where: { Email: email } });

    if (ej) {
      const senhaValida = await bcrypt.compare(senha, ej.Senha);
      if (senhaValida) {
        req.session.empresaLogada = ej.ID; // Armazena o ID na sessão
        return res.redirect('/auth/perfil'); // Redireciona para o perfil
      }
    }
    res.render('auth/login', { error: 'Email ou senha incorretos. Tente novamente.' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.render('auth/login', { error: 'Ocorreu um erro. Tente novamente.' });
  }
});

// Rota para renderizar a página de perfil
router.get('/perfil', (req, res) => {
  // Verifica se o usuário está logado
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  // Passa os dados do usuário para a view
  res.render('auth/perfil', { user: req.session.user });
});

module.exports = router;
