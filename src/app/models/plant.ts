export interface Plant {
  id: number;
  location: PlantLocation;
  species: PlantSpecies;
}

export interface PlantSpecies {
  id: number;
  name: string;
  commonNames: string[];
}

export interface PlantLocation {
  lat: number;
  lng: number;
}
