import fetch from "node-fetch";
import { WeatherData } from "../../types";

class WeatherService {
  constructor(private apiKey: string) {}

  public async getWeatherForecast(location: string): Promise<any> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}&units=metric`
    );
    const apiData = (await response.json()) as any;

    // On extrait les données utiles
    return {
      city: apiData.name,
      country: apiData.sys?.country,
      temperature: apiData.main?.temp,
      feels_like: apiData.main?.feels_like,
      temp_min: apiData.main?.temp_min,
      temp_max: apiData.main?.temp_max,
      humidity: apiData.main?.humidity,
      pressure: apiData.main?.pressure,
      weather: apiData.weather?.[0]?.main,
      description: apiData.weather?.[0]?.description,
      wind_speed: apiData.wind?.speed,
      wind_deg: apiData.wind?.deg,
      clouds: apiData.clouds?.all,
      sunrise: apiData.sys?.sunrise,
      sunset: apiData.sys?.sunset,
      date: new Date(apiData.dt * 1000).toISOString(),
    };
  }

  public async getWeatherForecastByCoords(
    lat: number,
    lon: number
  ): Promise<any> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );
    const apiData = (await response.json()) as any;

    return {
      region: "Bas-Rhin",
      temperature: apiData.main?.temp,
      humidity: apiData.main?.humidity,
      pressure: apiData.main?.pressure,
      weather: apiData.weather?.[0]?.main,
      description: apiData.weather?.[0]?.description,
      wind_speed: apiData.wind?.speed,
      wind_deg: apiData.wind?.deg,
      clouds: apiData.clouds?.all,
      sunrise: apiData.sys?.sunrise,
      sunset: apiData.sys?.sunset,
      date: new Date(apiData.dt * 1000).toISOString(),
    };
  }

  public async getClimateData(
    location: string,
    startDate: string,
    endDate: string
  ): Promise<WeatherData[]> {
    // Implementation for fetching climate data
    return [];
  }
}

export default WeatherService;
