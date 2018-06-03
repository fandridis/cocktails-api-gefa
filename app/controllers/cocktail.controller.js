const {Cocktail} = require('../models/cocktail.model');
const utilities = require('../utilities/utilities');

exports.create = async function(req, res) {
    console.log('req.body @ create @ cocktail.controller: ', req.body);
   // console.log('req.user @ create @ tournament.controller: ', req.user);

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

exports.findByUserIsParticipant = function(req, res) {
    console.log('req.body @ findByUserIsParticipant @ tournament.controller: ', req.body);
    console.log('req.user @ findByUserIsParticipant @ tournament.controller: ', req.user);
    
    Tournament.find({
        participants: req.user._id
    })
    .then((theTournaments) => {
        console.log('Found the tournaments: ', theTournaments)
        res.send({theTournaments});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};

exports.join = async function(req, res) {
    console.log('req.body @ join @ tournament.controller: ', req.body);
    console.log('req.user @ join @ tournament.controller: ', req.user);

    if(!req.body.code || !req.user._id) {
        return res.status(400).send({text: "Code cannot be empty or user does not exist"});
    }
    
    Tournament.findByCodeAndAddParticipant(req.body.code, req.user._id)
    .then((theTournament) => {
        console.log('Found and updated the tournament: ', theTournament)
        // Check if tournament is full
        if (theTournament.participants.length == theTournament.numberOfPlayers) {
            // Tournament is full - initializeGames
            initializeTeams(theTournament.participants, theTournament.game, theTournament._id, theTournament.currentRound);
        }
        res.status(200).send({status: "success", theTournament: theTournament});
    })
    .catch((err) => {
        res.status(400).send(err);
    })
};



function initializeTeams(participants, game, tournamentId, round) {
    console.log('*** Initializing games ***');

    // Get all participants by an array of ids
    User.find( 
        { _id : { $in : participants } 
    })
    .then(theUsers => {
        console.log('Users found: ', theUsers);
        // Generate random, yet fair teams from the participants
        let teams = utilities.generateFairTeams(theUsers, game);
        console.log('-=-=-=-=-=-=-=-=-=-=-=');
        console.log('Fair teams: ', teams);
        console.log('-=-=-=-=-=-=-=-=-=-=-=');

        // Generate random matches (team vs team)
        let { matches, nextRoundTeams } = utilities.generateMatches(teams, tournamentId, round);
        console.log('-=-=-=-=-=-=-=-=-=-=-=');
        console.log('Matches: ', matches);
        console.log('nextRoundTeams: ', nextRoundTeams);
        console.log('-=-=-=-=-=-=-=-=-=-=-=');

        // Keep the lucky team that passes to the next round in the tournament object
        // This change won't make it to the frontend as I return a previous image of the tournament,
        // but it's ok as the information is not needed until all the new games finish
        if (nextRoundTeams.length > 0) {
            Tournament.updateLuckyTeam(tournamentId, nextRoundTeams[0])
            .then(theTournament => {
                console.log('Lucky team added to the tournament');
            })
        }

        // Create a tournamentGame in DB for each match
        let gamesCreatePromises = [];

        matches.forEach(match => {
            let tournamentGame = new TournamentGame(match);
            gamesCreatePromises.push(tournamentGame.save());
        })

        console.log('gamesCreatePromises: ', gamesCreatePromises);
        Promise.all(gamesCreatePromises)
        .then((results) => {
            console.log('Result from create games: ', results);
            // res.status(200).json({ "thePackage": thePackage }).end();
        });  
    })
}