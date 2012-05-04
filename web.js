var express = require('express');

var app = express.createServer(express.logger());

app.content_type = function(format) {
  if (format.match(/^csv/)) {
    return "text/csv";
  } else if (format.match(/^xml/)) {
    return "application/xml";
  } else {
    return "application/json";
  }
}

app.csv_v1 = function(options) {
  return '0,1,2';
}

app.csv_v2 = function(options) {
  return 'stream0,0\nstream1,1\nstream2,2';
}

app.xml = function(options) {
  xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<eeml xmlns="http://www.eeml.org/xsd/0.5.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
    + '  version="0.5.1" xsi:schemaLocation="http://www.eeml.org/xsd 0.5.1 http://www.eeml.org/xsd/0.5.1/0.5.1.xsd">\n'
    + '<environment>\n'
    + '<title>Automatic Feed</title>\n'
    + '<description>Feed description</description>\n'
    + '</environment>\n</eeml>\n';
    return xml;
}

app.json = function(options) {
  return JSON.stringify({ title: "Automatic Feed",
                   description: "Description of automatic feed",
                   version: "1.0.0"});
}

app.get("/", function(request, response) {
  response.send("Hello world");
});

app.get("/feed", function(request, response) {
  var format = request.param('format', 'json'),
      options = {};

  options.datastreams = parseInt(request.param('datastreams', "0"));
  options.tags = request.param('tags', '');
  options.random = request.param('random', 'true'),

  response.header('Content-Type', app.content_type(format));

  if (format === "csv1") {
    response.send(app.csv_v1(options));
  } else if (format === "csv2") {
    response.send(app.csv_v2(options));
  } else if (format === "xml") {
    response.send(app.xml(options));
  } else {
    response.send(app.json(options));
  }
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
