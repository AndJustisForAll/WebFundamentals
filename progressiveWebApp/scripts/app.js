(function () {
    'use strict';

    var App = {
        isLoading: true,
        visibleCards: [],
        selectedCities: [],
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        addDialog: document.querySelector('.dialog-container'),
        container: document.querySelector('.main'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        fixtures: {}
    };

    document.getElementById('butRefresh').addEventListener('click', function () {
        App.getForecast();
    });
    document.getElementById('butAdd').addEventListener('click', function () {
        App.updateForecastCard();
    });
    document.getElementById('butAddCity').addEventListener('click', function () {
        App.toggleAddDialog(true);
    });
    document.getElementById('butAddCancel').addEventListener('click', function () {
        App.toggleAddDialog(false);
    });

    App.updateForecastCard = function (data) {
        if (App.isLoading) {
            App.spinner.setAttribute('hidden', true);
            App.container.removeAttribute('hidden');
            App.isLoading = false;
        }
    };

    App.getForecast = function (key, label) {
        var url = 'https://publicdata-weather.firebaseio.com/';
        url += key + '.json';

        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var response = JSON.parse(request.response);
                    response.key = key;
                    response.label = label;
                    App.hasRequestPending = false;
                    App.updateForecastCard(response);
                }
            }
        };
        request.open('GET', url);
        request.send();
    };

    App.toggleAddDialog = function (visible) {
        if (visible) {
            App.addDialog.add('dialog-container--visible');
        } else {
            App.addDialog.remove('dialog-container--visible');
        }
    };

    App.updateForecastCard();
    Window.App = App;

})();