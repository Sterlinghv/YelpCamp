mapboxgl.accessToken = mapToken; //not important if public finds it, its already public..
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: campground.geometry.coordinates,
    zoom: 9, //starting zoom
});

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map)