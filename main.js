import {guardianQuery} from "./modules/guardian-api.js"
import {nytQuery} from "./modules/nyt-api.js"
import {wikiQuery} from "./modules/wiki-api.js"

// guardianQuery("Manchester AND riot -Strangeways", {"to-date": "1980-01-01"})
nytQuery("Manchester AND riot AND NOT  -Strangeways", {"to-date": "19800101"})
// wikiQuery("Manchester AND riot -Strangeways", {"to-date": "19800101"})
