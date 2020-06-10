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

//Displays comment submission form if user is logged in
//Displays login link if user is logged out.
function loginBasedDisplay() {
    fetch('/login-status').then(response => response.json()).then((stats) => {
        console.log(stats.LoggedIn);
        console.log(stats.LoggedIn.localeCompare("true") == 0);
        if (stats.LoggedIn.localeCompare("true") == 0) {
        document.getElementById("login-logout").innerText = "You're logged in! Submit a comment below.";
        document.getElementById("form").style.display = "block";
        } else {
        document.getElementById("login-logout").innerHTML = "<p>Login <a href=\"" + stats.LoginURL + "\">here</a>.</p>";
        document.getElementById("form").style.display = "none";
        }
    });
}

//Function to load all comments onto comments/html
function loadComments() {
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
  titleElement.innerText = comment.email + ": " + comment.title;

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
      zoom: 8,
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
    var info1 = new google.maps.InfoWindow({
        content:'<h3>Simply Thai</h3>' +
                '<p><b>Simply Thai</b> is my favorite Thai restaurant, not just because I love the food ' + 
                'but also because of the beautiful, calming ambience.</p>'
    });
    marker1.addListener('click', function() {
        info1.open(map, marker1);
    });
    var info2 = new google.maps.InfoWindow({
        content:'<h3>Golden Gate Park</h3>' +
                '<p><b>GOlden Gate Park</b> is a sprawling expanse of land with open picnic areas, recreational ' + 
                'boating lakes, fascinating structures, and captivating rose gardens. It remains one of my favorite' +
                'places to spend the day.</p>'
    });
    marker2.addListener('click', function() {
        info2.open(map, marker2);
    });
    var info3 = new google.maps.InfoWindow({
        content:'<h3>Carmel-By-The-Sea</h3>' +
                '<p><b>Carmel-By-The-Sea</b> is a small town filled with homey cafes, bustling art galleries, ' + 
                'and, of course, beautiful beaches by the sea.</p>'
    });
    marker3.addListener('click', function() {
        info3.open(map, marker3);
    });
    var info4 = new google.maps.InfoWindow({
        content:'<h3>Sno-Crave Tea House</h3>' +
                '<p><b>Sno-Crave Tea House</b> is a cozy cafe nestled in a busy complex, filled with games to play ' + 
                'with family and friends as well as elaborate dessert creations and amazingly seasoned curly fries.</p>'
    });
    marker4.addListener('click', function() {
        info4.open(map, marker4);
    });
}
