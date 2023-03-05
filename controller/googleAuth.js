var GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleAuth = passport.use(new GoogleStrategy({
    clientID: "116350356713-onuobranch649lh2qt9485nmi2iuuhpp.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log(profile.id);
  }
));

