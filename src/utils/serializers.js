const imageUrl = require('./imageUrl')
const getYouTubeID = require('get-youtube-id');

// Learn more on https://www.sanity.io/guides/introduction-to-portable-text
module.exports = {
  types: {
    authorReference: ({node}) => `[${node.name}](/authors/${node.slug.current})`,
    code: ({node}) =>
      '```' + node.language + '\n' + node.code + '\n```',
    iframeEmbed: ({node}) => node.code,
    mainImage: ({node}) => {
      if (node.caption) {
        return `<figure>
          <img src="${imageUrl(node).width(800).url()}" alt="${node.alt}">
          <figcaption>${node.caption}</figcaption>
        </figure>`
      }else{
        return `<img src="${imageUrl(node).width(800).url()}" alt="${node.alt}"/>`
      }
      
    },
    youtube: ({node}) => {
      const {url} = node
      const id = getYouTubeID(url)
      return `<div class="youtube-video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/${id}"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`
    },
  }
}
