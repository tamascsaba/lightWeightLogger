module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'LightWeight.hu',
        keywords: 'edzésnapló, edzésterv készítés, workout logger, crossfit, bodybuilding',
        description: 'LeightWeight.hu edzésnapló, workout logger, minden ami kell az edzésed optimalizálásához.'
      },
      db: 'mongodb://localhost/leightweight_logger',
      facebook: {
          clientID: "514491191926021",
          clientSecret: "8e55d0e651d6bf5826910a9bc5d21983",
          callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      twitter: {
          clientID: "skKlI2HrYfAQDujZfvouw",
          clientSecret: "RqbTpyZXBhiq5L39IB4Z9G7JvGll23K7zrwypQas9g",
          callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      github: {
          clientID: 'APP_ID',
          clientSecret: 'APP_SECRET',
          callbackURL: 'http://localhost:3000/auth/github/callback'
      },
      google: {
          clientID: "APP_ID",
          clientSecret: "APP_SECRET",
          callbackURL: "http://localhost:3000/auth/google/callback"
      }
    },
    test: {

    },
    production: {

    }
}
