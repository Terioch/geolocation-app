const latitudeContainer = document.getElementById("latitude");
const longitudeContainer = document.getElementById("longitude");
const input = document.getElementById("input");
const btn = document.getElementById("btn");

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(displayPosition, error);
} else {
	console.log("Geolocation is not available");
}

// Display Geolocation on the page
function displayPosition(position) {
	btn.addEventListener("click", () => {
		let { latitude, longitude } = position.coords;
		latitudeContainer.innerHTML = `Latitude: ${latitude}&deg;`;
		longitudeContainer.innerHTML = `Longitude: ${longitude}&deg;`;
		displayMap(latitude, longitude);
		sendData(latitude, longitude, input.value);
	});
}

// Display map
function displayMap(latitude, longitude) {
	const map = L.map("map").setView([latitude, longitude], 10);
	const attribution =
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	const tiles = L.tileLayer(tileURL, { attribution });
	tiles.addTo(map); // Add tiles to map
	L.marker([latitude, longitude]).addTo(map); // Place map marker
}

function error() {
	const status = document.getElementById("status");
	status.textContent = "Unable to retrieve your geolocation.";
}

// Get data from server
async function getData() {
	const res = await fetch("/api");
	const data = await res.json();
	return JSON.stringify(data);
}
getData();

// Post data to the server
async function sendData(latitude, longitude, city) {
	const data = { latitude, longitude, city };
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};

	try {
		const res = await fetch("/api", options);
		const json = await res.json();
		console.log(json);
	} catch (err) {
		console.error(`POST: ${err.message}`);
	}
}
