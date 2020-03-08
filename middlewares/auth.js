const requests = require('../requests');

/** The API user is identified according to the name put in the param 'credentialName' */
function isCredentialNameInDB(req, res, next) {

  requests.getOneUser({name: req.query.credentialName}).then(result => {
    if (!result) {
      const msg = `User doesn't exist`;
      return res.status(401).json({msg});
    } else {
      req.user = result;
      console.log('req.user', req.user);
      next();
    }
  }).catch(function (error) {
    console.log('auth catch 1');
    res.status(500).json(error);
  })
}

function isUserOrAdmin(req, res, next) {
  const allowedRoles = ['admin', 'user'];
  if (allowedRoles.indexOf(req.user.role) > -1) {
    console.log('role ' + req.user.role);
    return next();
  }
  let msg = 'Only roles user or admin are allowed';
  console.log(msg);
  return res.status(401).json({ msg });
}

function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    console.log('is admin');
    return next();
  }
  return res.status(401).json({ msg: 'Only admin role is allowed' });
}

module.exports = {
  isCredentialNameInDB,
  isUserOrAdmin,
  isAdmin
};