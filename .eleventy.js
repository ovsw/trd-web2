// following are required for portable text filter:
const BlocksToMarkdown = require('@sanity/block-content-to-markdown')
const client = require('./src/utils/sanityClient.js')
const serializers = require('./src/utils/serializers')
const urlFor = require('./src/utils/imageUrl')

// FILTERS
const dateFilter = require('./src/filters/date-filter.js');
const dateFilterMeals = require('./src/filters/date-filter-meals.js');
const dateFilterYear = require('./src/filters/date-filter-year.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const encodeUri = require('./src/filters/encode-uri.js');

module.exports = config => {
  // Set directories to pass through to the dist folder
  config.addPassthroughCopy('./src/images/');
  config.addPassthroughCopy("./src/js/");
  config.addPassthroughCopy("./src/fonts/");
  

  // ////////////////////////////////////
  // process markdown from Sanity
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require("markdown-it-anchor");
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  config.setLibrary("md", markdownIt(options)
    .use(markdownItAnchor, opts)
  );

  config.addFilter("markdownify", function(value) {
    const md = new markdownIt(options)
    return md.render(value)
  })
  // end markdown 
  // ////////////////////////////////////

  // ////////////////////////////////////
  // filter to process portable text (block content) - needed for arrays of different sections from the back-end
  config.addFilter("blocksToMarkdown", function(sanityBlockContent) {
    return BlocksToMarkdown(sanityBlockContent, { serializers, ...client.config() })
  })
  // end portable text filter
  // ////////////////////////////////////

  // add date filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('dateFilterMeals', dateFilterMeals);
  config.addFilter('dateFilterYear', dateFilterYear);
  config.addFilter('w3DateFilter', w3DateFilter);

  // ////////////////////////////////////
  // sanity images shortcodes

  config.addShortcode('imageUrlFor', (image, width = "400") => {
    return urlFor(image)
        .width(width)
        .auto('format')
  })
  config.addShortcode('croppedUrlFor', (image, width, height) => {
    return urlFor(image)
        .width(width)
        .height(height)
        .auto('format')
  })

  config.addShortcode('responsiveImage', (image, srcs="320,640,900", sizes="100vw", classList="", alt="") => {
    const sizeArray = srcs.split(',');
    const firstSize = sizeArray[0];
    const lastSize = sizeArray[sizeArray.length - 1];
    const srcSetContent = sizeArray.map((size) => {
        const url = urlFor(image)
            .width(size)
            .auto('format')
            .url()

        return `${url} ${size}w`
    }).join(',')

    return (
        `<img 
            src="${urlFor(image).width(firstSize)}"
            ${classList ? "class='" + classList + "'" : ""}
            srcset="${srcSetContent}"
            sizes="${sizes}"
            width="${lastSize.trim()}" 
            alt="${alt}" >`
    )
  })
  // ////////////////////////////////////

  // Nunjucks Filter for converting sring to kebab-case
  config.addNunjucksFilter("makeId", function(value) {
     return value.replace(/\s+/g, '-').toLowerCase()
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};