const urls = require("../data/urls-data");
const uses = require("../data/uses-data");


function list(req, res) {
  res.json({ data: urls })
}


function bodyHashrefProperty(req, res, next) {
  const { data: { href } = {} } = req.body;
  if (href) 
  return next();
  next({
    status: 400,
    message: "A 'href' property is required."
  })
}



let maxUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);


function createRecord(req, res) {
  const { data: { href } = {} } = req.body;
  const newUrl = {
    href,
    id: ++maxUrlId,
  };
  urls.push(newUrl);
  res.status(201).json({ data: newUrl });
}



function urlExists(req, res, next) {
  const { urlId } = req.params;
  const foundUrl = urls.find((url) => url.id === Number(urlId));
  
  if (foundUrl) {
    res.locals.url = foundUrl
    return next();
  }
  next({
    status: 404,
    message: `Url id not found: ${urlId}`
  })
}


let newUseId = uses.length + 1;

function readRequest(req, res) {
  const urlId = Number(req.params.urlId);
  const newUse = {
    id: newUseId,
    urlId,
    time: Date.now(),
  }
  uses.push(newUse)
  res.json({ data: res.locals.url })
}

function update(req, res, next) {
  const url = res.locals.url
  const originalUrl = url.href;
  const { data: { href } = {} } = req.body;
  if (originalUrl !== href) {
    url.href = href;
  }
  
  res.json({ data: url })
}

module.exports = {
  list,
  urlExists,
  create: [bodyHashrefProperty, createRecord],
    read: [urlExists, readRequest],
  update: [urlExists, bodyHashrefProperty, update],
}