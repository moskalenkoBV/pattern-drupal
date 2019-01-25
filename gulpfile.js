const config = require('./app.config.json')

const plugins = {
  gulp: require('gulp'),
  browserSync: require('browser-sync'),
  shell: require('gulp-shell')
}

const tasks = {
  rebuildPatternLab: () => (
    plugins.gulp.src('./', { read: false })
    .pipe(plugins.shell([
      'php core/console --generate'
    ]))
    .pipe(plugins.browserSync.reload({ stream: true }))
  ),
  copyStyleGuide: () => (
    plugins.gulp.src(config.patternlab.styleguide.files)
      .pipe(plugins.gulp.dest(config.patternlab.styleguide.dest))
  ),
  browserSync: () => (
    plugins.browserSync({
      server: {
        baseDir: config.root,
      },
      ghostMode: true
    })
  )
}

const watch = () => {
  tasks.browserSync()
  plugins.gulp.watch(config.patternlab.files, tasks.rebuildPatternLab)
}

plugins.gulp.task('dev', plugins.gulp.series(tasks.rebuildPatternLab, tasks.copyStyleGuide, watch))