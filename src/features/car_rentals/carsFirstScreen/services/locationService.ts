
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

function parseDouble(value: any): number {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
}

function extractAirportCode(displayName?: string): string | undefined {
    if (!displayName) return undefined;
    const match = displayName.match(/\(([A-Z]{3})\)/); // e.g. "Lagos (LOS)"
    return match ? match[1] : undefined;
}

export async function searchDetailedLocation(
    setLoading: (loading: boolean) => void,
    input: string,
    countryCode?: string,

): Promise<MapLocation[]> {
    const key = input.trim().toLowerCase();
    if (cache[key]) return cache[key];

    try {
        setLoading(true)
        const params = new URLSearchParams({
            q: key,
            format: "json",
            addressdetails: "1",
            limit: "20",
            featuretype: "airport,settlement",
        });
        if (countryCode) params.append("countrycodes", countryCode);

        const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                "User-Agent": "TravelMateApp/1.0 (travelmate925@gmail.com)",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data: any[] = await response.json();
        if (data.length === 0) return [];

        const locations: MapLocation[] = data.map((item) => {
            const lat = item.lat
            const lon = item.lon
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
                    address.village?.toString(),
                postalCode: address.postcode?.toString(),
                country: (address.country_code?.toString() ?? "").toUpperCase(),
                airportCode: extractAirportCode(item.display_name?.toString()),
                isAirport: type === "aeroway" || category === "aerodrome",
            };
        });

        cache[key] = locations;
        return locations;
    } catch (e) {
        setLoading(false)
        console.error("Nominatim search failed:", e);
        return [];
    }
}
