const express = require('express');

const constructorMethod = (app) => {

    app.get('/', (req, res) => {
        //http://localhost:3000/ renders the index page
        res.render('index');
    });

    app.use('*', (req, res) => {
        //any other route goes to 404
        res.status(404).json({ error: 'Not found' });
    });

};
  
module.exports = constructorMethod;