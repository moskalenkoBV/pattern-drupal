/**
 * Resolve issue of the gulp.watch on OS Windows;
 *
 * Can be Replaced by https://github.com/paulmillr/chokidar
 * @param {array} paths Array of paths
 * @param {object} gulp Gulp Module
 * @param {function} task Executed task
 */
const watchArrayOfFiles = (paths, gulp, task) => {
  paths.forEach(item => (
    gulp.watch(item, task)
  ))
}

module.exports = watchArrayOfFiles
