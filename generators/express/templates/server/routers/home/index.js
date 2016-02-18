var router = require('express').Router()

router.use((req, res, next) => {
  <% if (isWebhost) { %>
  res.render('index', {
    layout: 'master'
  })
  <% } else { %>
  res.end('Hello world')
  <% } %>

})

module.exports = router
