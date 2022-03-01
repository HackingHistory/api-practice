import {corsProxy} from "./cors.js"
import {buildCard} from "./cardMaker.js"
const guardianKey="3d0d0451-b151-42be-9a70-f71970e434f0"

// we use the GUardian API, documented here:
// https://open-platform.theguardian.com/documentation/search
// possible filters are from-date, to-date, section (news, politics, sports)

/**
 * takes a single article returned from the Guardian API and creates a standard
 * card object from it
 * @param {} article
 * @returns {} 
 */
function cardStructureFromGuardianData(article){
  
  const {fields} = article
  return {title: fields.headline,
          figure: fields.thumbnail ? `<figure><img src="${fields.thumbnail}" /></figure>` : "",
          author: fields.byline,
          text: fields.body}
  
}

/**
 * query the guardian API and build a set of cards. do not add
 * @param {} query
 * @param {} filter
 * @returns {} 
 */
async function guardianQuery (query, parameters) {
  let returnValue,returnHeader
  const container = document.querySelector("#cardcontainer")
  const baseUrl="https://content.guardianapis.com/search?"
  let extraParamString = ""
  if (parameters) {
    for (const [k, v] of Object.entries(parameters)) {
      extraParamString += `&${k}=${v}`
    }
  }
  const fullUrl=`${corsProxy}${baseUrl}api-key=${guardianKey}&q=${query}&show-fields=all${extraParamString}`
  let retrievedData = await fetch (fullUrl)
      .then(response => response.json())
      .then(json => json.response)
  let results = retrievedData.results
  console.log(results);
  let fixedResults = results.map(r => cardStructureFromGuardianData(r))
  let cards = fixedResults.map(buildCard)
  cards.forEach (c => container.appendChild(c))
  console.log(cards);
  return results  
}


export {cardStructureFromGuardianData, guardianQuery }

