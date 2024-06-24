"use strict";

const API_KEY = 'at_zgxvkAbcmmOuKr5fk4kXUT38py70i';
let map;

function updateUI(data) {
  if (data && data.ip && data.location) {
    document.getElementById("ip-address").textContent = data.ip;
    document.getElementById("location").textContent = `${data.location.city || 'N/A'}, ${data.location.country || 'N/A'} ${data.location.postalCode || 'N/A'}`;
    document.getElementById("timezone").textContent = `UTC ${data.location.timezone || 'N/A'}`;
    document.getElementById("isp").textContent = data.isp || 'N/A';
  } else {
    console.error('Invalid data structure:', data);
    alert('Invalid data received. Please try again.');
  }
}

function updateMap(lat, lng) {
  if (!lat || !lng) {
    console.error('Invalid coordinates:', lat, lng);
    return;
  }

  if (map) {
    map.setView([lat, lng], 13);
  } else {
    map = L.map("mapid").setView([lat, lng], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(map);
  }

  // Remove existing markers
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  let customIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

  L.marker([lat, lng], { icon: customIcon }).addTo(map);
}

function isValidIPAddress(ipAddress) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ipAddress);
}

function isValidDomain(domain) {
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain);
}

function fetchIPData(query = '') {
  let url;
  if (query) {
    if (isValidIPAddress(query)) {
      url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${query}`;
    } else if (isValidDomain(query)) {
      url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=${query}`;
    } else {
      alert('Please enter a valid IP address or domain.');
      return;
    }
  } else {
    url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.location && data.location.lat && data.location.lng) {
        updateUI(data);
        updateMap(data.location.lat, data.location.lng);
      } else {
        throw new Error('Invalid data structure received from API');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching data. Please try again.');
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  // Load initial IP (user's IP)
  fetchIPData();

  // Add event listener for form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchValue = input.value.trim();
    if (searchValue) {
      fetchIPData(searchValue);
    }
  });
});


