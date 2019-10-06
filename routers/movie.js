var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },

    //delete by id
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err,movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },

    //Remove an actor from the list of actors in a movie
    removeActor: function(req,res){
        Movie.findOne({_id: req.params.movieid},function(err,movie){
            if (err) return res.status(400).json(err);
            Actor.findOne({_id: req.params.actorid},function(err,actor){
                if(err) {return res.status(400).json(err)}
                if(actor){
                    for(var i =0;i<movie.actors.length;i++){
                        if(req.params.actorid == movie.actors[i]._id){
                            movie.actors.splice(i,1);
                        }
                    }
                    movie.save(function(err){
                        if (err) {return res.status(500).json(err)}
                        res.json(movie);
                    })
                }
            })
        })
    },

    //Add an existing actor to the list of actors in a movie
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    },

    //get between years
    getBetweenYears: function(req,res){
        Movie.find({})
        .where('year').gte(req.params.year2).lte(req.params.year1)
        .exec(function (err, movie){
            if (err) return res.json(err);
            if (!movie) return res.json();
            res.json(movie);
        });
    },


    //delete aYear
    deleteAYear: function(req,res){
        year = req.params.year;
        
        Movie.deleteMany({"year":{$lt:year}}, function (err) {
            res.json(err);
        });
    },

    //add actor for angular
    addActorAng: function (req, res) {
        Movie.findOne({ _id: req.params.movieid }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.params.actorid }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        });
    }
};