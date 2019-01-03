// Shorthand for $( document ).ready()
$(function () {
  const token = "uFfxhyvhhQLjmFsr5";

  let apiCitiesUrl = `https://api.airvisual.com/v2/states?country=vietnam&key=${token}`;
  $.getJSON(apiCitiesUrl, (json) => {
    console.log(json.data);
    for (let i = 0; i < json.data.length; i++) {
      $('#cities').append(`<option value="${json.data[i].state}">${json.data[i].state}</option>`);
    }
    return false;
  });
  $.getJSON(`https://api.airvisual.com/v2/nearest_city?key=${token}`, (json) => {
    $('#spinner').hide();
    $('#cities').val(json.data.state);
    console.log(json.data);
    showPolution(json);
    return false;
  });
  $('#frmCity').on('change', '#cities', () => {
    const city = $('#cities').val();
    if (city) {
      $('#spinner').show();
      const apiGetByCity = `https://api.airvisual.com/v2/city?city=${city}&state=${city}&country=Vietnam&key=${token}`
      $.getJSON(apiGetByCity, (json) => {
        console.log(json);
        showPolution(json);
        $('#spinner').hide();
        return false;
      });
    }
    return false;
  });
  $('#frmSearch').submit((e) => {
    let apiUrl = `https://api.airvisual.com/v2/nearest_city?key=${token}`;
    e.preventDefault();
    const loading = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...`;
    $('#btnNear').html(loading);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((loc) => {
        defaultLocation = [loc.coords.latitude, loc.coords.longitude];
        apiUrl += `&lat=${loc.coords.latitude}&lon=${loc.coords.longitude}`;
        $.getJSON(apiUrl, (json) => {
          //$('#spinner').hide();
          $('#cities').val(json.data.state);
          console.log(json.data.current);
          showPolution(json);
          $('#btnNear').html(`<i class="fa fa-map-marker"></i> Near You`);
          return false;
        });
      }, (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        }
      });
    } else {
      $.getJSON(apiUrl, (json) => {
        $('#spinner').hide();
        $('#cities').val(json.data.state);
        console.log(json.data);
        showPolution(json);
        return false;
      });
    }

  });

  function getPollutionString(pollutionIndex) {
    let pollutionInfo = '';
    if (pollutionIndex <= 50)
      pollutionInfo = 'Good';
    if (pollutionIndex > 50 && pollutionIndex <= 100)
      pollutionInfo = 'Moderate';
    if (pollutionIndex > 100 && pollutionIndex <= 150)
      pollutionInfo = 'Unhealthy for Sensitive Groups';
    if (pollutionIndex > 150 && pollutionIndex <= 200)
      pollutionInfo = 'Unhealthy';
    if (pollutionIndex > 200 && pollutionIndex <= 300)
      pollutionInfo = 'Very Unhealthy';
    if (pollutionIndex > 300 && pollutionIndex <= 500)
      pollutionInfo = 'Hazardous';
    return pollutionInfo;
  }

  function showPolution(data) {
    let pollutionUpdateDate = new Date(data.data.current.pollution.ts.toString());

    const usPollution = getPollutionString(data.data.current.pollution.aqius);
    const cnPollution = getPollutionString(data.data.current.pollution.aqicn);
    let weatherUpdateDate = new Date(data.data.current.weather.ts.toString());
    let trPollution =
      `<td>${data.data.current.pollution.aqicn+ " " + cnPollution}</td>
      <td>${data.data.current.pollution.aqius + " " + usPollution}</td>
      <td>${data.data.current.pollution.maincn}</td>
      <td>${data.data.current.pollution.mainus}</td>
      <td>${pollutionUpdateDate.toLocaleString()}</td>
      `;
    let weatherInfo = getWeatherinfo(data.data.current.weather.ic);
    let trWeather =
      `<td>${data.data.current.weather.hu}</td>
      <td>${weatherInfo}</td>
      <td>${data.data.current.weather.pr}</td>
      <td>${data.data.current.weather.tp}</td>
      <td>${data.data.current.weather.wd}</td>
      <td>${data.data.current.weather.ws}</td>
      <td>${weatherUpdateDate.toLocaleString()}</td>
      `;
    $('#tbPolution tbody').empty();
    $('#tbWeather tbody').empty();
    $('#tbPolution tbody').append(trPollution);
    $('#tbWeather tbody').append(trWeather);
  }

  function getWeatherinfo(code) {
    let info = "";
    switch (code) {
      case '01d':
        info = 'Clear sky (day)';
        break;
      case '01n':
        info = 'Clear sky (night)';
        break;
      case '02d':
        info = 'Few clouds (day)';
        break;
      case '02n':
        info = 'Few clouds (night)';
        break;
      case '03d':
        info = 'Scattered clouds';
        break;
      case '04d':
        info = 'Broken clouds';
        break;
      case '09d':
        info = 'Shower rain';
        break;
      case '10d':
        info = 'Rain (day time)';
        break;
      case '10n':
        info = 'Rain (night time)';
        break;
      case '11d':
        info = 'Thunderstorm';
        break;
      case '13d':
        info = 'Snow';
        break;
      case '50d':
        info = 'Mist';
        break;
    }
    return info;
  }
});
