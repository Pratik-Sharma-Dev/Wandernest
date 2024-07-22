    // Initialize Mapbox GL

	mapboxgl.accessToken = 'pk.eyJ1IjoicHJhdGlrNDUiLCJhIjoiY2x5ZnA1dGhtMDFtMzJrczQ2NDhyazZjbCJ9.qzfPV-WkAg4Hcxfzg1fkHw';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [77.2088, 28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });