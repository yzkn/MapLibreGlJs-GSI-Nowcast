class LocalGeoJSONControl {
    onAdd(map) {
        this.map = map;

        const localGeoJSONButton = document.createElement('button');
        localGeoJSONButton.className = 'maplibregl-ctrl-local-geojson mapboxgl-ctrl-local-geojson';
        localGeoJSONButton.type = 'button';
        localGeoJSONButton.innerHTML = '<span id="local-geojson-button-icon" class="maplibregl-ctrl-icon mapboxgl-ctrl-icon" aria-hidden="true"></span>';
        localGeoJSONButton.addEventListener('click', (e) => {
            document.getElementById('local-geojson-control').style.display = (document.getElementById('local-geojson-control').style.display == 'block') ? 'none' : 'block';
        });

        this.container = document.createElement('div');
        this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.appendChild(localGeoJSONButton);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
