// Funktion zum Parsen von Datumsangaben im Format dd.mm.yyyy
function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
  }
  
  // Funktion zum Umrechnen von Grad in Bogenmaß
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Haversine-Formel zur Berechnung der Entfernung zwischen zwei Punkten in Kilometern
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in Kilometern
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  // Funktion zur Berechnung der zurückgelegten Kilometer
  export function calculateTotalDistance(data, homeCoordinates) {
    let totalDistance = 0;
  
    // Start von Zuhause zum ersten Ort
    totalDistance += haversineDistance(homeCoordinates[0], homeCoordinates[1], data[0][4], data[0][5]);
  
    // Entfernungen zwischen den aufeinanderfolgenden Orten
    for (let i = 1; i < data.length; i++) {
      const [, , , , lat1, lon1] = data[i - 1];
      const [, , , , lat2, lon2] = data[i];
      totalDistance += haversineDistance(lat1, lon1, lat2, lon2);
    }
  
    // Rückkehr vom letzten Ort nach Hause
    const lastPlace = data[data.length - 1];
    totalDistance += haversineDistance(lastPlace[4], lastPlace[5], homeCoordinates[0], homeCoordinates[1]);
  
    return totalDistance;
  }
  
  // Beispielaufruf mit Kommentierung der Beispieldaten und Koordinaten des Zuhauses
  /*
  const exampleData = [
    ["Camping am Rhein", "Kaiseraugst", "20.07.2018", "22.07.2018", 47.5405, 7.7317],
    ["Dany's Camping", "Lütschental", "27.07.2018", "29.07.2018", 46.6369, 7.9309],
    ["Camping de Portalban", "Portalban", "03.08.2018", "04.08.2018", 46.9211, 6.9531],
    ["Alpincamping Klösterle", "Klösterle", "04.08.2018", "06.08.2018", 47.1311, 10.0847],
    ["Camping Hochzillertal", "Kaltenbach", "06.08.2018", "07.08.2018", 47.2969, 11.8751],
    ["Camping Mayrhofen", "Mayrhofen", "07.08.2018", "10.08.2018", 47.1756, 11.8709],
    ["Camping Giessenpark", "Bad Ragaz", "10.08.2018", "11.08.2018", 47.0058, 9.5037]
  ];
  
  const homeCoordinates = [47.33891, 8.05069];
  const totalDistance = calculateTotalDistance(exampleData, homeCoordinates);
  
  console.log(`Zurückgelegte Strecke: ${totalDistance.toFixed(2)} km`);
  */
  