const router = require('../../utils').router()
const Projects = require('./projects.controller')
const valid = require('./project.validator')

router.get('/healthCheck', 'Ok')

router.get('/', (req, res) => {
  const queryString = req.queryString
  const user = req.local.user
  return Projects.getAll(queryString, user)
})

router.post('/', valid.createProject, (req, res) => {
  const body = req.body
  const user = req.local.user
  return Projects.create(user, body)
})

router.put('/:projectId', valid.updateProject, (req, res) => {
  const { projectId } = req.params
  const body = req.body
  return Projects.update(projectId, body)
})

router.delete('/:projectId', valid.removeProject, (req, res) => {
  const { projectId } = req.params
  return Projects.remove(projectId)
})

module.exports = router.expressRouter
