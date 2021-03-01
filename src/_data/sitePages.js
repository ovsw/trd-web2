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
  *[_type == "page"]{
    ...,
    content {
      ...,
      'seoTitle': coalesce(seo.title, ''),
			'seoDescription': coalesce(seo.description, ''),
      'sections': sections.sections[] {
        ...,
        // if one of the sections is a staff section...
        _type == "staffSection" => {
          ...,
          // ... follow the references to the staff members
          staffList[]->{
            ...
          }
        },
        _type == "testimonialsSection" => {
          ...,
          // ... follow the references to the staff members
          testimonials[]->{
            ...
          }
        },
        _type == "courseSection" => {
          ...,
          // ... follow the references to the staff members
          course->{
            ...,
            content {
              ...,
              modules->{
                ...
              }
            }
          }
        },
        // if one of the section is a reusable one...
        _type == "reusedSection" => {
          ...,
          // ...follow the reference to get it's own sections
          reusableSection->{
            ...,
            sections[]{
        			...,
              // if one of the children of the reusable section is a staff section...
              _type == "staffSection" => {
                ...,
                // ... follow the references to the staff members
                staffList[]->{
                  ...
                }
              }
      			}
          }
        }
      }
    }
  }
  `).catch(err => console.error(err))

  // processedResponse = processResponse(sanityResponse)

  const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  return reducedDocs
}
