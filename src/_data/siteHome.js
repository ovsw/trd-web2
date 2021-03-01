const groq = require('groq')
const client = require('../utils/sanityClient')
module.exports =  async function() {
  const sanityResponse = await client.fetch(groq`
  *[_id == "siteHome"]{
    ...,
    content {
			...,
    	'seoTitle': coalesce(seo.title, ''),
			'seoDescription': coalesce(seo.description, ''),
			'sections': sections.sections[]{
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
  }[0]
  `).catch(err => console.error(err))

  return sanityResponse
}