const axios = require('axios').default;
import { server } from '../index';

afterAll(() => {
  return  server && server.close();
});

describe('Get user data from endpoint /api/user', () => {
  const baseUrl = 'http://localhost:3000/api/user?';

  it('filters by user id', done => {
    const url = baseUrl + 'credentialName=Britney&id=a3b8d425-2b60-4ad7-becc-bedf2ef860bd';
    axios.get(url).then(response => {
      expect(response.data.name).toBe('Barnett');
      done();

    });
  });

  it('filters by user name', done => {
    const url = baseUrl + 'credentialName=Britney&name=Manning';
    axios.get(url).then(response => {
      expect(response.data.name).toBe('Manning');
      done();

    });
  });

});

it('gets policies linked to a user name', done => {
  const url = 'http://localhost:3000/api/policiesByName?credentialName=Britney&name=Manning';
  axios.get(url).then(response => {
    expect(response.data[0].id).toBe('64cceef9-3a01-49ae-a23b-3761b604800b');
    done();

  });
});

it('gets user linked to policy id', done => {
  const url = 'http://localhost:3000/api/userByPolicy?credentialName=Britney&policyId=64cceef9-3a01-49ae-a23b-3761b604800b';
  axios.get(url).then(response => {
    expect(response.data.name).toBe('Manning');
    done();

  });
});