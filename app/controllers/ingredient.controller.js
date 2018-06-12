const {Ingredient} = require('../models/ingredient.model');
const utilities = require('../utilities/utilities');

exports.create = async function(req, res) {
    console.log('req.body @ create @ ingredient.controller: ', req.body);

    // Save the parameters passed from frontend
    let {name, description, type, alcoholPercentage} = req.body.ingredient;

    let ingredientToSave = new Ingredient({
        name: name,
        description: description,
        alcoholPercentage: alcoholPercentage,
        type: type
    });

    console.log('ingredientToSave: ', ingredientToSave);
    ingredientToSave.save()
    .then((theIngredient) => {
        console.log('theIngredient @ ingredient.create: ', theIngredient);
        res.send({status: 'success', theIngredient: theIngredient});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};

exports.getAll = function(req, res) {
    console.log('req.body @ getAll @ ingredient.controller: ', req.body);

    Ingredient.find().sort({ name: 1 })
    .then((theIngredients) => {
       // console.log('Found the ingredients: ', theIngredients)
        res.send({theIngredients});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};
