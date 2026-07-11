import instance from "../../utils/axiosConfig";

export type PartnerStayLocation = {
  country: string;
  adminLevel1: string;
  city: string;
  listingCount: number;
  areas: string[];
  displayName: string;
};

export type PartnerTransferPickup = {
  id: string;
  type: string;
  city: string;
  area: string;
  country: string;
  listingCount: number;
  displayName: string;
};

export type PartnerTransferDestination = {
  id: string;
  type: string;
  city: string;
  area: string;
  subArea: string;
  country: string;
  listingCount: number;
  displayName: string;
};

export type PartnerStayLocations = {
  kind: "stays";
  locations: PartnerStayLocation[];
};

export type PartnerTransferLocations = {
  kind: "transfers";
  pickups: PartnerTransferPickup[];
  destinations: PartnerTransferDestination[];
};

const base = (instance.defaults.baseURL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

let _staysCache: PartnerStayLocations | null = null;
let _transfersCache: PartnerTransferLocations | null = null;

export async function fetchPartnerStayLocations(): Promise<PartnerStayLocations> {
  if (_staysCache) return _staysCache;
  const response = await instance.get<PartnerStayLocations>(`${base}/v1/public/locations`, {
    params: { kind: "stays" },
  });
  if (Array.isArray(response.data?.locations) && response.data.locations.length > 0) {
    _staysCache = response.data;
  }
  return response.data;
}

export async function fetchPartnerTransferLocations(): Promise<PartnerTransferLocations> {
  if (_transfersCache) return _transfersCache;
  const response = await instance.get<PartnerTransferLocations>(`${base}/v1/public/locations`, {
    params: { kind: "transfers" },
  });
  if (Array.isArray(response.data?.pickups) || Array.isArray(response.data?.destinations)) {
    _transfersCache = response.data;
  }
  return response.data;
}

export function filterPickups(
  pickups: PartnerTransferPickup[],
  query: string,
): PartnerTransferPickup[] {
  const q = query.trim().toLowerCase();
  if (!q) return pickups;
  return pickups.filter((p) =>
    [p.displayName, p.city, p.area, p.country].some((f) =>
      f?.toLowerCase().includes(q),
    ),
  );
}

export function filterDestinations(
  destinations: PartnerTransferDestination[],
  query: string,
): PartnerTransferDestination[] {
  const q = query.trim().toLowerCase();
  if (!q) return destinations;
  return destinations.filter((d) =>
    [d.displayName, d.city, d.area, d.subArea, d.country].some((f) =>
      f?.toLowerCase().includes(q),
    ),
  );
}
