// Copyright (c) 2023 YA-androidapp(https://github.com/yzkn) All rights reserved.


const parseDateString = (str) => {
    const year = parseInt(str.substring(0, 4));
    const month = parseInt(str.substring(4, 6));
    const day = parseInt(str.substring(6, 8));
    const hour = parseInt(str.substring(8, 10));
    const min = parseInt(str.substring(10, 12));
    const sec = parseInt(str.substring(12, 14));

    const utcDate = new Date(year, month - 1, day, hour, min, sec);
    const offset = new Date().getTimezoneOffset() * 60 * 1000;
    const currentDate = new Date(utcDate.getTime() - offset);

    return currentDate;
};


const formatDate = (date, format) => {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    return format;
};




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

// Nowcast control
map.addControl(new NowcastControl(), 'top-right');
// Nowcast control

// Local GeoJSON control
map.addControl(new LocalGeoJSONControl(), 'top-right');
// Local GeoJSON control


map.on('load', () => {
    // Add vector tiles
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
    // Add vector tiles


    // Add Nowcast tiles
    const NOWCAST_URL = 'https://www.jma.go.jp/bosai/jmatile/data/nowc/targetTimes_N2.json';
    let nowcastSources = [];

    fetch(NOWCAST_URL)
        .then(function (data) {
            return data.json();
        })
        .then(function (json) {
            // 最小値を取得にはjson[0].validtime
            json.sort(function (a, b) {
                return a.validtime - b.validtime;
            });

            json.forEach(element => {
                const basetime = element.basetime;
                const validtime = element.validtime;
                const sourceId = `Nowcast${basetime}${validtime}`;

                nowcastSources.push({ id: sourceId, validtime: validtime });
                map.addSource(sourceId, {
                    'type': 'raster',
                    'tiles': [
                        `https://www.jma.go.jp/bosai/jmatile/data/nowc/${element.basetime}/none/${element.validtime}/surf/hrpns/{z}/{x}/{y}.png`
                    ],
                    'minzoom': 4,
                    'maxzoom': 14
                });
                map.addLayer(
                    {
                        'id': sourceId,
                        'type': 'raster',
                        'source': sourceId,
                        'source-layer': sourceId
                    }
                );
                map.setLayoutProperty(sourceId, 'visibility', 'none');
                map.setPaintProperty(sourceId, "raster-opacity", 1);
            });

            // Nowcast control
            document.getElementById('nowcast-slider').addEventListener('change', () => {
                document.getElementById('nowcast-datetime').innerText = formatDate(parseDateString(nowcastSources[document.getElementById('nowcast-slider').value]['validtime']), 'MM/dd HH:mm');

                nowcastSources.forEach(item => {
                    map.setLayoutProperty(item['id'], 'visibility', 'none');
                });
                map.setLayoutProperty(nowcastSources[document.getElementById('nowcast-slider').value]['id'], 'visibility', 'visible');
            }, false);
            document.getElementById('nowcast-datetime').innerText = formatDate(parseDateString(nowcastSources[0]['validtime']), 'MM/dd HH:mm');
            map.setLayoutProperty(nowcastSources[0]['id'], 'visibility', 'visible');
            // Nowcast control
        });
    // Add Nowcast tiles
});
