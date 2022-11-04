import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const CITY_WEATHER_ROUTE = new URLPattern({ pathname: "/city" });
const CITIES_ROUTE = new URLPattern({ pathname: "/get-cities" });
const ALL_WEATHER_ROUTE = new URLPattern({ pathname: "/get-all" });

const CITIES = ["Oslo", "Cracow", "Athens", "Rome", "Sydney"];

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomizedWeatherData() {
  return [
    {
      city: "Oslo",
      temperature: getRandomArbitrary(10, 18),
      precipitation: getRandomArbitrary(3, 10),
    },
    {
      city: "Cracow",
      temperature: getRandomArbitrary(16, 21),
      precipitation: getRandomArbitrary(0, 1.5),
    },
    {
      city: "Athens",
      temperature: getRandomArbitrary(27, 33),
      precipitation: 0,
    },
    { city: "Rome", temperature: getRandomArbitrary(24, 29), precipitation: 0 },
    {
      city: "Sydney",
      temperature: getRandomArbitrary(22, 28),
      precipitation: getRandomArbitrary(0, 1.5),
    },
  ];
}

const jsonResponseHeaders = {
  "content-type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "max-age=60",
}

function handler(req: Request): Response {
  const cityMatch = CITY_WEATHER_ROUTE.exec(req.url);
  if (cityMatch) {
    const weatherData = getRandomizedWeatherData();
    const cityName = cityMatch.search.groups["0"];
    if (!cityName) {
      return new Response("Invalid city", {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    const cityWeatherData = weatherData.find((data) => data.city === cityName);
    if (cityWeatherData) {
      return Response.json({
        temperature: cityWeatherData.temperature,
        precipitation: cityWeatherData.precipitation,
      }, {
        status: 200,
        headers: jsonResponseHeaders,
      });
    }
  }
  const allMatch = ALL_WEATHER_ROUTE.exec(req.url);
  if (allMatch) {
    return Response.json(getRandomizedWeatherData(), {
      status: 200,
      headers: jsonResponseHeaders,
    });
  }
  const citiesMatch = CITIES_ROUTE.exec(req.url);
  if (citiesMatch) {
    return Response.json(CITIES, {
      status: 200,
      headers: jsonResponseHeaders,
    })
  }
  return new Response("Not found", {
    status: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

serve(handler);
