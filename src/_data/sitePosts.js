const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token


// function processResponse(sanityResponse) {

  
//   // iterate through all pages
//   const processedResponse = sanityResponse.map((page) => {
//     // grab the body field of the page
//     const {content} = page
//     const {body} = content
    
//     // create an object containing all the heading blocks by:
//     // 1. iterating through all the blocks in the body field of the page
//     const headings = body.map((block, i) => {
//       // if the block's type is "bigHeading"
//       if (block._type === 'bigHeading') {
//         return block
//       }
//     })

//     return true
//   })

//   return processedResponse
// }


module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_type == "post"]{
    ...,
    content {
    	...,
      "sections": sections.sections[]{
				...
      }
		}
  } | order(content.date desc)
  `).catch(err => console.error(err))

  // processedResponse = processResponse(sanityResponse)

  const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  return reducedDocs
}
