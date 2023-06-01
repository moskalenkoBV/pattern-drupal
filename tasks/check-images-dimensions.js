/* eslint-disable */
const { glob } = require('glob');
const path = require('path');
const imageSize = require('image-size');

const MAX_SIZE = 5000;
const imageFormats = ['png', 'jpeg', 'jpg', 'webp', 'gif'];

async function run() {
    const allImages = await glob(
      `${path.resolve(__dirname, '../public/')}/**/*.{${imageFormats.join(
        ','
      )}}`,
      {
        ignore: `${path.resolve(
          __dirname,
          '../dist/maia3/assets/images/wide'
        )}/**`,
      }
    );

    const bigImages = allImages.reduce((acc, path) => {
      const { height, width } = imageSize(path);

      if (width >= MAX_SIZE || height >= MAX_SIZE) {
        acc.push({ path, width, height });
      }

      return acc;
    }, []);

    if (bigImages.length) {
      console.error(`Some images are more than max size (${MAX_SIZE}px), please move them to "assets/images/wide"`);
      bigImages.forEach(item => {
        console.log(item.path, `w: ${item.width}px`, `h: ${item.height}px`)
      });
      process.exitCode = 1;
    }
  }
run();
