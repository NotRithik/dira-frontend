export const atomPriceData = [
  { date: '2023-01-01', price: 9.5 },
  { date: '2023-01-02', price: 10.2 },
  { date: '2023-01-03', price: 11.8 },
  { date: '2023-01-04', price: 10.5 },
  { date: '2023-01-05', price: 12.3 },
  { date: '2023-01-06', price: 11.1 },
  { date: '2023-01-07', price: 13.7 },
  { date: '2023-01-08', price: 12.9 },
  { date: '2023-01-09', price: 14.5 },
  { date: '2023-01-10', price: 13.2 },
  { date: '2023-01-11', price: 15.8 },
  { date: '2023-01-12', price: 14.6 },
  { date: '2023-01-13', price: 16.9 },
  { date: '2023-01-14', price: 15.3 },
  { date: '2023-01-15', price: 17.2 },
];

export const getCurrentAtomPrice = (): number => {
  return atomPriceData[atomPriceData.length - 1].price;
};

