module.exports = function (app, passport) {

  app.get('/inicio', isLoggedIn, function (req, res, next) {
    res.render('main/dashboard', { title: 'Login' });
  });

  app.post('/auth', passport.authenticate('local-login', {
    successRedirect: '/inicio', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }),
    function (req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/login');
    })

  // route middleware to make sure
  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    console.log(req.isAuthenticated())
    //console.log(req)
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    //res.redirect('/lo');
    //res.send("<div style='widht:100%; font-size:3em; text-aling:center; padding:40px;margin-left:100px;'><a href='.\'>Tu usuario no es valido, por favor ingresa Aqui...</a></div>")
    res.redirect('/login');
  }
}