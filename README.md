leaflet-layer-swipe
===================

An example implementation of a before/after swipe overlaid on a Leaflet.js map that works with GeoJSON layers. 

Before/after swipes are useful for visualising a change happening over time.
They have often been used to display two versions of some image. In this example,
two GeoJSON layers are contrasted with each other on top of a Leaflet.js map. 
Each layer has the same polygons, but the polygons are colored differently in 
the "before" and "after" cases.

One potential use case for this would be displaying the boroughs of a city 
as polygons in a GeoJSON layer. The polygons could then be colored according
to some statistic, for example unemployment. By moving the swipe, the user
can see how unemployment has changed over time in the different areas of the city.

The example is based on a [similar swipe control by Glenorchy City Council](https://github.com/gccgisteam/leaflet-examples/blob/master/leafletSwipe.html). 

### Usage

You need to get an API key for the [CloudMade API](http://www.cloudmade.com) first.
Add your API key to the ```scripts/map-demo.js``` file. By visiting the ````map.html```` file, you should then be able to see the swipe effect in action.

The example does not depend on any external libraries except Leaflet.js. 


