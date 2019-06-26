const { prefix } = require('../../config/base.config');

module.exports = router => {
  router.get('/abc/', (req, res) => {
    res.render(`${prefix}abc/index`);
  });
};