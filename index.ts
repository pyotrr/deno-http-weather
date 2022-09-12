import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const WEATHER_ROUTE = new URLPattern({ pathname: "/weather/:city" });

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function getRandomizedWeatherData() {
  return [
    { city: "Cracow", temperature: getRandomArbitrary(18, 22) },
    { city: "Athens", temperature: getRandomArbitrary(27, 33) },
    { city: "Rome", temperature: getRandomArbitrary(24, 29) },
    { city: "Sydney", temperature: getRandomArbitrary(22, 28) },
  ];
}

function handler(req: Request): Response {
  const match = WEATHER_ROUTE.exec(req.url);
  if (match) {
    const weatherData = getRandomizedWeatherData();
    const cityName = match.pathname.groups.city;
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
  return new Response("City not found", {
    status: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

serve(handler);
