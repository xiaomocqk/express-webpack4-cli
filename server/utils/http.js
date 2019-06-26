const axios = require('axios');

function http(api, config, method='get'){
  return new Promise(resolve => {
    axios[method](api, config)
      .then(res => resolve(res.data))
      .catch(err => console.warn(err));
  });
}

http.get = http;
http.post = (api, config) => http(api, config, 'post');
http.delete = (api, config) => http(api, config, 'delete');

module.exports = http;
