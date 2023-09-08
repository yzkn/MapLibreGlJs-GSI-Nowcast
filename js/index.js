// Copyright (c) 2023 YA-androidapp(https://github.com/yzkn) All rights reserved.


const map = new maplibregl.Map({
    container: 'map',
    style: 'https://gsi-cyberjapan.github.io/gsivectortile-mapbox-gl-js/std.json',
    center: [139.7109, 35.729503],
    zoom: 10
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

map.addControl(new maplibregl.ScaleControl());

// Export
map.addControl(new MaplibreExportControl.MaplibreExportControl({
    Format: MaplibreExportControl.Format.PNG,
    DPI: MaplibreExportControl.DPI[400]
}), 'bottom-right');
// Export


// Local GeoJSON
const handleFileSelect = (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();

    reader.onload = (theFile) => {
        const geoJSONcontent = JSON.parse(theFile.target.result);

        map.addSource('uploaded-source', {
            'type': 'geojson',
            'data': geoJSONcontent
        });

        map.addLayer({
            'id': 'uploaded-polygons',
            'type': 'line',
            'source': 'uploaded-source',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff0000',
                'line-width': 1
            }

            // 'filter': ['==', '$type', 'Feature']
        });
    };

    reader.readAsText(file, 'UTF-8');
};

document.getElementById('file').addEventListener('change', handleFileSelect, false);
// Local GeoJSON

// Locating
map.addControl(
    new maplibregl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }),
    'bottom-right'
);
// Locating


// Add vector tiles
map.on('load', () => {
    map.addSource('All', {
        'type': 'vector',
        'tiles': [
            'https://yzkn.github.io/MyKMLsMap/tiles/{z}/{x}/{y}.pbf'
        ],
        'minzoom': 0,
        'maxzoom': 18
    });
    map.addLayer(
        {
            'id': 'All',
            'type': 'line',
            'source': 'All',
            'source-layer': 'All',
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-opacity': 0.8,
                'line-color': 'rgb(255, 0, 0)',
                'line-width': 1
            }
        }
    );
});
// Add vector tiles
