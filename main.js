import {guardianQuery} from "./modules/guardian-api.js"
import {nytQuery} from "./modules/nyt-api.js"
import {wikiQuery} from "./modules/wiki-api.js"
import {marked} from "https://cdn.jsdelivr.net/npm/marked@4.0.12/lib/marked.esm.js"

// guardianQuery(`(COVID AND vaccine) AND NOT Hydroxychloropquine`, {"from-date": "1980-01-01"})
nytQuery(`(COVID AND vaccine) AND NOT (Hydroxychloroquine)`, {"begin_date": "20210701", "end_date": "20211231"})
// wikiQuery(`+covid +vaccine -"united states"`,{"srlimit": 30})

marked.setOptions ({gfm:true})
fetch ("./essay.md").then(r => r.text()).then(md => document.querySelector("#essay").innerHTML = marked.parse(md))
console.log(marked.parse("## hello\n*there*"))
