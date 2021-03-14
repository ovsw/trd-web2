const groq = require('groq')
const client = require('../utils/sanityClient')
const overlayDrafts = require('../utils/overlayDrafts')
const hasToken = !!client.config().token


module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "courseListingPage"]{
    ...,
    content {
    	...,
      courses[]->{
        ...
      }
  	}
  }[0]
  `).catch(err => console.error(err))


  return sanityResponse
}
