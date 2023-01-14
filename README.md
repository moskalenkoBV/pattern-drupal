# Pattern Lab Twig Standard Edition for Drupal

[![Build Status](https://travis-ci.org/pattern-lab/edition-php-drupal-standard.svg?branch=master)](https://travis-ci.org/pattern-lab/edition-php-drupal-standard)

## Manual installation

Test

To get the project up and running, and view components in the browser, complete the following steps:

- Download and install [Node.js](https://nodejs.org/) (last stable version);
- Download and install [Yarn Package Manager](https://yarnpkg.com/) (last stable version);
- Download and install [Composer Dependency Manager](https://getcomposer.org) (last stable version);
- Install Gulp globally: `npm install gulp -g`;
- Clone the project to your local machine: `git clone git@code.adyax.com:<your project>/<your project>.git`;
- Go to the Front-end build folder: `cd <path to the front end folder>`;
- Install composer dependencies: `composer install` (to answer all the questions “NO”);
- Install Node.js dependencies: `yarn`;
- Start the development environment: `yarn start`;
- The Server will be started and opened in your default browser: http://localhost:8080.

## Branch name example

TO DO

## Yarn Commands

The Front-end build of the project supports the following yarn script:

| Description                           | Command            |
| ------------------------------------- | ------------------ |
| Start the project in development mode | `yarn start`       |
| Create a static build of the project  | `yarn build`       |
| Generate static assets                | `yarn buildAssets` |
| Check JS code standards               | `yarn lint:es`     |
| Check SCSS code standards             | `yarn lint:sass`   |
| Check JS and SCSS code standards      | `yarn lint`        |

## SCSS Style Guide

The SCSS rules are described in the next file in the root: `.sass-lint.yml`
You can find more information about rules in the documentation of the SASS-Lint:
https://github.com/sasstools/sass-lint/tree/master/docs/rules

## JavaScript Style Guide

We use Airbnb javascript’s rules with few additions that are described in the next file in the root: `.eslintrc`
You can find more information about rules in the documentation of the Airbnb:
https://github.com/airbnb/javascript

## Include Node.js packages to the Patternlab Environment

If you want to add node.js package to the Patternlab environment complete the following steps:

- Add a package to the project’s dependencies: `yarn add <package-name>`;
- Add a path to the script to the object with project’s paths in `paths.json` file that you can find in the root folder of the front-end build (`scripts.nodeModules.src`);
- Add path of the file to the list of the scripts that are used in the project `src/source/_data/assets.json`.

## Global Patternlab’s mock variables

You can define and use custom variables in your patternlab’s templates globbaly in the next file `src/source/_data/patternlab.json`. You can override these variables in the context of your component.

## Available Drupal Features in the Patternlab Environment

| Name           | How to use                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attributes     | https://www.drupal.org/docs/8/theming-drupal-8/using-attributes-in-templates https://www.drupal.org/docs/8/theming-drupal-8/using-attributes-in-templates |
| Link           | https://www.drupal.org/docs/8/theming/twig/functions-in-twig-templates                                                                                    |
| Path           | https://www.drupal.org/docs/8/theming/twig/functions-in-twig-templates                                                                                    |
| Url            | https://www.drupal.org/docs/8/theming/twig/functions-in-twig-templates                                                                                    |
| Trans          | https://www.drupal.org/docs/8/api/translation-api/overview                                                                                                |
| DrupalSettings | https://code.adyax.com/lsakun/dj-beta                                                                                                                     |

## Type of styles

Task manager generates separate files for each type of styles. This functionality is managed by the following file’s extensions:

| Type                 | Extension                                   |
| -------------------- | ------------------------------------------- |
| FO                   | `*.component.scss`                          |
| BO Global            | `*.admin.scss`                              |
| BO Ckeditor          | `*.ckeditor.scss`                           |
| FO Print             | `*.print.scsss`                             |
| Patternlab overrides | `src/assets/scss/patternlab-overrides.scss` |

## Type of scripts

Task manager generates separate files for each type of scripts. This functionality is managed by the following file’s extensions:

| Type      | Extension       |
| --------- | --------------- |
| Behaviors | `*.behavior.js` |
| Modules   | `*.module.js`   |

## Useful links

- https://twig.symfony.com
- https://www.json.org
- https://code.adyax.com/lsakun/dj-beta
- https://github.com/aleksip/plugin-data-transform
- https://patternlab.io/docs/index.html
- http://airbnb.io/javascript/
- https://github.com/sasstools/sass-lint/tree/master/docs/rules
