const fetchPins = () => {
    const body = JSON.stringify({
        "query": "query businessMapMarkers {     businessMapMarkers {       username       mapInfo {         title         coordinates {           longitude           latitude         }       }     }   }",
        "variables": {},
        "operationName": "businessMapMarkers"
    })

    fetch(
        "https://api.mainnet.bitcoinjungle.app/graphql", 
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: body,
        }
    )
    .then((res) => res.json())
    .then((obj) => {
        const pins = obj.data.businessMapMarkers

        const markerAnnotations = pins.map((el) => {
            const coordinate = new mapkit.Coordinate(el.mapInfo.coordinates.latitude, el.mapInfo.coordinates.longitude);
            return new mapkit.MarkerAnnotation(coordinate, {
                title: el.mapInfo.title,
            });
        })

        map.addAnnotations(markerAnnotations);
    })
}

mapkit.init({
    authorizationCallback: function (done) {
        fetch("/api/token")
        .then((res) => res.text())
        .then(done)
        .then(fetchPins)
    },
    language: navigator.language || navigator.userLanguage,
})

const center = new mapkit.Coordinate(9.1549238, -83.7570566)
const map = new mapkit.Map("apple-maps", {
    center,
    cameraDistance: 15000,
})