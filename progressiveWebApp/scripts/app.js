(function () {
    'use strict';

    var App = {
        isLoading: true,
        visibleCards: {},
        selectedCities: {},
        spinner: document.querySelector('.loader'),
        cardTemplate: document.querySelector('.cardTemplate'),
        addDialog: document.querySelector('.dialog-container'),
        container: document.querySelector('.main'),
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    document.getElementById('butRefresh').addEventListener('click', function () {
        App.getForecast('Phoenix', 'Phoenix');
    });
    document.getElementById('butAdd').addEventListener('click', function () {
        App.addDialog.removeAttribute('hidden');
        App.updateForecastCard();
    });
    document.getElementById('butAddCity').addEventListener('click', function () {
        App.toggleAddDialog(true);
    });
    document.getElementById('butAddCancel').addEventListener('click', function () {
        App.toggleAddDialog(false);
    });

    App.updateForecastCard = function (data) {
        //TODO:AMUNOZ remove this later
        if(!data){
            App.spinner.setAttribute('hidden', true);
            App.container.removeAttribute('hidden');
            App.isLoading = false;
            return;
        }
        var card = App.visibleCards[data.key];
        if(!card){
           card = App.cardTemplate.cloneNode(true);
            card.classList.remove('cardTemplate');
            card.querySelector('.location').textContent = data.label;
            card.removeAttribute('hidden');
            App.container.appendChild(card);
            App.visibleCards[data.key] = card;
        }

        card.querySelector('.location').textContent = new Date(data.currently.time * 1000).toString();
        card.querySelector('.description').textContent = data.currently.summary;
        card.querySelector('.current .icon').classList.add(data.currently.icon);
        card.querySelector('.current .temperature .value').textContent = data.currently.temperature;
        card.querySelector('.current .feels-like .value').textContent = data.currently.apparentTemperature;
        card.querySelector('.current .precip').textContent = data.currently.precipProbability;
        card.querySelector('.current .humidity').textContent = data.currently.humidity;
        card.querySelector('.current .wind .value').textContent = data.currently.windSpeed;
        card.querySelector('.current .wind .direction').textContent = data.currently.windBearing;

        var nextDays = card.querySelectorAll('.future .oneday');
        var today = new Date().getDay();

        for(var i = 0; i < 7; i++){
            var nextDay = nextDays[i];
            var daily = data.daily.data[i];

            if(nextDay && daily){
                nextDay.querySelector('.date').textContent = App.daysOfWeek[(today + i) % 7];
                nextDay.querySelector('.icon').classList.add(daily.icon);
                nextDay.querySelector('.temp-high .value').textContent = daily.temperatureMax;
                nextDay.querySelector('.temp-low .value').textContent = daily.temperatureMin;
            }
        }

        if (App.isLoading) {
            App.spinner.setAttribute('hidden', true);
            App.container.removeAttribute('hidden');
            App.isLoading = false;
        }
    };

    App.getForecast = function (key, label) {
        key = key.toLowerCase();
        var url = 'https://publicdata-weather.firebaseio.com/' + key + '.json';
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