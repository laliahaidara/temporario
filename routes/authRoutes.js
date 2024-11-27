const express = require('express');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { clearParserCache } = require('mysql2');
const router = express.Router();

// Rota POST para registro no formato `/register`
router.post('/register', async (req, res) => {
  const { cnpj, nome, email, senha } = req.body;

  try {
    // Vazlida se o cnpj ou o Email já foram cadastrados
    const existente = await userModel.findOne({ where: { cnpj } });
    if (existente) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este cnpj.' 
      });
    }

    const existenteEmail = await userModel.findOne({ where: { email } });
    if (existenteEmail) {
      return res.render('auth/register', { 
        error: 'Já existe uma Empresa Júnior registrada com este Email.' 
      });
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // Cria o registro no banco de dados
    await userModel.create({
      cnpj,
      nome,
      email,
      senha: senhaCriptografada,
    });

    // Redireciona para a página de login após o registro
    res.status(201).redirect('/login');
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar Empresa Júnior.');
  }
});

// Rota POST para login de Empresa Júnior


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
