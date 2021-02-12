const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempoverview = fs.readFileSync('./overview.html', 'utf-8');
const data = fs.readFileSync('./data.json', 'utf-8');
const tempcard = fs.readFileSync('./card.html', 'utf-8');
const tempproduct = fs.readFileSync('./product.html', 'utf-8');
const objdata = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardhtml = objdata
      .map((el) => replaceTemplate(tempcard, el))
      .join('');
    const output = tempoverview.replace('{%PRODUCT_CARDS%}', cardhtml);
    res.end(output);
  }
  //product
  else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = objdata[query.id];
    const output = replaceTemplate(tempproduct, product);
    res.end(output);
  }
  //not found
  else {
    res.writeHead(404, {
      'content-type': 'text/html',
    });
    res.end('<h1>Page not Found</h1>');
  }
});

server.listen('8000', '127.0.0.1', () => {
  console.log('server running !!!!!!!!!!');
});
