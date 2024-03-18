document.addEventListener("DOMContentLoaded", function() {
    var ipAddress = prompt("Veuillez saisir l'adresse IP :");

    if (ipAddress) {
        // Stocker l'adresse IP pour une utilisation ultérieure dans la fonction updatePlot()
        updatePlot(ipAddress);
        console.log("Adresse IP saisie :", ipAddress);
    } else {
        alert("Vous devez saisir une adresse IP pour continuer.");
        return; // Arrêter l'exécution si aucune adresse IP n'est saisie
    }

    var temperatureData = [{
        domain: {
            x: [0, 1],
            y: [0, 1]
        },
        value: 0,
        title: {
            text: "Temperature"
        },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: {
            reference: 30
        },
        gauge: {
            axis: {
                range: [0, 50]
            },
            steps: [{
                    range: [0, 25],
                    color: "lightgray"
                },
                {
                    range: [25, 40],
                    color: "gray"
                }
            ],
            threshold: {
                line: {
                    color: "red",
                    width: 4
                },
                thickness: 0.75,
                value: 40
            }
        }
    }];

    var humidityData = [{
        domain: {
            x: [0, 1],
            y: [0, 1]
        },
        value: 0,
        title: {
            text: "Humidity"
        },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: {
            reference: 50
        },
        gauge: {
            axis: {
                range: [0, 100]
            },
            steps: [{
                    range: [0, 50],
                    color: "lightgray"
                },
                {
                    range: [50, 75],
                    color: "gray"
                }
            ],
            threshold: {
                line: {
                    color: "red",
                    width: 4
                },
                thickness: 0.75,
                value: 90
            }
        }
    }];


    var layout = {
        width: 600,
        height: 450,
        margin: {
            t: 0,
            b: 0
        }
    };


    Plotly.newPlot('temperatureDiv', temperatureData, layout);
    Plotly.newPlot('humidityDiv', humidityData, layout);

});


function updatePlot(ipAddress) {

    fetch('http://' + ipAddress + '/read_sensor') // Utiliser l'adresse IP saisie par l'utilisateur
        .then((response) => response.json())
        .then(data => {
            console.log(data)
            var temp_update = {
                value: data[0]
            };
            console.log(temp_update);
            Plotly.update("temperatureDiv", temp_update);

            var humidity_update = {
                value: data[1]
            };
            Plotly.update("humidityDiv", humidity_update);

        })
}

(function loop() {
    setTimeout(() => {
        updatePlot() // Utilisation de la fonction sans adresse IP pour la première exécution
        loop();
    }, 3000);
})();

