export const SelectTravelerList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveler in exploration',
        icon:'🧳',
        people:'1 Person'
      },
      {
        id:2,
        title:'A Couple',
        desc:'Two travelers in tandem',
        icon:'👫',
        people:'2 People'
      },
      {
        id:3,
        title:'Family',
        desc:'A group of fun adventurers',
        icon:'👨‍👩‍👧‍👦',
        people:'3 to 5 People'
      },
      {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekers',
        icon:'✈️',
        people:'5 to 10 People'
      }
]

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💵', // Replace with your actual icon or image source
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep costs on the average',
    icon: '💳', // Replace with your actual icon or image source
  },
  {
    id: 3,
    title: 'Luxury',
    desc: "Don't worry about cost",
    icon: '💰', // Replace with your actual icon or image source
  },
];

export const AI_PROMPT='Generate Travel Plan for location: {location}, for {totalDays} Days and {totalNight} Night for {traveler} with a {budget} budget with a Flight details, Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and Places to visit nearby with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for {totalDay} days and {totalNight} night with each day plan with best time to visit in JSON format.'
