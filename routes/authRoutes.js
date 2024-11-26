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
  const { Email, Senha } = req.body;

  try {
    // Busca a Empresa Júnior pelo Email
    const ej = await userModel.findOne({ where: { Email } });

    if (!ej) {
      return res.render('auth/login', { error: 'Email ou senha incorretos.' });
    }

    // Valida a senha
    const senhaValida = await bcrypt.compare(Senha, ej.Senha);

    if (senhaValida) {
      // Salva as informações do usuário na sessão (incluindo ID, Nome e Email)
      req.session.user = {
        id: ej.ID,
        nome: ej.Nome,
        email: ej.Email,
      };

      // Redireciona para a página de perfil
      res.redirect('/auth/perfil');
    } else {
      res.render('auth/login', { error: 'Email ou senha incorretos.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao processar login.');
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
