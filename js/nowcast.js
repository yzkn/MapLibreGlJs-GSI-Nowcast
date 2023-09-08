class NowcastControl {
    onAdd(map) {
        this.map = map;

        const nowcastButton = document.createElement('button');
        nowcastButton.className = 'maplibregl-ctrl-geolocate mapboxgl-ctrl-geolocate';
        nowcastButton.type = 'button';
        nowcastButton.innerHTML = '<span id="nowcast-button-icon" class="maplibregl-ctrl-icon mapboxgl-ctrl-icon" aria-hidden="true"></span>';
        nowcastButton.addEventListener('click', (e) => {
            alert('Nowcast button click');
        });

        this.container = document.createElement('div');
        this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.appendChild(nowcastButton);

        return this.container;
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
