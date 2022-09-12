import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const CITY_WEATHER_ROUTE = new URLPattern({ pathname: "/city" });
const ALL_WEATHER_ROUTE = new URLPattern({ pathname: "/get-all" });

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomizedWeatherData() {
  return [
    { city: "Oslo", temperature: getRandomArbitrary(10, 18) },
    { city: "Cracow", temperature: getRandomArbitrary(16, 21) },
    { city: "Athens", temperature: getRandomArbitrary(27, 33) },
    { city: "Rome", temperature: getRandomArbitrary(24, 29) },
    { city: "Sydney", temperature: getRandomArbitrary(22, 28) },
  ];
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
      return Response.json({ temperature: cityWeatherData.temperature }, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }
  const allMatch = ALL_WEATHER_ROUTE.exec(req.url);
  if (allMatch) {
    return Response.json(getRandomizedWeatherData(), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  return new Response("Not found", {
    status: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

serve(handler);
