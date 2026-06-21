import {
  fetchPartnerTransferLocations,
  filterDestinations,
  type PartnerTransferDestination,
} from "../../shared/partnerLocationsService";

export type MapLocation = {
  name: string;
  placeId: string;
  latitude: number | null;
  longitude: number | null;
  street?: string;
  city?: string;
  postalCode?: string;
  country: string;
  airportCode?: string;
  isAirport: boolean;
};

function destinationToMapLocation(dest: PartnerTransferDestination): MapLocation {
  return {
    name: dest.displayName,
    placeId: dest.id,
    latitude: null,
    longitude: null,
    city: dest.city || dest.area,
    country: dest.country,
    isAirport: false,
  };
}

export async function searchDetailedLocation(
  setLoading: (loading: boolean) => void,
  input: string,
  _countryCode?: string,
): Promise<MapLocation[]> {
  try {
    setLoading(true);
    const catalog = await fetchPartnerTransferLocations();
    const matched = filterDestinations(catalog.destinations, input);
    return matched.map(destinationToMapLocation);
  } catch {
    return [];
  } finally {
    setLoading(false);
  }
}
