/* Dev Plugins */
const gulp = require('gulp')
const gulpif = require('gulp-if')
const clean = require('gulp-clean')
const browserSync = require('browser-sync')
const shell = require('gulp-shell')
const sass = require('gulp-sass')
const postCSS = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const sassGlob = require('gulp-sass-glob')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const svgSprite = require('gulp-svg-sprite')
const newer = require('gulp-newer')
const imageMin = require('gulp-imagemin')
const eslint = require('gulp-eslint')
const sasslint = require('gulp-sass-lint')

/* App Paths (Relative) */
// TODO: Generate Absolute Paths by Path plugin (Can be JS file with module.exports instead of JSON)
const paths = require('./paths.json')

/* Custom Gulp Utils */
const customUtils = require('./gulpCustomUtils')

/* Gulp Tasks */
const tasks = {
  rebuildPatternLab: () => (
    gulp
      .src('./', { read: false })
      .pipe(shell(['php core/console --generate']))
      .pipe(browserSync.reload({ stream: true }))
  ),
  copyStyleGuide: () => (
    gulp
      .src(paths.styleguide.src)
      .pipe(gulp.dest(paths.styleguide.dest))
  ),
  browserSync: () => (
    browserSync({
      server: {
        baseDir: paths.root,
      },
      ghostMode: true,
    })
  ),
  compileScss: (inputParams) => {
    const params = {
      src: './src/assets/scss/*.scss',
      dest: './public/assets/css/',
      inputParams,
    }

    return (
      gulp
        .src(params.src)
        .pipe(sourcemaps.init())
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(postCSS([
          autoprefixer({
            browsers: [
              '>2%',
              'last 2 versions',
              'not ie < 9',
            ],
            flexbox: 'no-2009',
          }),
        ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(params.dest))
        .pipe(browserSync.reload({ stream: true }))
    )
  },
  babelJS: (inputParams) => {
    const params = {
      src: './src/source/**/*.js',
      dest: './public/assets/js/',
      isMerge: false,
      filename: 'scripts.js',
      inputParams,
    }

    return (
      gulp
        .src(params.src)
        .pipe(newer(params.dest[0]))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(sourcemaps.init())
        .pipe(babel({
          presets: ['@babel/env'],
        }))
        .pipe(gulpif(params.isMerge, concat(params.filename)))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(params.dest))
        .pipe(browserSync.reload({ stream: true }))
    )
  },
  buildSVGSprites: () => (
    gulp
      .src(paths.sprites.svg.src)
      .pipe(newer(paths.sprites.svg.dest[0]))
      .pipe(svgSprite({
        mode: {
          symbol: true,
        },
      }))
      .pipe(gulp.dest(paths.sprites.svg.dest))
      .pipe(browserSync.reload({ stream: true }))
  ),
  copyFiles: (params) => {
    if (!params.src || !params.dest) return false

    return (
      gulp
        .src(params.src)
        .pipe(gulpif(params.newer, newer(params.dest[0])))
        .pipe(gulp.dest(params.dest))
        .pipe(browserSync.reload({ stream: true }))
    )
  },
  minImages: () => (
    gulp
      .src(paths.images.src)
      .pipe(newer(paths.images.dest[0]))
      .pipe(imageMin())
      .pipe(gulp.dest(paths.images.dest))
  ),
  clean: src => (
    gulp
      .src(src)
      .pipe(clean({ read: false }))
  ),
  checkEslint: () => (
    gulp
      .src([
        ...paths.scripts.component.src,
        ...paths.scripts.global.src,
      ])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  ),
  checkSasslint: (path, isStopAfterError) => (
    gulp
      .src(path)
      .pipe(sasslint())
      .pipe(sasslint.format())
      .pipe(gulpif(isStopAfterError, sasslint.failOnError()))
  ),
}

const watch = () => {
  /* Start Server */
  // TODO: Disable attaching of the browserSync to Iframe
  tasks.browserSync()

  /* Compile SCSS */
  // Divided into parts for reducing time of the compilation proccess in Development Mode

  // App, watch changes in app.scss and *.component.scss files
  customUtils.watchArrayOfFiles(
    [
      ...paths.styles.components.component.src,
      ...paths.styles.global.app.src,
    ],
    gulp,
    tasks.compileScss.bind(null, {
      src: paths.styles.global.app.src,
      dest: paths.styles.global.all.dest,
    }),
  )

  // Ckeditor, watch changes in ckeditor.scss and *.ckeditor.scss files
  customUtils.watchArrayOfFiles(
    [
      ...paths.styles.components.ckeditor.src,
      ...paths.styles.global.ckeditor.src,
    ],
    gulp,
    tasks.compileScss.bind(null, {
      src: paths.styles.global.ckeditor.src,
      dest: paths.styles.global.all.dest,
    }),
  )

  // Admin, watch changes in admin.scss and *.admin.scss files
  customUtils.watchArrayOfFiles(
    [
      ...paths.styles.components.admin.src,
      ...paths.styles.global.admin.src,
    ],
    gulp,
    tasks.compileScss.bind(null, {
      src: paths.styles.global.admin.src,
      dest: paths.styles.global.all.dest,
    }),
  )

  // Rebuild All SCSS if something happens with SCSS utils, general styles of component ..., etc.
  customUtils.watchArrayOfFiles(
    [
      ...paths.styles.global.other.src,
      ...paths.styles.component.style.src,
    ],
    gulp,
    tasks.compileScss.bind(null, {
      src: paths.styles.global.all.src,
      dest: paths.styles.global.all.dest,
    }),
  )

  /* Babel JS */
  // Behaviors
  gulp.watch(
    paths.scripts.behaviors.src,
    tasks.babelJS.bind(null, customUtils.babelJSParams.behaviors),
  )

  // Module Scripts
  gulp.watch(
    paths.scripts.modules.src,
    tasks.babelJS.bind(null, customUtils.babelJSParams.modules),
  )

  /* Global Scripts */
  gulp.watch(
    paths.scripts.global.src,
    tasks.babelJS.bind(null, customUtils.babelJSParams.global),
  )

  /* Rebuild App */
  customUtils.watchArrayOfFiles(
    [
      ...paths.configs.src,
      ...paths.templates.src,
    ],
    gulp,
    tasks.rebuildPatternLab,
  )
}

/* Series of the Gulp Tasks */
const buildPatternLab = gulp.series(
  tasks.rebuildPatternLab,
  tasks.copyStyleGuide,
)

const buildAssets = gulp.series(
  gulp.parallel(
    tasks.minImages,
    tasks.buildSVGSprites,
    tasks.babelJS.bind(null, customUtils.babelJSParams.behaviors),
    tasks.babelJS.bind(null, customUtils.babelJSParams.modules),
    tasks.babelJS.bind(null, customUtils.babelJSParams.global),
    tasks.copyFiles.bind(null, {
      src: paths.scripts.nodeModules.src,
      dest: paths.scripts.nodeModules.dest,
    }),
    tasks.copyFiles.bind(null, {
      src: paths.fonts.src,
      dest: paths.fonts.dest,
      newer: true,
    }),
  ),
  tasks.compileScss.bind(null),
)

/* Tasks For Yarn */
gulp.task('dev', gulp.series(
  tasks.clean.bind(null, paths.root),
  buildPatternLab,
  buildAssets,
  watch,
))

gulp.task('build', gulp.series(
  tasks.clean.bind(null, paths.root),
  buildPatternLab,
  buildAssets,
))

gulp.task('eslint', gulp.series(
  tasks.checkEslint,
))

gulp.task('sasslint', gulp.series(
  tasks.checkSasslint.bind(null, [
    ...paths.styles.global.all.src,
    ...paths.styles.global.other.src,
    ...paths.styles.components.component.src,
    ...paths.styles.components.admin.src,
    ...paths.styles.components.ckeditor.src,
    ...paths.styles.components.style.src,
  ]),
))

gulp.task('lint', gulp.series(
  tasks.checkEslint,
  tasks.checkSasslint, [
    ...paths.styles.global.all.src,
    ...paths.styles.global.other.src,
    ...paths.styles.components.component.src,
    ...paths.styles.components.admin.src,
    ...paths.styles.components.ckeditor.src,
    ...paths.styles.components.style.src,
  ],
))
