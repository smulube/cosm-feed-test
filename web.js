var express = require('express');

var app = express.createServer(express.logger());

// Return a randomish value (actually sinusoidal with period of about an hour),
// with a little bit of random jitter added
app.random_value = function() {
  var date = new Date(),
      random_offset = (Math.random() - 0.5) * 2;
  return (Math.sin(0.02618 * date.getMinutes()) * 20 + random_offset).toFixed(2);
}

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
  var data = [];
  for(var i = 0; i < options.datastreams; i++) {
    if (options.random === "false") {
      data.push(i);
    } else {
      data.push(app.random_value());
    }
  }
  return data.join(",");
}

app.csv_v2 = function(options) {
  var data = [];
  for(var i= 0; i < options.datastreams; i++) {
    if (options.random === "false") {
      data.push("stream" + i + "," + i);
    } else {
      data.push("stream" + i + "," + app.random_value());
    }
  }
  return data.join("\n");
}

app.xml = function(options) {
  xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<eeml xmlns="http://www.eeml.org/xsd/0.5.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'
    + '  version="0.5.1" xsi:schemaLocation="http://www.eeml.org/xsd 0.5.1 http://www.eeml.org/xsd/0.5.1/0.5.1.xsd">\n'
    + '<environment>\n'
    + '<title>Test Automatic Feed</title>\n'
    + '<description>Description of automatic feed</description>\n'

  if (options.location) {
    var latlng = options.location.split(/,/);

    xml += '<location domain="physical">\n'
      + '<lat>' + latlng[0] + '</lat>\n'
      + '<lon>' + latlng[1] + '</lon>\n'
      + '</location>\n';
  }

  for (var i=0; i < options.datastreams; i++) {
    if (options.random === "false") {
      xml += '<data id="stream ' + i + '>\n';
      if (options.tags) {
        var tags = options.tags.split(/,/);
        for(var j=0; j < tags.length; j++) {
          xml += '<tag>' + tags[j] + '</tag>\n';
        }
      }
      xml += '<current-value>' + i + '</current-value>\n'
        + '</data>\n';
    } else {
      xml += '<data id="stream ' + i + '>\n';

      if (options.tags) {
        var tags = options.tags.split(/,/);
        for(var j=0; j < tags.length; j++) {
          xml += '<tag>' + tags[j] + '</tag>\n';
        }
      }
      xml += '<current-value>' + app.random_value() + '</current-value>\n'
        + '</data>\n';
    }
  }
    xml += '</environment>\n</eeml>\n';
    return xml;
}

app.json = function(options) {
  var json = { title: "Test Automatic Feed",
               description: "Description of automatic feed",
               version: "1.0.0"};

  if (options.location) {
    var latlng = options.location.split(/,/);

    json["location"] = { lat: latlng[0], lon: latlng[1], domain: "physical" };
  }

  json.datastreams = [];

  for (var i = 0; i < options.datastreams; i++) {
    var datastream_json = { id: "stream" + i};
    if (options.random === "false") {
      datastream_json["current_value"] = i;
      if (options.tags) {
        datastream_json["tags"] = options.tags.split(/,/);
      }
      json.datastreams.push(datastream_json);
    } else {
      datastream_json["current_value"] = app.random_value();
      if (options.tags) {
        datastream_json["tags"] = options.tags.split(/,/);
      }
      json.datastreams.push(datastream_json);
    }
  }

  return JSON.stringify(json);
}

app.get("/", function(request, response) {
  response.send("Hello world");
});

app.get("/feed", function(request, response) {
  var format = request.param('format', 'json'),
      options = {};

  // extract parameters (with defaults if not present)
  options.datastreams = parseInt(request.param('datastreams', "1"));
  options.tags = request.param('tags', '');
  options.random = request.param('random', 'true'),
  options.location = request.param('location', '');

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
