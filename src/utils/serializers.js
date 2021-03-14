const imageUrl = require('./imageUrl')

// Learn more on https://www.sanity.io/guides/introduction-to-portable-text
module.exports = {
  types: {
    authorReference: ({node}) => `[${node.name}](/authors/${node.slug.current})`,
    code: ({node}) =>
      '```' + node.language + '\n' + node.code + '\n```',
    mainImage: ({node}) => {

      if (node.caption) {
        return `<figure>
          <img src="${imageUrl(node).width(800).url()}" alt="${node.alt}">
          <figcaption>${node.caption}</figcaption>
        </figure>`
      }else{
        return `<img src="${imageUrl(node).width(800).url()}" alt="${node.alt}"/>`
      }
      
    }
  }
}
