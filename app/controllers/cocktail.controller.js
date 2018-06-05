const {Cocktail} = require('../models/cocktail.model');
const utilities = require('../utilities/utilities');

exports.create = async function(req, res) {
    console.log('req.body @ create @ cocktail.controller: ', req.body);

    // Save the parameters passed from frontend
    let { cocktail } = req.body;
    let cocktailToSave = new Cocktail(cocktail);

    cocktailToSave.save()
    .then((theCocktail) => {
        console.log('cocktail @ cocktail.save: ', theCocktail);
        res.send({theCocktail});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};