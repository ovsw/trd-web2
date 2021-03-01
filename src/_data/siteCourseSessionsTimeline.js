const groq = require('groq')
const client = require('../utils/sanityClient')
const BlocksToHtml  = require('@sanity/block-content-to-html')
const serializers = require('../utils/serializers')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token
const urlFor = require('../utils/imageUrl')


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
  *[_type == "courseSession"]{
    ...,
    content {
    	...,
      course->{
				...
  		}
		}
  } | order(content.startDate asc)
  `).catch(err => console.error(err))

  // processedResponse = processResponse(sanityResponse)

  // const reducedDocs = overlayDrafts(hasToken, sanityResponse)

  // iterate through all pages
  const formattedResponse = sanityResponse.map((item) => {
    // grab the body field of the page
    const {content} = item
    const {course, duration, level, startDate, endDate, schedule, teacher} = content

    const sessionTitle = `${course.content.title} - ${level}`

    // dates
    const sessionStartDateArray = startDate.split('-')
    const sessionStartYear= sessionStartDateArray[0]
    const sessionStartMonth= sessionStartDateArray[1]
    const sessionStartDay=sessionStartDateArray[2]

    const sessionEndDateArray = endDate.split('-')
    const sessionEndYear= sessionEndDateArray[0]
    const sessionEndMonth= sessionEndDateArray[1]
    const sessionEndDay=sessionEndDateArray[2]
    
    // image
    const imageUrl = urlFor(course.content.mainImage)
      .width(400)
      .auto('format')
      .url()

    // description
    const htmlDescription = BlocksToHtml({
      blocks: schedule,
      serializers: serializers
    })

    const timelineFormattedSession = {
      "media": {
        "url": imageUrl
      },
      "start_date": {
        "month": sessionStartMonth,
        "day": sessionStartDay,
        "year": sessionStartYear
      },
      "end_date": {
        "month": sessionEndMonth,
        "day": sessionEndDay,
        "year": sessionEndYear
      },
      "text": {
        "headline": sessionTitle,
        "text": htmlDescription
      },
      "group": course.content.title
    }
  
    return timelineFormattedSession
  })

  const timelineObj = {
    "title": {    
      "text": {
        "headline": "Sesiuni Cursuri Tridia 2021",
        "text": "<p>Program actualizat la 14 Februarie 2021. Poate suferi modificari ulterioare.</p>"
      }
    },
    "events": formattedResponse
}

  return timelineObj
}
