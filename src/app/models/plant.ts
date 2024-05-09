export interface Plant {
  id: number;
  created_time: Date;
  location: PlantLocation;
  species: PlantSpecies;
}

export interface PlantSpecies {
  id: number;
  name: string;
  commonnames: string[];
}

export interface PlantLocation {
  lat: number;
  lng: number;
}
