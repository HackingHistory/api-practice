# Assignment 02: Text, Data, and API's

As we discussed in class, the prupose of this assignment is simple. You're intended to try to interact with existing API's, extract data, and display it. 

In class, we tried out several APIs. Your assignment is to develp your own query from one of these API's and use it to populate a set of cards like the onese you built in your first assignment. In this case, though, the product of your efforts will be a somewhat more complex web page, in a style familiar to those of you who have taken HIS393. You will be asked to write a short markdown document as well as a very small amount of javascript; you may also find that the default CSS is not to your liking, and elect to make changes there as well. 

Detailed instructions are below!

## Getting Started
As with the in-class version of this assignment, you will need to get set up:
- clone the repository (this time, however, use the personalized Github Classroom link rather than a personal fork)
- install the NPM dependencies by typing `npm install` in the built-in terminal in VSCode, or by using the Command Palette as we did in class. I recommend doing it the terminal so you can confirm that everything went well.  
- start the local server with `npm run server`, again either in the terminal or by using the command palette. Here again, I personally prefer the terminal because otherwise it is very difficult to manually stop the server in case something doesn't seem to be working properly.  To stop the server in the terminal, simply click in the temrinal area and press `Control-C` repeatedly until the normal terminal prompt appears. 

You will need to **restart the server every time you close and re-open VSCode.** Please remember this, as otherwise it will be very difficult to make progress!

## Step 1: Choose an API (long)

Recall that we presented three APIs, each of which accepts queries and returns a [JSON object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON). For our purposes, a JSON object will be treated as the same as  a ["basic" JavaScript object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics), despite some differences that would matter in other contexts. 

There are many different ways to build an API, but all of these are what's called "[REST API's](https://www.smashingmagazine.com/2018/01/understanding-using-rest-api/). Each API has its own "query syntax" which also returns a different kind of object. The code in this repository therefore has individual functions to build API requests, and also "parsers" that translate the returned data structure into a common format that can be processed into cards. The code for all of this can be fond in the folder called [./modules](./modules). 

### [The New York Times Article Search API](https://developer.nytimes.com/docs/articlesearch-product/1/overview)
This API allows a search of the NYT's complete article database stretching back to the nineteenth century, though not all early articles have full text search available. Though the API has many features, only two parts really matter for us. These are **the query string** and **the additional parameters**. 

**The Query String**

This is your main article search. Though the documents do not say this very explicitly, the Times uses a powerful query language called [ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax), with a number of advanced features which are explored [in this excellent post from an expired web site at RPI](https://data-gov.tw.rpi.edu/wiki/How_to_use_New_York_Times_Article_Search_API). For our purposes, the most important feature is [Boolean search](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_boolean_operators), which allows us to combine words and phrases using `AND`, `OR`, and `NOT`, as well as the special symbols `+` (required) and `-`(forbidden). So for instance, the query `+Guiliani -Trump` will search for articles that mention "Guiliani" but not "Trump" while `(COVID AND vaccine) AND NOT (Hydroxycholorquine)` will look for articles about COVID-19 vaccines that do not make mention of hydroxychloroquine. 

If you use this API, you should experiment with complex searches until you find an appropriate one. 

**NYT Parameters**

You can also put limits on your search by adding additional parameters to the API call. These are described briefly in the [main API documentation page](https://developer.nytimes.com/docs/articlesearch-product/1/overview) and enumerated individually in the 3[technical specification](https://developer.nytimes.com/docs/articlesearch-product/1/routes/articlesearch.json/get). (Please note that I do not discuss the use of facets and "filter queries" here, and that to use those features you will have to modify the nytimes code slightly.)

For our purposes, the most important additional parameters are "begin_date" and "end_date", each of which is a series of 8 digits in the format "YYYYMMDD", so, e.g., 20210911 would be September 11, 2021. In our query function, these additional parameters are passed to the endpoint using a second function parameter. So, for instance, to search for articles about ovid vaccines (but not hydroxychloroquine) in the second half of 2020, you might call the function this way:
```javascript 
nytQuery(`(COVID AND vaccine) AND NOT (Hydroxycholorquine)`, {"begin_date": "20210701", "end_date": "20211231})
```
**The Response Object**

If your query is successful, it will return a a JSON object with the following structure:

``` json
{ "status": "some string",
  "copyright": "some other string",
  "response" {
     "docs": [ "our articles are here"], 
     "meta": "we are ignoring this"
     }
}
```

We are primarily interested in the `docs` property of the `response`. This contains an array of up to 10 articles, each of which is a fairly complex object. For now, we care about `headline` (an object with several parts), `byline` (another object, rrepresenting the author), `lead_paragraph` (the first paragraph of the story), and `url` (where to find the story o n the NYT website). We make use of these to create the cards.

## [The Guardian API](https://open-platform.theguardian.com/documentation/search)

The Guardian article search is quite similar to the New York Times, but with slight differences that can make translation a little bit frustrating. 

**The Query String**

Again, this is our main search string, and again, we are allowed to use Boolean operators like `AND`, `Or\R`, and `NOT`. The `+` and `-` signs don't work here, though. 

**Additional Parameters**

There are many other possible parameters, but we will again focus on the date constraints.  These are written a little bit differently than in the nytimes API. The parameter names are `from-date` and `to-date`, and the date formate is `YYYY-MM-DD` .  So you have to adjust your query slightly, e.g.:

```javascript 
guardianQuery(`(COVID AND vaccine) AND NOT Hydroxychloropquine`, {"from-date": "1980-01-01"})
```

**The Response Object**

The response here is again, somewhat similar, and looksl ike this: 

``` json
{
    "response": {
        "status": "ok",
        "userTier": "free",
        "total": 1,
        "startIndex": 1,
        "pageSize": 10,
        "currentPage": 1,
        "pages": 1,
        "orderBy": "newest",
        "results": [
            {
                "id": "politics/blog/2014/feb/17/alex-salmond-speech-first-minister-scottish-independence-eu-currency-live",
                "sectionId": "politics",
                "sectionName": "Politics",
                "webPublicationDate": "2014-02-17T12:05:47Z",
                "webTitle": "Alex Salmond speech – first minister hits back over Scottish independence – live",
                "webUrl": "https://www.theguardian.com/politics/blog/2014/feb/17/alex-salmond-speech-first-minister-scottish-independence-eu-currency-live",
                "apiUrl": "https://content.guardianapis.com/politics/blog/2014/feb/17/alex-salmond-speech-first-minister-scottish-independence-eu-currency-live"
            }
        ]
    }
}
```

As before, we are looking for an array or objects where each object represents an article, but in this case our array is `response.results`, and the field names for the individual articles are also different. The ones we are using right now are:
- headline: the title
- thumbnail: the URL for the main image associated with the article
- byline: the name of the author
- body: the main HTML text of the whole article

## [Wikipedia API](https://www.mediawiki.org/wiki/API:Query)
  
The Wikipedia API is by far the most complex one that we use. It is old and somewhat rickety, with many distincet "modules" that have been added over time. As a result, our process here is somewhat more complex.  First, we do one search to return a list of results; then we individually fetch page text form each of the search results. 

**The Query String**

Fortunately, our query string is familiar: it use sthe same ElasticSearch syntax we saw i n the New York Times API.  

**Additinal Parameters**

There are **loads** of additional parameters in the Wikipedia API, and unfortunatley it is odten difficult to discover which parameters can actually be used with the type of searh we are doing (it's called a "list" in the API docs). You can try [the English Wikipedia help age](https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bsearch), but be prepared to dig. The only one that I will introducehe re is `srlimit`, which will allow you to return more than 10 results if you like; you might use it like so:

``` json
wikiQuery(`+covid +vaccine -"united states"`,{"srlimit": 30})
```

**Return value** 

The return value is somewhat complex; it might be easiest to just inspect it in firefox, e.g. by clicking on this link: 

https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&list=search&srsearch=%20covid%20vaccine%20-%22united%20states%22&srlimit=30

Basically, we are looking in`query.search`.  We then iterate through the list of results, acquiring the page text for each article. Those results look like this:

https://en.wikipedia.org/w/api.php?origin=*&format=json&action=parse&pageid=63341143&prop=text&section=0

# Step 2: design a search query

Note that there really isn't much coding to do here; all that is asked of you is to figure out a query that returns a reasonable set of results. Remember what we said in class: think of a topic in which you have a genuine interest, and tyr to get some results that interest you.

# Step 3: customize CSS

As before, consider customizing your CSS to make the display more to your liking. 

# Step 4: write a short (<500 words) discussion of your result set

The main point of this section is to get you used to writing in markdown syntax. In the file `essay.md`, write a short explanation of your project, explaining what you hoped to be able to display, whether you were successful, and what challenges you faced. Also please briefly imagine a more complex version of your project, one that might not bel imited by the API's we have explored. Imagine, for instance, that you could pull data from some other source(s); what would be more interesting/exciting? Also, are the cards an appropriate kind of component out of which to build your project? If not, what might you use instead?

You are welome to go over the word limit if you find it restrictive; the purpose of the the low limit is to constrain the maount of work that seems necessary. 

# Notes on Process
