# Wiki Web

Is a electron based app of which allows a user to create a connection web between two articles.

## How it works
First input is the start page. It will go to the wikipedia page with that title and gather every link on that page, then it will go to every link and get all links on those pages. It does this until it finds one link to the target page, then it will not add anymore search terms, and will finish all of it's current queue, to see if there are multiple links to the desired page.

## Controls
**Rest / Refresh:** CTRL + R  
**Fullscreen:** F12  
**Zoom In:** CTRL + =  
**Zoom Out:** CTRL + -  
**Save:** CTRL + S  

## Setup
### Locally
Run ``npm install``, ``npm run start``, then open a browser ``[yourdevice's IP address here]:5000``.
### Alternative
This website is also hosted here [https://wiki-skimmer.herokuapp.com/](https://wiki-skimmer.herokuapp.com/);
