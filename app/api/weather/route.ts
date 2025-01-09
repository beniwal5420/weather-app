import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

// Create an Axios instance with a base URL from environment variables
const http = axios.create({
    baseURL: process.env.WEATHER_API_URL,
});

// API handler for GET requests
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    // Extract query parameters
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const long = searchParams.get("long");
    const country = searchParams.get("country");
    const units = searchParams.get("units") || 'metric'; // Default to metric

    // Initialize query parameters
    const query: Record<string, string> = {
        appid: process.env.WEATHER_API_KEY ?? '',
        units,
    };

    // Add location-based parameters
    if (city) query.q = city;
    if (lat && long) {
        query.lat = lat;
        query.lon = long;
    }
    if (country) query.country = country;

    try {
        // Fetch weather data from the API
        const response = await http.get('', { params: query });

        // Destructure the response data
        const {
            coord: { lat, lon } = {},
            main: { temp, feels_like: temp_feels_like } = {},
            sys: { country } = {},
            name: city_name,
            weather,
        } = response.data;

        // Return the relevant data in JSON format
        return NextResponse.json({
            lat,
            lon,
            temp,
            temp_feels_like,
            city_name,
            country,
            weather_description: weather?.[0]?.description,
        });
    } catch (error: any) {
        // Log the error details for debugging
        console.error('Error fetching weather:', error.response?.data || error.message);

        // Handle specific cases of error response
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Unable to fetch weather data';

        return NextResponse.json({ error: message }, { status });
    }
}
