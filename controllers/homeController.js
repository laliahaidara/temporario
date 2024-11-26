exports.home = (req, res) => {
    const projects = [
        { title: 'Projeto 1', description: 'Descrição do projeto 1' },
        { title: 'Projeto 2', description: 'Descrição do projeto 2' },
        { title: 'Projeto 3', description: 'Descrição do projeto 3' },
    ];
    res.render('home', { projects });
};
