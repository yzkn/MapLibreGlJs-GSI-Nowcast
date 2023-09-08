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
