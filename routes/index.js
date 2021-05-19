const express = require('express');

const constructorMethod = (app) => {

    app.get('/', (req, res) => {
        res.render('index');
    });

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });

};
  
module.exports = constructorMethod;