export type MapLocation = {
    name: string;
    placeId: string;
    latitude: number;
    longitude: number;
    street?: string;
    city?: string;
    postalCode?: string;
    country: string;
    airportCode?: string;
    isAirport: boolean;
};

const cache: Record<string, MapLocation[]> = {};


function extractAirportCode(displayName?: string): string | undefined {
    if (!displayName) return undefined;
    const match = displayName.match(/\(([A-Z]{3})\)/); // e.g. "Lagos (LOS)"
    return match ? match[1] : undefined;
}

export async function searchDetailedLocation(
    setLoading: (loading: boolean) => void,
    input: string,
    countryCode?: string
): Promise<MapLocation[]> {
    const key = input.trim().toLowerCase();
    if (cache[key]) return cache[key];

    try {
        setLoading(true);
        const params = new URLSearchParams({
            q: key,
            format: "json",
            addressdetails: "1",
            limit: "20",
            featuretype: "airport,settlement",
        });
        if (countryCode) params.append("countrycodes", countryCode.toUpperCase());

        const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

        // Add a small delay to respect Nominatim's rate limit (1 request per second)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(url, {
            headers: {
                "User-Agent": "TravelMateApp/1.0 (travelmate925@gmail.com)",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data: any[] = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return [];
        }

        const locations: MapLocation[] = data.map((item) => {
            const lat = item.lat;
            const lon = item.lon;
            const address = item.address ?? {};
            const type = item.type ?? "";
            const category = item.category ?? "";

            return {
                name: item.display_name?.toString() ?? "Unknown",
                placeId: item.osm_id?.toString() ?? "",
                latitude: lat,
                longitude: lon,
                street: address.road?.toString() ?? address.pedestrian?.toString(),
                city:
                    address.city?.toString() ??
                    address.town?.toString() ??
                    address.village?.toString() ??
                    "",
                postalCode: address.postcode?.toString(),
                country: (address.country_code?.toString() ?? "").toUpperCase(),
                airportCode: extractAirportCode(item.display_name?.toString()),
                isAirport: type === "aeroway" || category === "aerodrome",
            };
        });

        cache[key] = locations;
        return locations;
    } catch (e) {
        console.error("Nominatim search failed:", e);
        return [];
    } finally {
        setLoading(false);
    }
}