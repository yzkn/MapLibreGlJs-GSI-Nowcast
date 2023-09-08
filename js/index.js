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


// map.addControl(
//     new maplibregl.GeolocateControl({
//         positionOptions: {
//             enableHighAccuracy: true
//         },
//         trackUserLocation: true,
//         showUserHeading: true
//     }),
//     'bottom-right'
// );
