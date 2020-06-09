// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomFunFact() {
  const facts =
      ['favorite food: thai', 'favorite color: magenta', 'born on Halloween', 'favorite subject: math', 'favorite season: fall'];

  // Pick a random greeting.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factsContainer = document.getElementById('facts-container');
  factsContainer.innerText = fact;
}


async function getGreeting(){
  const response = await fetch('/data');
  const quote = await response.text();
  document.getElementById('quote-container').innerText = quote;
}

function getStats() {
  fetch('/data').then(response => response.json()).then((stats) => {

    const statsListElement = document.getElementById('stats-container');
    statsListElement.innerHTML = '';
    statsListElement.appendChild(
        createListElement('Hometown: ' + stats.Hometown));
    statsListElement.appendChild(
        createListElement('University: ' + stats.University));
    statsListElement.appendChild(
        createListElement('Major: ' + stats.Major));
  });
}

//Function to load all comments onto comments/html
async function loadComments() {
  fetch('/data?maxComments='+0).then(response => response.json()).then((comments) => {
    const commentElement = document.getElementById('comments-list');
    comments.forEach((comment) => {
      commentElement.appendChild(createCommentElement(comment));
    })
  });
}

//Function to clear out the comments and then
//load no more than MAXCOMMENTS comments onto comments/html
function loadComments(maxComments) {
  clearComments();
  fetch('/data?maxComments='+maxComments).then(response => response.json()).then((comments) => {
    const commentElement = document.getElementById('comments-list');
    comments.forEach((comment) => {
      commentElement.appendChild(createCommentElement(comment));
    })
  });
}

//Function to create a comment element to be added to comment list
function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.className = 'comment';

  const titleElement = document.createElement('span');
  titleElement.innerText = comment.title;

  commentElement.appendChild(titleElement);
  return commentElement;
}

//Function to delete all comments from datastore
async function deleteData() {
    const response = await(fetch('/delete-data', {method: 'post'}));
    clearComments();
    loadComments();
    //window.location.href = "/index.html";
}

function clearComments() {
    const commentElement = document.getElementById('comments-list');
    commentElement.textContent = '';
}

function createMap() {
  const map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 37.562, lng: -122.052}, 
      zoom: 10,
      styles:[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
]});
    var marker1 = new google.maps.Marker({position: {lat: 37.549, lng:-122.052}, map: map, title: 'Simply Thai'});
    var marker2 = new google.maps.Marker({position: {lat: 37.769, lng:-122.486}, map: map, title: 'Golden Gate Park'});
    var marker3 = new google.maps.Marker({position: {lat: 36.556, lng:-121.923}, map: map, title: 'Carmel-By-The-Sea'});
    var marker4 = new google.maps.Marker({position: {lat: 37.500, lng:-121.973}, map: map, title: 'Sno-Crave Tea House'});
}
