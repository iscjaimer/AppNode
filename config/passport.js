// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var mysql = require('tedious');
var bcrypt = require('bcrypt');
var dbconfig = require('./config');
var Connection = require('tedious').Connection,
    Request = require('tedious').Request
var config = dbconfig.params

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });


module.exports = function (passport) {

    // expose this function to our app using module.exports

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.UserID);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        var values = {
            id: [TYPES.Int, id]
        };
        db.query('select * from users', values, (err, user) => {
            if (err) {
                console.error(err);
            }
            done(err, user);
        });
        // --> [{ id: '8F41C105-1D24-E511-80C8-000C2927F443', email: 'bart@hotmail.com' }]
    });


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            // allows us to pass back the entire request to the callback
            passReqToCallback: true
        },
            // callback with email and password from our form

            function (req, username, password, done) {

                var usuario = {
                    name: [TYPES.NVarChar, username]
                }

                db.query('select * from access where Usrname = @name', usuario, (err, user) => {
                    if (err) {
                        console.log(err)
                    }
                    if (user.length <= 0) {
                        return done(null, false, req.flash('loginMessage', 'El usuario no existe.'));
                    }
                    if (user[0].Pass != password){
                        return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));   
                    } 
                    return done(null, user[0]);
                });

            })
    );
};
