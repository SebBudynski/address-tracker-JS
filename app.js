"use strict";

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const ip = data.ip;

      fetch(
        `https://geo.ipify.org/api/v1?apiKey=at_zgxvkAbcmmOuKr5fk4kXUT38py70i&ipAddress=${ip}`
      )
        .then((response) => response.json())
        .then((data) => {
          const lat = data.location.lat;
          const lng = data.location.lng;

          let map = L.map("mapid").setView([lat, lng], 13);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          let customIcon = L.icon({
            iconUrl: "images/icon-location.svg",
            iconSize: [40, 50],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
          });

          L.marker([lat, lng], { icon: customIcon }).addTo(map);
        });
    });
});
