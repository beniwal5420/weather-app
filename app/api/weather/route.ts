import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

const http = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/weather'
});

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get("city");
    const lat = req.nextUrl.searchParams.get("lat");
    const long = req.nextUrl.searchParams.get("long");
    const country = req.nextUrl.searchParams.get("country");
    const units = req.nextUrl.searchParams.get("units");
    const apikey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

    // Initialize params for the request
    const query: Record<string, string> = {
        appid: apikey,
        units: 'metric'  // Default units to metric
    };

    // Conditionally add parameters
    if (city) {
        query.q = city;  // q for city name
    }
    if (units) {
        query.units = units;
    }
    if (lat && long) {
        query.lat = lat;
        query.lon = long;
    }
    if (country) {
        query.country = country;
    }

    try {
        const response = await http.get('', { params: query });
        return NextResponse.json({
            lat: response.data?.coord?.lat,
            lon: response.data?.coord?.lon,
            temp: response.data?.main?.temp,
            temp_feels_like: response.data?.main?.feels_like,
            city_name: response.data?.name,
            country: response.data?.sys?.country,
            weather_description: response.data?.weather[0]?.description,
        });
    } catch (error) {
        console.error('Error fetching weather:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Unable to fetch weather data' }, { status: 500 });
    }
}