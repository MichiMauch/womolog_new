// Funktion zum Parsen von Datumsangaben im Format dd.mm.yyyy
function parseDate(dateString) {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day); // month - 1, da Monate in JS von 0-11 sind
}

export function calculateStatistics(data) {
  const visitsPerYear = {};
  const visitsPerCountry = {};
  const visitsPerCountryISO3 = {};
  const countryPlaceCount = {};
  const uniqueCountries = new Set();
  const uniquePlacesGlobal = new Set(); // Globales Set für einzigartige Orte
  const titleCount = new Map(); // Map zur Verfolgung der Titelanzahl
  const visitsPerPlacePerCountry = {}; // Objekt zur Verfolgung der Besuche pro Ort pro Land
  const visitsPerPlacePerYear = {}; // Objekt zur Verfolgung der Besuche pro Ort pro Jahr
  const titleYears = new Map(); // Map zur Verfolgung der Jahre für jeden Titel
  const uniquePlacesByYear = new Map(); // Map zur Verfolgung der einzigartigen Orte pro Jahr
  const seasons = { Winter: 0, Frühling: 0, Sommer: 0, Herbst: 0 };
  const monthCount = Array(12).fill(0); // Zählt die Reisen pro Monat
  let totalVisits = 0; // Gesamtzahl der Besuche
  let totalNights = 0; // Gesamtzahl der Übernachtungen
  let totalPlaces = 0; // Gesamtzahl der Orte
  let longestTrip = 0; // Längste Reise ohne Lücken in Tagen
  let mostNights = { place: null, nights: 0 }; // Ort mit den meisten Übernachtungen
  let mostVisitedPlace = { place: null, visits: 0 }; // Am häufigsten besuchter Ort
  let longestPause = 0; // Längste Pause zwischen zwei Reisen in Tagen
  let lastTripEnd = null;

  // Sortiere die Daten nach Anreisedatum
  const sortedData = data.sort((a, b) => parseDate(a[2]) - parseDate(b[2]));

  let currentTripStart = null;
  let currentTripEnd = null;
  let currentTripLength = 0;

  sortedData.forEach(row => {
    const startDate = parseDate(row[2]); // Das Anreisedatum ist die dritte Spalte (Index 2)
    const endDate = parseDate(row[3]); // Das Abreisedatum ist die vierte Spalte (Index 3)
    const countryCodeISO2 = row[8]; // Der zweistellige Ländercode ist die neunte Spalte (Index 8)
    const countryCodeISO3 = row[9]; // Der dreistellige Ländercode ist die zehnte Spalte (Index 9)
    const place = row[0]; // Der Titel ist die erste Spalte (Index 0)

    if (!isNaN(startDate) && !isNaN(endDate)) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const nights = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)); // Differenz in Tagen abrunden

      // Berechnung der Besuche pro Jahr
      if (!visitsPerYear[year]) {
        visitsPerYear[year] = { visitCount: 0, multipleVisitedPlaces: 0, newPlaces: 0, nights: 0 };
      }
      visitsPerYear[year].visitCount += 1; // Gesamtbesuche

      // Verfolgung der Besuche pro Ort pro Jahr
      if (!visitsPerPlacePerYear[year]) {
        visitsPerPlacePerYear[year] = {};
      }
      if (!visitsPerPlacePerYear[year][place]) {
        visitsPerPlacePerYear[year][place] = 0;
      }
      visitsPerPlacePerYear[year][place] += 1;

      // Berechnung der Übernachtungen pro Jahr
      visitsPerYear[year].nights += nights;

      // Berechnung der Besuche pro Land (zweistellig)
      if (!visitsPerCountry[countryCodeISO2]) {
        visitsPerCountry[countryCodeISO2] = { visitCount: 0, multipleVisitedPlaces: 0, nights: 0 };
      }
      visitsPerCountry[countryCodeISO2].visitCount += 1;

      // Berechnung der Übernachtungen pro Land (zweistellig)
      visitsPerCountry[countryCodeISO2].nights += nights;

      // Berechnung der Besuche pro Land (dreistellig)
      if (!visitsPerCountryISO3[countryCodeISO3]) {
        visitsPerCountryISO3[countryCodeISO3] = { visitCount: 0, multipleVisitedPlaces: 0, nights: 0 };
      }
      visitsPerCountryISO3[countryCodeISO3].visitCount += 1;

      // Berechnung der Übernachtungen pro Land (dreistellig)
      visitsPerCountryISO3[countryCodeISO3].nights += nights;

      // Berechnung der Besuche pro Land und Ort
      if (!countryPlaceCount[countryCodeISO2]) {
        countryPlaceCount[countryCodeISO2] = { uniquePlaces: new Set(), visitCount: 0 };
      }
      countryPlaceCount[countryCodeISO2].uniquePlaces.add(place);
      countryPlaceCount[countryCodeISO2].visitCount += 1;

      // Verfolgung der Besuche pro Ort pro Land
      if (!visitsPerPlacePerCountry[countryCodeISO2]) {
        visitsPerPlacePerCountry[countryCodeISO2] = {};
      }
      if (!visitsPerPlacePerCountry[countryCodeISO2][place]) {
        visitsPerPlacePerCountry[countryCodeISO2][place] = 0;
      }
      visitsPerPlacePerCountry[countryCodeISO2][place] += 1;

      // Füge das Land zu den einzigartigen Ländern hinzu
      uniqueCountries.add(countryCodeISO2);

      // Füge den Ort zum globalen Set der einzigartigen Orte hinzu
      uniquePlacesGlobal.add(place);

      // Titelanzahl und Jahre erhöhen
      if (!titleCount.has(place)) {
        titleCount.set(place, 0);
        titleYears.set(place, new Set());
      }
      titleCount.set(place, titleCount.get(place) + 1);
      titleYears.get(place).add(year);

      // Gesamtzahl der Besuche erhöhen
      totalVisits += 1;

      // Gesamtzahl der Übernachtungen erhöhen
      totalNights += nights;

      // Gesamtzahl der Orte erhöhen
      totalPlaces += 1;

      // Berechnung der längsten Reise ohne Lücken
      if (currentTripEnd === null) {
        currentTripStart = startDate;
        currentTripEnd = endDate;
        currentTripLength = nights;
      } else if (startDate <= currentTripEnd) {
        // Es gibt keine Lücke zwischen den Reisen
        currentTripEnd = endDate > currentTripEnd ? endDate : currentTripEnd;
        currentTripLength += nights;
      } else {
        // Es gibt eine Lücke zwischen den Reisen
        longestTrip = currentTripLength > longestTrip ? currentTripLength : longestTrip;
        currentTripStart = startDate;
        currentTripEnd = endDate;
        currentTripLength = nights;
      }

      // Berechnung der meisten Übernachtungen in einem Ort
      if (nights > mostNights.nights) {
        mostNights = { place, nights };
      }

      // Berechnung des am häufigsten besuchten Ortes
      if (titleCount.get(place) > (mostVisitedPlace.visits || 0)) {
        mostVisitedPlace = { place, visits: titleCount.get(place) };
      }

      // Berechnung der Jahreszeiten
      if (month >= 2 && month <= 4) {
        seasons.Frühling += 1;
      } else if (month >= 5 && month <= 7) {
        seasons.Sommer += 1;
      } else if (month >= 8 && month <= 10) {
        seasons.Herbst += 1;
      } else {
        seasons.Winter += 1;
      }

      // Berechnung des beliebtesten Monats
      monthCount[month] += 1;

      // Berechnung der längsten Pause zwischen zwei Reisen
      if (lastTripEnd !== null) {
        const pause = Math.floor((startDate - lastTripEnd) / (1000 * 60 * 60 * 24)); // Differenz in Tagen abrunden
        if (pause > longestPause) {
          longestPause = pause;
        }
      }
      lastTripEnd = endDate;

    } else {
      console.error(`Invalid date encountered: ${row[2]} or ${row[3]}`);
    }
  });

  // Aktualisiere die längste Reise nach der letzten überprüften Reise
  longestTrip = currentTripLength > longestTrip ? currentTripLength : longestTrip;

  // Berechne die Anzahl der mehrfach besuchten Orte pro Land
  Object.entries(visitsPerPlacePerCountry).forEach(([countryCodeISO2, places]) => {
    const multipleVisitedPlaces = Object.values(places).filter(count => count > 1).length;
    if (visitsPerCountry[countryCodeISO2]) {
      visitsPerCountry[countryCodeISO2].multipleVisitedPlaces = multipleVisitedPlaces;
    }
  });

  // Berechne die Anzahl der mehrfach besuchten Orte pro Jahr
  Object.entries(visitsPerPlacePerYear).forEach(([year, places]) => {
    const multipleVisitedPlaces = Object.values(places).filter(count => count > 1).length;
    if (visitsPerYear[year]) {
      visitsPerYear[year].multipleVisitedPlaces = multipleVisitedPlaces;
    }
  });

  // Berechne die neuen Orte pro Jahr
  Object.entries(visitsPerPlacePerYear).forEach(([year, places]) => {
    uniquePlacesByYear.set(year, new Set());
    Object.keys(places).forEach(place => {
      const previousYears = Array.from(uniquePlacesByYear.keys()).filter(y => y < year);
      const isNewPlace = !previousYears.some(y => uniquePlacesByYear.get(y).has(place));
      if (isNewPlace) {
        uniquePlacesByYear.get(year).add(place);
      }
    });
  });

  // Füge die Anzahl der neuen Orte pro Jahr hinzu
  uniquePlacesByYear.forEach((places, year) => {
    if (visitsPerYear[year]) {
      visitsPerYear[year].newPlaces = places.size;
    }
  });

  // Debugging-Ausgaben
  //console.log('Visits per Year:', visitsPerYear);
  //console.log('Unique Places Global:', uniquePlacesGlobal);

  // Konvertiere die Sets in die Anzahl der einzigartigen Orte
  const visitsPerYearResult = Object.entries(visitsPerYear).reduce((acc, [year, { visitCount, multipleVisitedPlaces, newPlaces, nights }]) => {
    acc[year] = { visitCount, multipleVisitedPlaces, newPlaces, nights };
    return acc;
  }, {});

  const visitsPerCountryResult = Object.entries(visitsPerCountry).reduce((acc, [country, { visitCount, multipleVisitedPlaces, nights }]) => {
    acc[country] = { visitCount, multipleVisitedPlaces, nights };
    return acc;
  }, {});

  const visitsPerCountryISO3Result = Object.entries(visitsPerCountryISO3).reduce((acc, [country, { visitCount, multipleVisitedPlaces, nights }]) => {
    acc[country] = { visitCount, multipleVisitedPlaces, nights };
    return acc;
  }, {});

  const countryPlaceCountResult = Object.entries(countryPlaceCount).map(([country, { uniquePlaces, visitCount }]) => ({
    country,
    uniquePlacesCount: uniquePlaces.size,
    visitCount
  }));

  // Gesamtzahl der einzigartigen Orte pro Jahr berechnen
  const totalUniquePlacesPerYear = Array.from(uniquePlacesGlobal).length;

  // Liste der doppelten Titel erstellen
  const duplicateTitles = Array.from(titleCount.entries()).filter(([title, count]) => count > 1).map(([title, count]) => ({
    title,
    count,
    years: Array.from(titleYears.get(title)).sort()
  }));

  // Durchschnittliche Übernachtungen pro Ort berechnen
  const averageNightsPerPlace = totalNights / totalPlaces;

  // Berechne den beliebtesten Monat
  const popularMonth = monthCount.indexOf(Math.max(...monthCount)) + 1;

  return { 
    visitsPerYear: visitsPerYearResult, 
    visitsPerCountry: visitsPerCountryResult,
    visitsPerCountryISO3: visitsPerCountryISO3Result,
    countryPlaces: countryPlaceCountResult, 
    uniqueCountries: Array.from(uniqueCountries),
    countryCount: uniqueCountries.size,
    totalUniquePlaces: uniquePlacesGlobal.size, // Gesamtzahl der einzigartigen Orte global
    totalUniquePlacesPerYear, // Gesamtzahl der einzigartigen Orte pro Jahr
    totalVisits, // Gesamtzahl der Besuche
    duplicateTitles, // Liste der doppelten Titel mit Anzahl der Besuche und Jahren
    visitsPerPlacePerCountry, // Besuche pro Ort pro Land
    totalNights, // Gesamtzahl der Übernachtungen
    averageNightsPerPlace, // Durchschnittliche Übernachtungen pro Ort
    longestTrip, // Längste Reise ohne Lücken
    mostNights, // Ort mit den meisten Übernachtungen
    mostVisitedPlace, // Am häufigsten besuchter Ort
    seasons, // Jahreszeitenanalyse
    popularMonth, // Beliebtester Monat
    longestPause // Längste Pause zwischen zwei Reisen
  };
}

// Funktion zur Berechnung der Anzahl der Länder
export function calculateCountryStats(data) {
  const uniqueCountries = new Set();

  data.forEach(row => {
    const countryCode = row[8]; // Der Ländercode ist die neunte Spalte (Index 8)
    uniqueCountries.add(countryCode);
  });

  return uniqueCountries.size;
}

// Funktion zur Berechnung der einzigartigen Länder
export function getUniqueCountries(data) {
  const uniqueCountries = new Set();

  data.forEach(row => {
    const countryCode = row[8]; // Der Ländercode ist die neunte Spalte (Index 8)
    uniqueCountries.add(countryCode);
  });

  return Array.from(uniqueCountries);
}
