// Pixel positions on the supplied 1024 × 1536 illustration, not geographic coordinates.
const locations = [
  { names: ['ha-giang'], x: 361, y: 58 },
  { names: ['sa-pa', 'sapa'], x: 217, y: 115 },
  { names: ['ha-noi', 'hanoi'], x: 397, y: 223 },
  { names: ['vinh-ha-long', 'ha-long', 'ha-long-bay'], x: 620, y: 250 },
  { names: ['ninh-binh'], x: 406, y: 338 },
  { names: ['phong-nha-ke-bang', 'phong-nha'], x: 475, y: 578 },
  { names: ['hue'], x: 573, y: 659 },
  { names: ['da-nang'], x: 620, y: 703 },
  { names: ['hoi-an'], x: 698, y: 767 },
  { names: ['nha-trang'], x: 690, y: 963 },
  { names: ['da-lat', 'dalat'], x: 577, y: 1017 },
  { names: ['thanh-pho-ho-chi-minh', 'tp-ho-chi-minh', 'ho-chi-minh-city', 'ho-chi-minh'], x: 481, y: 1174 },
  { names: ['phu-quoc'], x: 117, y: 1213 },
  { names: ['can-tho'], x: 337, y: 1258 },
  { names: ['con-dao'], x: 482, y: 1438 },
];

const keyOf = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]/g, '');
const positions = new Map(locations.flatMap(location => location.names.map(name => [keyOf(name), location])));

export function destinationMapPosition(destination) {
  const position = positions.get(keyOf(destination.slug))
    ?? positions.get(keyOf(destination.nameVi))
    ?? positions.get(keyOf(destination.nameEn));
  return position ? { x: position.x / 1024 * 100, y: position.y / 1536 * 100 } : null;
}

export function mappedDestinations(destinations) {
  return destinations.filter(destination => destination.status === 'PUBLISHED')
    .flatMap(destination => {
      const position = destinationMapPosition(destination);
      return position ? [{ destination, ...position }] : [];
    });
}
