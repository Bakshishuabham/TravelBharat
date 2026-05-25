const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

dotenv.config();

const State = require('./models/State');
const City = require('./models/City');
const Category = require('./models/Category');
const Place = require('./models/Place');
const User = require('./models/User');

const states = [
  { name: 'Rajasthan', code: 'RJ', region: 'North', capital: 'Jaipur', description: 'The Land of Kings – famous for its majestic forts, golden deserts, and vibrant culture.', image: '/images/rajasthan.jpg' },
  { name: 'Kerala', code: 'KL', region: 'South', capital: 'Thiruvananthapuram', description: "God's Own Country – blessed with serene backwaters, lush greenery, and pristine beaches.", image: '/images/kerala.jpg' },
  { name: 'Uttar Pradesh', code: 'UP', region: 'North', capital: 'Lucknow', description: 'Heart of India – home to the Taj Mahal, Varanasi ghats, and ancient civilisations.', image: '/images/uttar-pradesh.jpg' },
  { name: 'Goa', code: 'GA', region: 'West', capital: 'Panaji', description: 'India\'s beach paradise – golden sands, Portuguese heritage, and vibrant nightlife.', image: '/images/goa.jpg' },
  { name: 'Himachal Pradesh', code: 'HP', region: 'North', capital: 'Shimla', description: 'The land of snow-capped peaks, apple orchards, and thrilling adventure sports.', image: '/images/himachal-pradesh.jpg' },
  { name: 'Tamil Nadu', code: 'TN', region: 'South', capital: 'Chennai', description: 'Temple state of India – ancient Dravidian culture, grand temples, and coastal beauty.', image: '/images/tamil-nadu.jpg' },
  { name: 'Maharashtra', code: 'MH', region: 'West', capital: 'Mumbai', description: 'The financial capital and home of Bollywood, diverse culture, and historical monuments.', image: '/images/maharashtra.jpg' },
  { name: 'Uttarakhand', code: 'UK', region: 'North', capital: 'Dehradun', description: 'Devbhoomi – known for Hindu pilgrimage sites and the majestic Himalayas.', image: '/images/uttrakhand.jpg' },
  { name: 'West Bengal', code: 'WB', region: 'East', capital: 'Kolkata', description: 'Cultural capital of India, rich in literature, arts, and sweet delicacies.', image: '/images/west-bengal.jpg' },
  { name: 'Karnataka', code: 'KA', region: 'South', capital: 'Bengaluru', description: 'Blend of modern tech hubs and ancient temples like Hampi.', image: '/images/karnataka.jpg' },
  { name: 'Delhi', code: 'DL', region: 'Union Territory', capital: 'New Delhi', description: 'The capital territory, brimming with history, politics, and amazing street food.', image: '/images/delhi.jpg' },
  { name: 'Puducherry', code: 'PY', region: 'Union Territory', capital: 'Pondicherry', description: 'French colonial settlement with beautiful promenades and spiritual ashrams.', image: '/images/pondicherry.jpg' },
];

const categories = [
  { name: 'Heritage', slug: 'heritage', description: 'Historical monuments and ancient sites', icon: '🏛️', color: '#C9A84C' },
  { name: 'Nature', slug: 'nature', description: 'Natural landscapes and scenic beauty', icon: '🌿', color: '#228B22' },
  { name: 'Religious', slug: 'religious', description: 'Temples, mosques, churches and sacred sites', icon: '🕌', color: '#8B4513' },
  { name: 'Adventure', slug: 'adventure', description: 'Thrilling outdoor activities and sports', icon: '🏔️', color: '#1E90FF' },
  { name: 'Beach', slug: 'beach', description: 'Coastal destinations and beach resorts', icon: '🏖️', color: '#FF6B35' },
  { name: 'Hill Station', slug: 'hill-station', description: 'Mountain retreats and cool hill stations', icon: '⛰️', color: '#6A5ACD' },
  { name: 'Wildlife', slug: 'wildlife', description: 'National parks and wildlife sanctuaries', icon: '🐯', color: '#FF8C00' },
  { name: 'Cultural', slug: 'cultural', description: 'Arts, crafts, festivals and local culture', icon: '🎭', color: '#DC143C' },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...'.cyan);
};

const seedDB = async () => {
  await connectDB();

  // Clear all collections
  await Promise.all([
    State.deleteMany(),
    City.deleteMany(),
    Category.deleteMany(),
    Place.deleteMany(),
    User.deleteMany(),
  ]);
  console.log('Collections cleared'.yellow);

  // Insert states & categories
  const insertedStates = await State.insertMany(states);
  const insertedCategories = await Category.insertMany(categories);
  console.log(`${insertedStates.length} states seeded`.green);
  console.log(`${insertedCategories.length} categories seeded`.green);

  // Map state names to IDs
  const stateMap = {};
  insertedStates.forEach(s => { stateMap[s.name] = s._id; });

  // Cities
  const citiesData = [
    { name: 'Jaipur', stateId: stateMap['Rajasthan'], description: 'The Pink City', image: '/images/hawa-mahal.jpg' },
    { name: 'Udaipur', stateId: stateMap['Rajasthan'], description: 'City of Lakes', image: '/images/lake-pichola.jpg' },
    { name: 'Jodhpur', stateId: stateMap['Rajasthan'], description: 'Blue City', image: '/images/mehrangarh-fort.jpg' },
    { name: 'Jaisalmer', stateId: stateMap['Rajasthan'], description: 'Golden City', image: '/images/jaisalmer-fort.jpg' },
    { name: 'Alleppey', stateId: stateMap['Kerala'], description: 'Venice of the East', image: '/images/alleppey-backwaters.jpg' },
    { name: 'Munnar', stateId: stateMap['Kerala'], description: 'Tea Garden City', image: '/images/munnar-tea-garden.jpg' },
    { name: 'Kochi', stateId: stateMap['Kerala'], description: 'Queen of the Arabian Sea', image: '/images/kerala.jpg' },
    { name: 'Agra', stateId: stateMap['Uttar Pradesh'], description: 'City of Taj Mahal', image: '/images/taj-mahal.jpeg' },
    { name: 'Varanasi', stateId: stateMap['Uttar Pradesh'], description: 'Spiritual Capital', image: '/images/varanasi-ghat.jpg' },
    { name: 'Mathura', stateId: stateMap['Uttar Pradesh'], description: 'Birthplace of Krishna', image: '/images/uttar-pradesh.jpg' },
    { name: 'Panaji', stateId: stateMap['Goa'], description: 'Capital of Goa', image: '/images/goa.jpg' },
    { name: 'Calangute', stateId: stateMap['Goa'], description: 'Queen of Beaches', image: '/images/calangute-beach.jpg' },
    { name: 'Shimla', stateId: stateMap['Himachal Pradesh'], description: 'Queen of Hills', image: '/images/shimla-mall-road.jpg' },
    { name: 'Manali', stateId: stateMap['Himachal Pradesh'], description: 'Valley of Gods', image: '/images/rohtang-pass.jpg' },
    { name: 'Chennai', stateId: stateMap['Tamil Nadu'], description: 'Gateway of South India', image: '/images/marina-beach.jpg' },
    { name: 'Madurai', stateId: stateMap['Tamil Nadu'], description: 'Temple City', image: '/images/meenakshi-amman-temple.jpg' },
    { name: 'Mumbai', stateId: stateMap['Maharashtra'], description: 'City of Dreams', image: '/images/gateway-of-India.jpg' },
    { name: 'Pune', stateId: stateMap['Maharashtra'], description: 'Oxford of the East', image: '/images/maharashtra.jpg' },
    { name: 'Dehradun', stateId: stateMap['Uttarakhand'], description: 'Doon Valley', image: '/images/uttrakhand.jpg' },
    { name: 'Rishikesh', stateId: stateMap['Uttarakhand'], description: 'Yoga Capital', image: '/images/uttrakhand.jpg' },
    { name: 'Kolkata', stateId: stateMap['West Bengal'], description: 'City of Joy', image: '/images/victoria-memorial.jpg' },
    { name: 'Darjeeling', stateId: stateMap['West Bengal'], description: 'Queen of the Himalayas', image: '/images/west-bengal.jpg' },
    { name: 'Bengaluru', stateId: stateMap['Karnataka'], description: 'Silicon Valley of India', image: '/images/karnataka.jpg' },
    { name: 'Mysore', stateId: stateMap['Karnataka'], description: 'City of Palaces', image: '/images/mysore-palace.jpg' },
    { name: 'New Delhi', stateId: stateMap['Delhi'], description: 'Capital City', image: '/images/red-fort.jpg' },
    { name: 'Pondicherry', stateId: stateMap['Puducherry'], description: 'French Riviera of the East', image: '/images/promenade-beach.jpg' },
  ];

  const insertedCities = await City.insertMany(citiesData);
  console.log(`${insertedCities.length} cities seeded`.green);

  const cityMap = {};
  insertedCities.forEach(c => { cityMap[c.name] = c._id; });

  // Places
  const placesData = [
    {
      name: 'Amber Fort',
      stateId: stateMap['Rajasthan'], cityId: cityMap['Jaipur'], category: 'Heritage',
      description: 'Amber Fort is a majestic hilltop fortress built by Raja Man Singh I in 1592. Its stunning blend of Hindu and Rajput architecture features intricate mirror work, marble, and sandstone. The fort overlooks Maota Lake and offers breathtaking views of Jaipur.',
      historicalSignificance: 'Built in 1592 by Raja Man Singh I, it served as the royal residence of the Rajput Maharajas.',
      bestTimeToVisit: 'October to March', entryFee: '₹200 (Indians), ₹500 (Foreigners)', timings: '8:00 AM – 5:30 PM (Daily)',
      nearbyAttractions: ['Jaigarh Fort', 'Nahargarh Fort', 'Jal Mahal'], location: 'https://maps.google.com/?q=Amber+Fort+Jaipur',
      images: ['/images/amber-fort.jpg', '/images/hawa-mahal.jpg'],
      isFeatured: true, rating: 4.8,
    },
    {
      name: 'Hawa Mahal',
      stateId: stateMap['Rajasthan'], cityId: cityMap['Jaipur'], category: 'Heritage',
      description: 'The "Palace of Winds" is an iconic pink sandstone palace with 953 small windows (jharokhas) decorated with intricate latticework. Built in 1799 by Maharaja Sawai Pratap Singh, it allowed royal ladies to observe street festivals without being seen.',
      historicalSignificance: 'Constructed in 1799 as an extension of the City Palace for royal women to observe street life in purdah.',
      bestTimeToVisit: 'October to March', entryFee: '₹50 (Indians), ₹200 (Foreigners)', timings: '9:00 AM – 4:30 PM (Daily)',
      nearbyAttractions: ['City Palace', 'Jantar Mantar', 'Johari Bazaar'], location: 'https://maps.google.com/?q=Hawa+Mahal+Jaipur',
      images: ['/images/hawa-mahal.jpg', '/images/amber-fort.jpg'],
      isFeatured: true, rating: 4.7,
    },
    {
      name: 'Lake Pichola',
      stateId: stateMap['Rajasthan'], cityId: cityMap['Udaipur'], category: 'Nature',
      description: 'Lake Pichola is an artificial fresh water lake created in 1362 AD. The lake contains two islands – Jag Niwas (Lake Palace) and Jag Mandir. Boat rides on the lake offer stunning views of the surrounding palaces and Aravalli hills.',
      historicalSignificance: 'Created in 1362 AD during the reign of Maharana Lakha, later expanded by Udai Singh II.',
      bestTimeToVisit: 'October to March', entryFee: '₹400 (Boat Ride)', timings: 'Sunrise to Sunset',
      nearbyAttractions: ['City Palace Udaipur', 'Jag Mandir', 'Bagore Ki Haveli'], location: 'https://maps.google.com/?q=Lake+Pichola+Udaipur',
      images: ['/images/lake-pichola.jpg', '/images/rajasthan.jpg'],
      isFeatured: true, rating: 4.9,
    },
    {
      name: 'Mehrangarh Fort',
      stateId: stateMap['Rajasthan'], cityId: cityMap['Jodhpur'], category: 'Heritage',
      description: 'Rising 400 feet above Jodhpur, Mehrangarh Fort is one of the largest forts in India. Founded in 1459 by Rao Jodha, it houses magnificent palaces with intricate carvings and a world-class museum displaying royal artifacts.',
      historicalSignificance: 'Built in 1459 by Rao Jodha, the founder of Jodhpur, it has never been conquered in battle.',
      bestTimeToVisit: 'October to February', entryFee: '₹100 (Indians), ₹600 (Foreigners)', timings: '9:00 AM – 5:00 PM (Daily)',
      nearbyAttractions: ['Jaswant Thada', 'Umaid Bhawan Palace', 'Clock Tower'], location: 'https://maps.google.com/?q=Mehrangarh+Fort+Jodhpur',
      images: ['/images/mehrangarh-fort.jpg', '/images/rajasthan.jpg'],
      isFeatured: false, rating: 4.8,
    },
    {
      name: 'Jaisalmer Fort',
      stateId: stateMap['Rajasthan'], cityId: cityMap['Jaisalmer'], category: 'Heritage',
      description: 'Known as Sonar Quila (Golden Fort), Jaisalmer Fort rises from the Thar Desert like a mirage. Built in 1156 AD, it is a living fort with shops, restaurants, and homes inside its golden sandstone walls.',
      historicalSignificance: 'Built in 1156 AD by Rawal Jaisal, it is one of the few living forts in the world.',
      bestTimeToVisit: 'November to February', entryFee: '₹100 (Indians), ₹250 (Foreigners)', timings: '6:00 AM – 6:00 PM (Daily)',
      nearbyAttractions: ['Sam Sand Dunes', 'Patwon ki Haveli', 'Gadisar Lake'], location: 'https://maps.google.com/?q=Jaisalmer+Fort',
      images: ['/images/jaisalmer-fort.jpg', '/images/rajasthan.jpg'],
      isFeatured: false, rating: 4.6,
    },
    {
      name: 'Alleppey Backwaters',
      stateId: stateMap['Kerala'], cityId: cityMap['Alleppey'], category: 'Nature',
      description: 'The Alleppey backwaters are a network of lagoons, lakes, rivers, and canals stretching along the coast. Houseboat cruises through these serene waterways are among India\'s most unique travel experiences, passing through coconut groves and paddy fields.',
      historicalSignificance: 'The backwater network was historically used for trade and transport by local communities.',
      bestTimeToVisit: 'November to February', entryFee: '₹6,000–₹15,000 (Houseboat/night)', timings: 'All day',
      nearbyAttractions: ['Kumarakom Bird Sanctuary', 'Marari Beach', 'Krishnapuram Palace'], location: 'https://maps.google.com/?q=Alleppey+Backwaters+Kerala',
      images: ['/images/alleppey-backwaters.jpg', '/images/kerala.jpg'],
      isFeatured: true, rating: 4.9,
    },
    {
      name: 'Munnar Tea Gardens',
      stateId: stateMap['Kerala'], cityId: cityMap['Munnar'], category: 'Nature',
      description: 'Munnar is famous for its sprawling tea plantations covering rolling hills at elevations of 1,500–2,695 metres. The verdant green valleys, misty mountains, and cool climate make it one of Kerala\'s most scenic hill stations.',
      historicalSignificance: 'Tea cultivation was introduced during the British era; Munnar was a popular retreat for British colonists.',
      bestTimeToVisit: 'September to May', entryFee: 'Free (Tea Museum: ₹75)', timings: 'All day',
      nearbyAttractions: ['Eravikulam National Park', 'Top Station', 'Mattupetty Dam'], location: 'https://maps.google.com/?q=Munnar+Tea+Gardens',
      images: ['/images/munnar-tea-garden.jpg', '/images/kerala.jpg'],
      isFeatured: false, rating: 4.7,
    },
    {
      name: 'Taj Mahal',
      stateId: stateMap['Uttar Pradesh'], cityId: cityMap['Agra'], category: 'Heritage',
      description: 'The Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this ivory-white marble mausoleum is the epitome of Mughal architecture.',
      historicalSignificance: 'Built between 1632–1653 by Emperor Shah Jahan as a tribute to his wife Mumtaz Mahal. Designated a UNESCO World Heritage Site in 1983.',
      bestTimeToVisit: 'October to March', entryFee: '₹250 (Indians), ₹1,300 (Foreigners)', timings: '6:00 AM – 6:30 PM (Closed Friday)',
      nearbyAttractions: ['Agra Fort', 'Fatehpur Sikri', 'Itmad-ud-Daula'], location: 'https://maps.google.com/?q=Taj+Mahal+Agra',
      images: ['/images/taj-mahal.jpeg', '/images/uttar-pradesh.jpg'],
      isFeatured: true, rating: 5.0,
    },
    {
      name: 'Varanasi Ghats',
      stateId: stateMap['Uttar Pradesh'], cityId: cityMap['Varanasi'], category: 'Religious',
      description: 'Varanasi, the oldest living city in the world, has 84 ghats along the sacred Ganges River. The evening Ganga Aarti at Dashashwamedh Ghat is one of India\'s most spiritually profound rituals. The city is central to Hindu, Buddhist, and Jain traditions.',
      historicalSignificance: 'One of the world\'s oldest continuously inhabited cities, mentioned in ancient Vedic texts; considered sacred by multiple religions.',
      bestTimeToVisit: 'October to March', entryFee: 'Free (Boat ride: ₹200–₹500)', timings: '24 hours (Aarti at sunrise/sunset)',
      nearbyAttractions: ['Kashi Vishwanath Temple', 'Sarnath', 'Ramnagar Fort'], location: 'https://maps.google.com/?q=Dashashwamedh+Ghat+Varanasi',
      images: ['/images/varanasi-ghat.jpg', '/images/uttar-pradesh.jpg'],
      isFeatured: true, rating: 4.8,
    },
    {
      name: 'Calangute Beach',
      stateId: stateMap['Goa'], cityId: cityMap['Calangute'], category: 'Beach',
      description: 'Calangute Beach, known as the "Queen of Beaches," is the largest beach in North Goa. Its golden sands, water sports, beach shacks, and vibrant nightlife make it a favourite among both domestic and international tourists.',
      historicalSignificance: 'Calangute was frequented by hippies in the 1960s–70s, giving Goa its bohemian reputation.',
      bestTimeToVisit: 'November to February', entryFee: 'Free (Water sports: ₹500–₹2,000)', timings: 'All day',
      nearbyAttractions: ['Baga Beach', 'Anjuna Flea Market', 'Fort Aguada'], location: 'https://maps.google.com/?q=Calangute+Beach+Goa',
      images: ['/images/calangute-beach.jpg', '/images/goa.jpg'],
      isFeatured: true, rating: 4.5,
    },
    {
      name: 'Fort Aguada',
      stateId: stateMap['Goa'], cityId: cityMap['Panaji'], category: 'Heritage',
      description: 'Fort Aguada is a well-preserved Portuguese fort built in 1612 on the confluence of the Mandovi River and the Arabian Sea. The fort has a lighthouse dating to 1864 and offers panoramic views of the coastline.',
      historicalSignificance: 'Built by the Portuguese in 1612 to guard against Dutch and Maratha invasions; one of the most prominent forts in Goa.',
      bestTimeToVisit: 'November to March', entryFee: '₹30 (Indians)', timings: '9:30 AM – 6:00 PM (Daily)',
      nearbyAttractions: ['Calangute Beach', 'Candolim Beach', 'Chapora Fort'], location: 'https://maps.google.com/?q=Fort+Aguada+Goa',
      images: ['/images/fort-aguada.jpg', '/images/goa.jpg'],
      isFeatured: false, rating: 4.4,
    },
    {
      name: 'Rohtang Pass',
      stateId: stateMap['Himachal Pradesh'], cityId: cityMap['Manali'], category: 'Adventure',
      description: 'Rohtang Pass at 3,978 metres is a high mountain pass on the eastern Pir Panjal Range. It offers stunning views of glaciers, peaks, and valleys. Popular for snow activities, it connects Manali to Lahaul-Spiti.',
      historicalSignificance: 'Historically the main trade route between Kullu Valley and Lahaul-Spiti.',
      bestTimeToVisit: 'May to October', entryFee: '₹550 (Permit fee)', timings: '8:00 AM – 5:00 PM',
      nearbyAttractions: ['Solang Valley', 'Beas Kund', 'Hampta Pass'], location: 'https://maps.google.com/?q=Rohtang+Pass+Manali',
      images: ['/images/rohtang-pass.jpg', '/images/himachal-pradesh.jpg'],
      isFeatured: true, rating: 4.6,
    },
    {
      name: 'Shimla Mall Road',
      stateId: stateMap['Himachal Pradesh'], cityId: cityMap['Shimla'], category: 'Hill Station',
      description: 'The Mall Road is the main street of Shimla lined with colonial-era buildings, shops, restaurants, and the famous Christ Church. It was the summer capital of British India and retains a charming Victorian atmosphere.',
      historicalSignificance: 'Shimla served as the summer capital of British India from 1864; Mall Road was the social hub of colonial administrators.',
      bestTimeToVisit: 'October to June', entryFee: 'Free', timings: 'All day',
      nearbyAttractions: ['Jakhu Temple', 'Kufri', 'Chadwick Falls'], location: 'https://maps.google.com/?q=Mall+Road+Shimla',
      images: ['/images/shimla-mall-road.jpg', '/images/himachal-pradesh.jpg'],
      isFeatured: false, rating: 4.3,
    },
    {
      name: 'Meenakshi Amman Temple',
      stateId: stateMap['Tamil Nadu'], cityId: cityMap['Madurai'], category: 'Religious',
      description: 'The Meenakshi Amman Temple is a historic Hindu temple dedicated to Goddess Meenakshi. Its towering gopurams (gateway towers) adorned with thousands of colourful sculptures are a masterpiece of Dravidian architecture.',
      historicalSignificance: 'Originally built by Kulasekara Pandya (6th–9th centuries), the temple underwent major construction by Nayak rulers in the 16th–17th centuries.',
      bestTimeToVisit: 'October to March', entryFee: 'Free (Camera: ₹50)', timings: '5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM',
      nearbyAttractions: ['Thirumalai Nayakkar Palace', 'Gandhi Museum', 'Alagar Kovil'], location: 'https://maps.google.com/?q=Meenakshi+Temple+Madurai',
      images: ['/images/meenakshi-amman-temple.jpg', '/images/tamil-nadu.jpg'],
      isFeatured: true, rating: 4.9,
    },
    {
      name: 'Marina Beach',
      stateId: stateMap['Tamil Nadu'], cityId: cityMap['Chennai'], category: 'Beach',
      description: 'Marina Beach in Chennai is the longest natural urban beach in India and the second longest in the world at 13 km. It is a beloved public space where thousands gather daily for morning walks, street food, and sunset views.',
      historicalSignificance: 'Developed during British rule; several statues of Tamil leaders and freedom fighters line the beach.',
      bestTimeToVisit: 'November to February', entryFee: 'Free', timings: 'All day (Swimming restricted)',
      nearbyAttractions: ['Fort St. George', 'Kapaleeshwarar Temple', 'San Thome Cathedral'], location: 'https://maps.google.com/?q=Marina+Beach+Chennai',
      images: ['/images/marina-beach.jpg', '/images/tamil-nadu.jpg'],
      isFeatured: false, rating: 4.4,
    },
    {
      name: 'Gateway of India', stateId: stateMap['Maharashtra'], cityId: cityMap['Mumbai'], category: 'Heritage',
      description: 'The Gateway of India is an arch-monument built in the early 20th century to commemorate the landing of King-Emperor George V. It overlooks the Arabian Sea and is Mumbai\'s most famous landmark.',
      bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24 hours',
      location: 'https://maps.google.com/?q=Gateway+of+India',
      images: ['/images/gateway-of-India.jpg', '/images/maharashtra.jpg'],
      isFeatured: true, rating: 4.6,
    },
    {
      name: 'Mysore Palace', stateId: stateMap['Karnataka'], cityId: cityMap['Mysore'], category: 'Heritage',
      description: 'The Mysore Palace is a historical palace and a royal residence. It is one of the most famous tourist attractions in India after the Taj Mahal, known for its incredible Indo-Saracenic architecture.',
      bestTimeToVisit: 'October to March', entryFee: '₹100 (Indians)', timings: '10:00 AM – 5:30 PM',
      location: 'https://maps.google.com/?q=Mysore+Palace',
      images: ['/images/mysore-palace.jpg', '/images/karnataka.jpg'],
      isFeatured: true, rating: 4.8,
    },
    {
      name: 'Red Fort', stateId: stateMap['Delhi'], cityId: cityMap['New Delhi'], category: 'Heritage',
      description: 'The Red Fort is a historic fort in the city of Delhi that served as the main residence of the Mughal Emperors. Every year on Independence Day, the Prime Minister hoists the national flag here.',
      bestTimeToVisit: 'October to March', entryFee: '₹35 (Indians)', timings: '9:30 AM – 4:30 PM (Closed Monday)',
      location: 'https://maps.google.com/?q=Red+Fort+Delhi',
      images: ['/images/red-fort.jpg', '/images/delhi.jpg'],
      isFeatured: true, rating: 4.7,
    },
    {
      name: 'Victoria Memorial', stateId: stateMap['West Bengal'], cityId: cityMap['Kolkata'], category: 'Heritage',
      description: 'The Victoria Memorial is a large marble building in Central Kolkata, built between 1906 and 1921. It is dedicated to the memory of Queen Victoria and is now a museum under the Ministry of Culture.',
      bestTimeToVisit: 'October to March', entryFee: '₹30 (Indians)', timings: '10:00 AM – 5:00 PM (Closed Monday)',
      location: 'https://maps.google.com/?q=Victoria+Memorial+Kolkata',
      images: ['/images/victoria-memorial.jpg', '/images/west-bengal.jpg'],
      isFeatured: false, rating: 4.6,
    },
    {
      name: 'Promenade Beach', stateId: stateMap['Puducherry'], cityId: cityMap['Pondicherry'], category: 'Beach',
      description: 'A popular stretch of beachfront in the city of Puducherry, along the Bay of Bengal. It is a 1.2-kilometre-long stretch, starting from War Memorial and ending at Dupleix Park.',
      bestTimeToVisit: 'October to March', entryFee: 'Free', timings: '24 hours',
      location: 'https://maps.google.com/?q=Promenade+Beach',
      images: ['/images/promenade-beach.jpg', '/images/pondicherry.jpg'],
      isFeatured: false, rating: 4.5,
    },
  ];

  // Insert places
  for (const placeData of placesData) {
    const place = new Place(placeData);
    await place.save();
  }
  console.log(`${placesData.length} places seeded`.green);

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);
  await User.create({
    name: 'TravelBharat Admin',
    email: process.env.ADMIN_EMAIL || 'admin@travelbharat.com',
    password: adminPassword,
    role: 'admin',
  });
  console.log('Admin user created'.green);
  console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@travelbharat.com'}`.cyan);
  console.log(`  Password: ${adminPassword}`.cyan);

  console.log('\n✅ Database seeded successfully!'.green.bold);
  process.exit(0);
};

seedDB().catch((err) => {
  console.error(`Seed Error: ${err.message}`.red.bold);
  process.exit(1);
});
