document.addEventListener("DOMContentLoaded", function () {

    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const locationBtn = document.getElementById("locationBtn");
    const errorMessage = document.getElementById("errorMessage");

    const loadingMessage =
        document.getElementById("loadingMessage");

    const cityName = document.getElementById("cityName");
    const weatherIcon = document.getElementById("weatherIcon");
    const temperature = document.getElementById("temperature");
    const weatherCondition = document.getElementById("weatherCondition");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("windSpeed");
    const feelsLike = document.getElementById("feelsLike");

    const unitToggle = document.getElementById("unitToggle");

    const temperatureAlert =
        document.getElementById("temperatureAlert");

    const forecastContainer =
        document.getElementById("forecastContainer");

    // Recent Search
    const recentSearchContainer =
        document.getElementById("recentSearchContainer");

    const recentCities =
        document.getElementById("recentCities");


    // ==============================
    // TEMPERATURE VARIABLES
    // ==============================

    let currentTempC = null;
    let isFahrenheit = false;


    // ==============================
    // SEARCH BUTTON
    // ==============================

    searchBtn.addEventListener("click", function () {

        const city = cityInput.value.trim();

        if (city === "") {

            errorMessage.textContent =
                "Please enter a city name.";

            errorMessage.style.display = "block";

            return;
        }

        errorMessage.style.display = "none";

        saveRecentCity(city);

        getWeather(city);
    });


    // ==============================
    // ENTER KEY SEARCH
    // ==============================

    cityInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            searchBtn.click();
        }
    });


    // ==============================
    // MY LOCATION
    // ==============================

    locationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {

            errorMessage.textContent =
                "Geolocation is not supported by your browser.";

            errorMessage.style.display = "block";

            return;
        }

        errorMessage.style.display = "none";

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                getWeather(
                    `${latitude},${longitude}`
                );
            },

            function (error) {

                // Handle different location errors
                if (error.code === 1) {

                    errorMessage.textContent =
                        "Location permission was denied. Please allow location access.";

                } else if (error.code === 2) {

                    errorMessage.textContent =
                        "Your location could not be determined.";

                } else if (error.code === 3) {

                    errorMessage.textContent =
                        "Location request timed out. Please try again.";

                } else {

                    errorMessage.textContent =
                        "Unable to get your location.";
                }

                errorMessage.style.display = "block";
            }
        );
    });


    // ==============================
    // TEMPERATURE UNIT TOGGLE
    // ==============================

    unitToggle.addEventListener("click", function () {

        if (currentTempC === null) {
            return;
        }

        if (isFahrenheit) {

            temperature.textContent =
                `${currentTempC.toFixed(1)}°C`;

            unitToggle.textContent =
                "Switch to °F";

            isFahrenheit = false;

        } else {

            const fahrenheit =
                (currentTempC * 9 / 5) + 32;

            temperature.textContent =
                `${fahrenheit.toFixed(1)}°F`;

            unitToggle.textContent =
                "Switch to °C";

            isFahrenheit = true;
        }
    });


    // ==============================
    // GET WEATHER
    // ==============================

    async function getWeather(location) {

        try {

            // Show loading message
            loadingMessage.style.display = "block";

            errorMessage.style.display = "none";


            // Disable buttons while loading
            searchBtn.disabled = true;
            locationBtn.disabled = true;


            const url =
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=5`;

            const response = await fetch(url);


            // ==============================
            // IMPROVED ERROR HANDLING
            // ==============================

            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData.error?.message ||
                    "Weather data not found"
                );
            }


            const data = await response.json();


            // Hide loading message
            loadingMessage.style.display = "none";


            console.log("Weather Data:", data);


            // ==============================
            // CURRENT WEATHER
            // ==============================

            cityName.textContent =
                `${data.location.name}, ${data.location.country}`;


            // Store Celsius temperature
            currentTempC = data.current.temp_c;


            // Reset to Celsius when new city is searched
            isFahrenheit = false;

            temperature.textContent =
                `${currentTempC.toFixed(1)}°C`;

            unitToggle.textContent =
                "Switch to °F";


            // ==============================
            // EXTREME TEMPERATURE ALERT
            // ==============================

            if (currentTempC > 40) {

                temperatureAlert.textContent =
                    "⚠️ Extreme Temperature Alert!";

                temperatureAlert.style.display =
                    "block";

            } else {

                temperatureAlert.style.display =
                    "none";
            }


            // ==============================
            // RAINY WEATHER BACKGROUND
            // ==============================

            const condition =
                data.current.condition.text.toLowerCase();

            if (
                condition.includes("rain") ||
                condition.includes("drizzle") ||
                condition.includes("shower")
            ) {

                document.body.classList.add(
                    "rainy-weather"
                );

            } else {

                document.body.classList.remove(
                    "rainy-weather"
                );
            }


            // ==============================
            // OTHER CURRENT WEATHER DETAILS
            // ==============================

            weatherCondition.textContent =
                data.current.condition.text;

            humidity.textContent =
                `${data.current.humidity}%`;

            windSpeed.textContent =
                `${data.current.wind_kph} km/h`;

            feelsLike.textContent =
                `${data.current.feelslike_c}°C`;


            // Current weather icon
            weatherIcon.src =
                "https:" + data.current.condition.icon;

            weatherIcon.alt =
                data.current.condition.text;


            // ==============================
            // 5 DAY FORECAST
            // ==============================

            forecastContainer.innerHTML = "";


            data.forecast.forecastday.forEach(function (day) {

                const date =
                    new Date(day.date);

                const dayName =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "long"
                        }
                    );


                // Create forecast card
                const forecastCard =
                    document.createElement("div");


                forecastCard.className =
                    "bg-slate-800 rounded-xl p-4 text-center";


                forecastCard.innerHTML = `

                    <p class="font-semibold">
                        ${dayName}
                    </p>

                    <img
                        src="https:${day.day.condition.icon}"
                        alt="${day.day.condition.text}"
                        class="w-16 h-16 mx-auto my-3"
                    >

                    <p class="font-bold text-xl">
                        ${day.day.avgtemp_c}°C
                    </p>

                    <p class="text-sm text-gray-300">
                        High: ${day.day.maxtemp_c}°C
                    </p>

                    <p class="text-sm text-gray-300">
                        Low: ${day.day.mintemp_c}°C
                    </p>

                    <p class="text-sm text-gray-300 mt-2">
                        ${day.day.condition.text}
                    </p>

                    <p class="text-sm text-gray-300 mt-1">
                        Humidity: ${day.day.avghumidity}%
                    </p>

                    <p class="text-sm text-gray-300">
                        Wind: ${day.day.maxwind_kph} km/h
                    </p>

                `;


                // Add card to container
                forecastContainer.appendChild(
                    forecastCard
                );

            });


        } catch (error) {

            console.error(
                "Weather Error:",
                error
            );


            // Hide loading message
            loadingMessage.style.display = "none";


            // Show actual API error message
            errorMessage.textContent =
                error.message;

            errorMessage.style.display = "block";

        } finally {

            // Enable buttons after loading
            searchBtn.disabled = false;
            locationBtn.disabled = false;
        }
    }


    // ==============================
    // SAVE RECENT CITY
    // ==============================

    function saveRecentCity(city) {

        let cities =
            JSON.parse(
                localStorage.getItem("recentCities")
            ) || [];


        city = city.trim();


        // Remove duplicate city
        cities =
            cities.filter(function (item) {

                return item.toLowerCase()
                    !== city.toLowerCase();

            });


        // Add latest city at beginning
        cities.unshift(city);


        // Keep only 5 cities
        cities =
            cities.slice(0, 5);


        // Save cities
        localStorage.setItem(
            "recentCities",
            JSON.stringify(cities)
        );


        displayRecentCities();
    }


    // ==============================
    // DISPLAY RECENT CITIES
    // ==============================

    function displayRecentCities() {

        const cities =
            JSON.parse(
                localStorage.getItem("recentCities")
            ) || [];


        recentCities.innerHTML =
            `<option value="">
                Recently searched cities
            </option>`;


        // Hide dropdown if no cities
        if (cities.length === 0) {

            recentSearchContainer
                .classList.add("hidden");

            return;
        }


        // Show dropdown
        recentSearchContainer
            .classList.remove("hidden");


        cities.forEach(function (city) {

            const option =
                document.createElement("option");

            option.value = city;

            option.textContent = city;

            recentCities.appendChild(option);

        });
    }


    // ==============================
    // SELECT RECENT CITY
    // ==============================

    recentCities.addEventListener(
        "change",
        function () {

            const selectedCity =
                recentCities.value;


            if (selectedCity === "") {
                return;
            }


            cityInput.value =
                selectedCity;


            errorMessage.style.display =
                "none";


            getWeather(selectedCity);
        }
    );


    // ==============================
    // LOAD RECENT CITIES
    // ==============================

    displayRecentCities();


    // ==============================
    // DEFAULT WEATHER
    // ==============================

    getWeather("Mumbai");

});