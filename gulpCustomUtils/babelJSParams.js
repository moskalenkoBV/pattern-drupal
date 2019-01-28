const paths = require('../paths.json')

const behaviors = {
  src: paths.scripts.behaviors.src,
  dest: paths.scripts.behaviors.dest,
  isMerge: true,
  filename: 'behaviors.js',
}

const modules = {
  src: paths.scripts.modules.src,
  dest: paths.scripts.modules.dest,
}

const global = {
  src: paths.scripts.global.src,
  dest: paths.scripts.global.dest,
}

module.exports = {
  behaviors,
  modules,
  global,
}
