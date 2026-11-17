/** Veriden URL doğrulama kataloğu (keşif durumu için). */
import { apartmentTypes, roomOrder } from '../data/apartments.js';
import { amenityGroups } from '../data/amenities.js';
import { lines, floorNumberTop } from '../data/exterior.js';

export function buildCatalog() {
  const floors = [];
  for (let i = 0; i < lines.length - 1; i++) floors.push(floorNumberTop - i);
  const types = {};
  for (const t of apartmentTypes) {
    types[t.id] = {};
    for (const r of roomOrder) types[t.id][r] = t.rooms[r].views.map((v) => v.id);
  }
  const groups = {};
  for (const g of amenityGroups) groups[g.id] = [...g.items];
  return { floors, types, groups };
}
