// Insert your own CloudMade API key here
var apiKey = '***';

var map = L.map('map', {inertia: false}).setView([60.166, 24.946], 14);

L.tileLayer('http://{s}.tile.cloudmade.com/' + apiKey + '/115732/256/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(map);

// Polygons representing the areas we want to compare
var areas = [{
  type: 'Feature',
  properties: {
    name: 'area1',
    // old and new classes for comparison
    classification: [0, 1]
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [ 24.966821701487,60.16259488508 ],
      [ 24.9356496062375,60.1713366005414 ],
      [ 24.9536480164986,60.1771971217745 ],
      [ 24.9548434564361,60.1772286515468 ],
      [ 24.9785881625528,60.1699092300427 ],
      [ 24.966821701487,60.16259488508 ]
    ]]
  }
}, {
  type: 'Feature',
  properties: {
    name: 'area2',
    classification: [1, 0]
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [ 24.9404575841116,60.1644434174326 ],
      [ 24.912210292774,60.1576726440919 ],
      [ 24.9253613061177,60.1773647545992 ],
      [ 24.9334347868874,60.1729529113032 ],
      [ 24.9363123353965,60.1708205310791 ],
      [ 24.9404575841116,60.1644434174326 ]
    ]]
  }
}];

// What color to assign a given class
var classToColor = ['#009900', '#AA6600'];

L.geoJson(areas, {
  weight: 1,
  opacity: 0.7,
  fillOpacity: 0.4,
  style: function(feature) {
    // Color using the first (old) class
    return {color: classToColor[feature.properties.classification[0]]};
  },
  // Left region of map
  clipPath: 'url(#clipLeft)'
}).addTo(map);

L.geoJson(areas, {
  weight: 1,
  opacity: 0.7,
  fillOpacity: 0.4,
  style: function(feature) {
    // Color using the second (new) class
    return {color: classToColor[feature.properties.classification[1]]};
  },
  // Right region of map
  clipPath: 'url(#clipRight)'
}).addTo(map);

// Assign clip paths to all appropriate Leaflet layers
for (var i in map._layers) {
  if (map._layers[i]._container) {
    map._layers[i]._container.style.clipPath = 
      map._layers[i].options.clipPath;
  }
}

// Handle the case where the user drags the map, not the swipe

function moveDivide(map, clipLeft, clipRight, x, y) {
  var clipLeftRect = clipLeft.getElementsByTagName('rect')[0],
    clipRightRect = clipRight.getElementsByTagName('rect')[0];
     
  clipLeftRect.setAttribute('x', parseInt(clipLeftRect.getAttribute('x')) + x);
  clipLeftRect.setAttribute('y', parseInt(clipLeftRect.getAttribute('y')) + y);
  clipRightRect.setAttribute('x', parseInt(clipRightRect.getAttribute('x')) + x);
  clipRightRect.setAttribute('y', parseInt(clipRightRect.getAttribute('y')) + y);
};

var marginX = 9000, // Map's margin, as in the SVG declaration 
  offsetX = 0,      // Track global offset
  dragOffsetX = 0,  // Track offset from last map drag
  dragOffsetY = 0;

map.on('dragstart', function(e) {
  dragOffsetX = map.getPixelBounds().min.x;
  dragOffsetY = map.getPixelBounds().min.y;
});

map.on('dragend', function(e) {
  dragOffsetX -= map.getPixelBounds().min.x;
  dragOffsetY -= map.getPixelBounds().min.y;
  offsetX += dragOffsetX;

  moveDivide(map, 
             document.getElementById('clipLeft'), 
             document.getElementById('clipRight'), 
             -dragOffsetX, -dragOffsetY);
});

// Handle the case where the user moves the handle

function moveSwipe(map, swipe, x) {
  x = Math.max(0, Math.min(x, map.getSize()['x']));
  var handle = swipe.getElementsByTagName('div')[0];
  swipe.style.left = x + 'px';
};

function setDivide(map, clipLeft, clipRight, x) {  
  x = Math.max(0, Math.min(x, map.getSize()['x']));
  var layerX = map.containerPointToLayerPoint(x, 0).x,
    clipLeftRect = clipLeft.getElementsByTagName('rect')[0],
    clipRightRect = clipRight.getElementsByTagName('rect')[0];
  clipLeftRect.setAttribute('width', marginX + offsetX + layerX);
  clipRightRect.setAttribute('x', layerX);
};

function findPos(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    curleft = obj.offsetLeft;
    curtop = obj.offsetTop;
    while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    }
  }
  return [curleft, curtop];
};

// Global objects

var swipe = document.getElementById('swipe'),
  handle = swipe.getElementsByTagName('div')[0];
  dragging = false;

// Hook up events

swipe.getElementsByTagName('div')[0].onmousedown = function() {
  dragging = true;
}

document.onmouseup = function() {
  dragging = false;
}

document.onmousemove = function(e) {
  if (dragging) {
    var x = e.x || e.pageX,
      currSwipePos,
      clipLeft = document.getElementById('clipLeft'),
      clipRight = document.getElementById('clipRight');

    moveSwipe(map, swipe, x);
    currSwipePos = findPos(swipe);

    setDivide(map, clipLeft, clipRight, currSwipePos[0]-10);  //Hack: 10 px off for some reason
  }
}
