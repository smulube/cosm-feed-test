# Usage

This is a simple little server for returning JSON/XML/CSV for testing
automatic feeds at Cosm (https://cosm.com).

Data can be retrieved by making a request like this:

    $ curl -i http://cosm-feed-test.herokuapp.com/feed?format=json&datastreams=2&location=51.2,0.023&tags=temperature

## Parameters

<dl>
  <dt>format</dt>
  <dd>Required response format, can be one of: csv1, csv2, xml, json. If none
  specified returns json</dd>
  <dt>datastreams</dt>
  <dd>Number of datastreams to return. Defaults to 1</dd>
  <dt>tags</dt>
  <dd>Comma separated list of tags. Tags specified here are applied to all
  datastreams. If not specified then no tags are returned.</dd>
  <dt>location</dt>
  <dd>Comma separated lat/lon value. If not specified then no location is
  returned.</dd>
  <dt>random</dt>
  <dd>Either true or false. Controls whether or not the app should generate
  randomish data to return. Default is true</dd>
</dl>

This code isn't tested at all, so will be very easy to break if passed any
dodgy input (i.e. non numeric datastreams count).
