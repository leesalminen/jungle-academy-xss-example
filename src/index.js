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

            const calloutDelegate = {
                calloutRightAccessoryForAnnotation: function() {
                    const accessoryViewRight = document.createElement("a");
                    accessoryViewRight.className = "right-accessory-view";
                    accessoryViewRight.href = "https://pay.bitcoinjungle.app/" + el.username;
                    accessoryViewRight.target = "_blank";
                    accessoryViewRight.appendChild(document.createTextNode("➡"));

                    return accessoryViewRight;
                }
            }


            const coordinate = new mapkit.Coordinate(el.mapInfo.coordinates.latitude, el.mapInfo.coordinates.longitude);
            return new mapkit.MarkerAnnotation(coordinate, {
                title: el.mapInfo.title,
                callout: calloutDelegate,
                titleVisibility: mapkit.FeatureVisibility.Hidden,
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
    cameraDistance: 50000,
})

map.addEventListener('zoom-end', (evt) => {
    const map = mapkit.maps[0]
    const curentCameraDistance = map.cameraDistance.toFixed(0)

    if(curentCameraDistance < 10000) {
        map.annotations = map.annotations.map((el) => {
            el.titleVisibility = mapkit.FeatureVisibility.Visible

            return el
        })
    } else {
        map.annotations = map.annotations.map((el) => {
            el.titleVisibility = mapkit.FeatureVisibility.Hidden

            return el
        })
    }
})