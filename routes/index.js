const midAuth = require('../middlewares/auth');
const requests = require('../requests');

const routes = (app) => {

  // GET example from browser/postman:
  // Case get user data filtered by user id
  // http://localhost:3000/api/user?credentialName=Britney&id=a3b8d425-2b60-4ad7-becc-bedf2ef860bd
  // Case get user data filtered by user name
  // http://localhost:3000/api/user?credentialName=Britney&name=Manning
  app.route('/api/user')
    .get(midAuth.isCredentialNameInDB, midAuth.isUserOrAdmin, (req, res) => {
      console.log('routes/index.js get /api/user');

      requests.getOneUser({name: req.query.name, id: req.query.id}).then( user => {
        console.log('response', user);
        res.status(200).json(user);
      }).catch(error => {
        // handle error
        console.log(error);
        res.status(500).json(error);
      });

    });

  // Case get policies linked to a user name
  // http://localhost:3000/api/policiesByName?credentialName=Britney&name=Manning
  app.route('/api/policiesByName')
    .get(midAuth.isCredentialNameInDB, midAuth.isAdmin, (req, res) => {
      console.log('routes/index.js get /api/policiesByName');

      let abort = false;
      requests.getOneUser({name: req.query.name}).then(user => {
        if (!user) {
          const msg = `name doesn't exist`;
          console.log(msg);
          abort = true;
          return res.status(404).send(msg);
        }
        console.log('It will find policies from user', user);
        return requests.getPolicies({userId: user.id});
      }).then(policies => {
        if (abort) return console.log('aborted');
        console.log(`${policies.length} policies sent`);
        res.status(200).send(policies);
      }).catch(error => {
        // handle error
        console.log(error);
        res.status(500).json(error);
      });

    });

  // Case get user linked to policy id
  // http://localhost:3000/api/userByPolicy?credentialName=Britney&policyId=64cceef9-3a01-49ae-a23b-3761b604800b
  app.route('/api/userByPolicy')
    .get(midAuth.isCredentialNameInDB, midAuth.isAdmin, (req, res) => {
      console.log('routes/index.js get /api/userByPolicy');

      let policyFound = false;
      requests.getPolicies({policyId: req.query.policyId}).then(policies => {
        policyFound = policies[0];
        if (!policyFound) {
          const msg = `invalid policy id ${req.query.policyId}`;
          console.log(msg);
          return res.status(404).json(msg);
        }
        console.log('It will find user of this policy:', policyFound);
        return requests.getOneUser({id: policyFound.clientId});
      }).then(user => {
        if (!policyFound) return console.log('aborted');
        if (!user) {
          const msg = `user inexistent for id ${policyFound.clientId}`;
          console.log(msg);
          return res.status(404).json(msg);
        }
        console.log('user', user);
        res.status(200).json(user);
      }).catch(error => {
        console.log(error);
        res.status(500).json(error);
      });

    });
};

module.exports = routes;