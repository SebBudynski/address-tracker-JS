"use strict";

const input = document.querySelector("input");
const button = document.querySelector("button");

button.addEventListener('click', () => {
  const inputValue = input.value;

  let url;
  if (validateIP(inputValue)) {
    url = `https://geo.ipify.org/api/v1?apiKey=at_zgxvkAbcmmOuKr5fk4kXUT38py70i&ipAddress=${inputValue}`;
  } else {
    url = `https://geo.ipify.org/api/v1?apiKey=at_zgxvkAbcmmOuKr5fk4kXUT38py70i&domain=${inputValue}`;
  }

  // Fetch the geolocation data of the IP address or domain
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const lat = data.location.lat;
      const lng = data.location.lng;

      // Initialize the map and set its view to the geolocation
      let map = L.map("mapid").setView([lat, lng], 13);

      // Add the OpenStreetMap tile layer to the map
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Define a custom icon
      let customIcon = L.icon({
        iconUrl: "images/icon-location.svg",
        iconSize: [40, 50],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
      });

      // Add a marker to the map at the geolocation with the custom icon
      L.marker([lat, lng], { icon: customIcon }).addTo(map);
    });
});

// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
  // Fetch the IP address of the user
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ip = data.ip;

      // Fetch the geolocation data of the IP address
      fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_zgxvkAbcmmOuKr5fk4kXUT38py70i&ipAddress=${ip}`
      )
        .then((response) => response.json())
        .then((data) => {
          const lat = data.location.lat;
          const lng = data.location.lng;

          // Initialize the map and set its view to the geolocation
          let map = L.map("mapid").setView([lat, lng], 13);

          // Add the OpenStreetMap tile layer to the map
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Define a custom icon
          let customIcon = L.icon({
            iconUrl: "images/icon-location.svg",
            iconSize: [40, 50],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
          });

          // Add a marker to the map at the geolocation with the custom icon
          L.marker([lat, lng], { icon: customIcon }).addTo(map);
        });
    });
});
