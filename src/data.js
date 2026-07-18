/* eiffel.coffee.roasters — lot data + reference info
   The two launch origins, straight from the bag labels. */

export const LOTS = [
  {
    id: 1,
    name: 'Guji Bule Hora',
    origin: 'Ethiopia',
    region: 'Bule Hora',
    producer: 'smallholder farms, Guji zone',
    process: 'natural',
    roast: 'light',
    roastLevel: 3,
    altitude: '1,800 – 2,200m',
    varietal: 'heirloom',
    score: 87.0,
    price: 21,
    weight: '250g',
    notes: ['prunes', 'raisins', 'stone fruits', "baker's chocolate", 'nougat'],
    flavors: { floral: 0.48, acid: 0.64, body: 0.68, sweet: 0.86, bitter: 0.30, aroma: 0.88 },
    story:
      'A natural from Bule Hora, in the Guji zone — dried whole in the cherry on raised beds. Dark dried fruit up front, prunes and raisins, softening into stone fruit, with a nougat sweetness and a baker’s-chocolate finish.',
    roasted: '2026.07.13',
    inStock: true,
    featured: true,
    color: 'sand',
    processLabel: 'natural',
    noteLines: ['prunes, raisins', 'stone fruits', "baker's chocolate, nougat"],
  },
  {
    id: 2,
    name: 'Excelso',
    origin: 'Colombia',
    region: 'Valle del Cauca',
    producer: 'smallholder farms, Valle del Cauca',
    process: 'washed',
    roast: 'medium',
    roastLevel: 5,
    altitude: '1,500 – 2,000m',
    varietal: 'typica, caturra, castillo',
    score: 84.5,
    price: 18,
    weight: '250g',
    notes: ['toffee', 'red fruit', 'cocoa nibs', 'caramel'],
    flavors: { floral: 0.26, acid: 0.58, body: 0.72, sweet: 0.88, bitter: 0.36, aroma: 0.62 },
    story:
      'Our everyday Colombian. Excelso-grade lots from smallholder farms across Valle del Cauca, fully washed. Toffee and caramel sweetness, a clean red-fruit acidity, cocoa nibs in the finish. Comfortable as filter, generous as espresso.',
    roasted: '2026.07.13',
    inStock: true,
    color: 'rust',
    processLabel: 'fully washed',
    noteLines: ['toffee', 'red fruit', 'cocoa nibs, caramel'],
  },
];

export const PROCESSES = ['all', 'washed', 'natural'];
export const ROASTS = ['all', 'light', 'medium'];
export const ORIGINS = ['all', 'Ethiopia', 'Colombia'];

export const GRINDS = [
  { id: 'whole', label: 'whole bean' },
  { id: 'espresso', label: 'espresso' },
  { id: 'v60', label: 'V60 / pour-over' },
  { id: 'aeropress', label: 'aeropress' },
  { id: 'french', label: 'french press' },
];

export const SUB_FREQ = [
  { id: 'weekly', label: 'every week', unit: '1×', desc: 'For households drinking 2+ cups a day. Freshest possible.' },
  { id: 'biweekly', label: 'every 2 weeks', unit: '2×', desc: 'The sweet spot. Most subscribers land here.' },
  { id: 'monthly', label: 'every month', unit: '4×', desc: 'For lighter drinkers or office sharing.' },
];

export const SUB_VOLUME = [
  { id: 'single', label: 'one bag', unit: '250g', desc: 'A single origin per shipment.', price: 19 },
  { id: 'duo', label: 'two bags', unit: '500g', desc: 'The washed + the natural, side-by-side.', price: 36 },
  { id: 'flight', label: 'four bags', unit: '1kg', desc: 'Double of each origin. For the serious household.', price: 68 },
];

export const SUB_PREF = [
  { id: 'pick', label: 'roaster’s pick', desc: 'We choose. Surprise you. Best for exploration.' },
  { id: 'choose', label: 'you choose', desc: 'Pick your own origins each shipment from current lots.' },
  { id: 'profile', label: 'flavor profile', desc: 'Tell us what you like; we match you to lots that fit.' },
];
