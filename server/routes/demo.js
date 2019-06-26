const { prefix } = require('../../config/base.config');

module.exports = router => {
  router.get('/demo/', (req, res) => {
    res.render(prefix + `demo/index`, {data: 'This is demo/index page'});
  });

  router.get('/demo/about', (req, res) => {
    res.render(prefix + `demo/about`, {data: 'This is demo/about page'});
  });
};