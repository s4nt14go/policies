const axios = require('axios').default;
const usersUrl = 'http://www.mocky.io/v2/5808862710000087232b75ac';
const policiesUrl = 'http://www.mocky.io/v2/580891a4100000e8242b75c5';

/** Get first user by id and/or name
 * @param {String} [name] - user.id
 * @param {String} [policyId] - policy.id
 * @return {Promise} Array of policies */
function getOneUser({ name, id }) { return new Promise((resolve, reject) =>

  axios.get(usersUrl).then(function (response) {
    const usersFound = response.data.clients.filter(e => {
      if ((id == undefined) && (name == undefined)) {
        return false;
      }
      if ((id != undefined) && (id !== e.id)) {
        return false;
      }
      return !((name != undefined) && (name !== e.name));

    });
    console.log(usersFound.length + ' users found for', {name, id});
    resolve(usersFound[0]);
  }).catch(function (error) {
    console.log('requests catch 1');
    reject(error);
  })
)}

/** Get policies by user id and/or policy id
 * @param {String} [userId] - user.id
 * @param {String} [policyId] - policy.id
 * @return {Promise} Array of policies */
function getPolicies({ userId, policyId }) { return new Promise((resolve, reject) =>

  axios.get(policiesUrl).then(function (response) {
    const policies = response.data.policies.filter(e => {
      if ((userId == undefined) && (policyId == undefined)) {
        return false;
      }
      if ((userId != undefined) && (userId !== e.clientId)) {
        return false;
      }
      return !((policyId != undefined) && (policyId !== e.id));

    });
    console.log(policies.length + ' policies found');
    resolve(policies);
  }).catch(function (error) {
    console.log(error);
    reject(error);
  })
)}

module.exports = {
  getOneUser,
  getPolicies
};