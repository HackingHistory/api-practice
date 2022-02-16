// start with some common demoninators
// we don't actually need "cors" but it hurts very little to import it
// and if this library changes we'll use it again. 
import {corsProxy} from "./cors.js"
import {buildCard} from "./cardMaker.js"

// since we have to call Wikipedia more than once, might as well extract the
// paseURL out into the module scope (rather than declare it twice in fucntions)
const wikiBase="https://en.wikipedia.org/w/api.php?origin=*&format=json&action="
// Wikimedia API docs are a little hard to follow
// 
// possible filters are from-date, to-date, section (news, politics, sports)


/**
 * takes a single article returned fro mthe Nyt API and creates a standard
 * card object from it
 * in the Wikipedia API, unfortunately we need to do a second query to get the
 * interesting data.
 * n fact, you could also do a third, to get the thumbnail picture.  
 * @param {} article
 * @returns {} 
 */
async function cardStructureFromWikiData(article){
  const {title, fields, ...info} = article
  //console.log(article);
  const target=`${wikiBase}parse&pageid=${article.pageid}&prop=text&section=0`
  const pageData=await fetch (target)
        .then(response => response.json())
        .then(json=>json.parse)
  console.log(pageData)
  
  //await getDetails(article)
  // const figure = (article.multimedia && article.multimedia.length > 0) ? `<figure><img src="https://static01.nytimes.com/${article.multimedia[0].url}" /></figure>` : ''
  return {title: pageData.title,
          //figure: figure,
          //author: fields.bylne,
          text: pageData.text["*"]}
  
}

async function getDetails (article) {
  
}

/**
 * query the wikipedia API and build a set of cards.
 * @param {} query
 * @param {} filter
 * @returns {} 
 */
async function wikiQuery (query, parameters) {
  let returnValue,returnHeader
  const container = document.querySelector("#cardcontainer")
  
  let extraParamString = ""
  if (parameters) {
    for (const [k, v] of Object.entries(parameters)) {
      extraParamString += `&${k}=${v}`
    }
  }
  const fullUrl=`${wikiBase}query&list=search&srsearch=${query}&show-fields=all${extraParamString}`
  let retrievedData = await fetch (fullUrl)
      .then(response => response.json())
      .then(json => json)
  let results = retrievedData.query.search
  let fixedResults = await Promise.all(results.map(r => cardStructureFromWikiData(r)))
  let cards = fixedResults.map(buildCard)
  cards.forEach (c => container.appendChild(c))
  return results  
}


export {cardStructureFromWikiData, wikiQuery }

