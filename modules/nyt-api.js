import {corsProxy} from "./cors.js"
import {buildCard} from "./cardMaker.js"
const nytKey="XN2lYcsGj4xgIhCLNGfW7eA6b0VB1eKi"

// we use the Nyt API, documented here:
// https://open-platform.thenyt.com/documentation/search
// possible filters are from-date, to-date, section (news, politics, sports)

/**
 * takes a single article returned fro mthe Nyt API and creates a standard
 * card object from it
 * @param {} article
 * @returns {} 
 */
function cardStructureFromNytData(article){
  const figure = (article.multimedia && article.multimedia.length > 0) ? `<figure><img src="https://static01.nytimes.com/${article.multimedia[0].url}" /></figure>` : ''
  return {title: article.headline.main,
          figure: figure,
          author: article.byline.original,
          text: article.lead_paragraph,
          url: article.web_url}
  
}

/**
 * query the nyt API and build a set of cards. do not add
 * @param {} query
 * @param {} filter
 * @returns {} 
 */
async function nytQuery (query, parameters) {
  let returnValue,returnHeader
  const container = document.querySelector("#cardcontainer")
  const baseUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?"
  let extraParamString = ""
  if (parameters) {
    for (const [k, v] of Object.entries(parameters)) {
      extraParamString += `&${k}=${v}`
    }
  }
  const fullUrl=`${corsProxy}${baseUrl}api-key=${nytKey}&q=${query}&show-fields=all${extraParamString}`
  let retrievedData = await fetch (fullUrl)
      .then(response => response.json())
      .then(json => json.response)
  console.log(retrievedData.docs);
  let results = retrievedData.docs
  let fixedResults = results.map(r => cardStructureFromNytData(r))
  let cards = fixedResults.map(buildCard)
  cards.forEach (c => container.appendChild(c))
  console.log(cards);
  return results  
}


export {cardStructureFromNytData, nytQuery }

