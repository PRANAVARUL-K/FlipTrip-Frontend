import React, { useState, useEffect } from "react";
import FlightSelection from "./FlightSelection";
import PassengerDetails from "./PassengerDetails";
import PackageList from "./PackageList";
import PackageDetails from "./PackageDetails";
import "./Packages.css";

const PackageExplorer = ({ searchParams, packageResults}) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('packages'); // 'packages', 'details', 'flights', 'passengers'

  useEffect(() => {

    // const sampleData = [
    //   {
    //     package_id: 1,
    //     package_name: "Kerala Backwaters Explorer",
    //     description:
    //       "Experience the serene backwaters of Kerala with visits to Kochi and Trivandrum, featuring historic sites, beaches, and traditional houseboat cruises.",
    //     duration_days: 4,
    //     price: 12400.0,
    //     total_price: 26600.0,
    //     cities: [
    //       {
    //         city_id: 1,
    //         country: 1,
    //         city_name: "Kochi",
    //         city_price: 3000.0,
    //         stay_duration: 2,
    //         country_name: "India",
    //         spots: [
    //           {
    //             spot_id: 1,
    //             city: 1,
    //             spot_name: "Fort Kochi Beach",
    //             description:
    //               "Historic beach with Chinese fishing nets and colonial architecture",
    //             entry_fee: 0.0,
    //             timing: "06:00:00",
    //             duration: 2.5,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 2,
    //             city: 1,
    //             spot_name: "Mattancherry Palace",
    //             description:
    //               "Portuguese palace showcasing Kerala murals and artifacts",
    //             entry_fee: 15.0,
    //             timing: "10:00:00",
    //             duration: 1.5,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 3,
    //             city: 1,
    //             spot_name: "Jewish Synagogue",
    //             description:
    //               "Ancient synagogue with hand-painted tiles and antiques",
    //             entry_fee: 5.0,
    //             timing: "12:00:00",
    //             duration: 1.0,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 4,
    //             city: 1,
    //             spot_name: "Marine Drive",
    //             description:
    //               "Scenic waterfront promenade perfect for evening walks",
    //             entry_fee: 0.0,
    //             timing: "17:00:00",
    //             duration: 2.0,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 5,
    //             city: 1,
    //             spot_name: "Cherai Beach",
    //             description:
    //               "Golden sand beach with coconut groves and backwaters",
    //             entry_fee: 0.0,
    //             timing: "08:00:00",
    //             duration: 4.0,
    //             day_no: 2,
    //           },
    //           {
    //             spot_id: 6,
    //             city: 1,
    //             spot_name: "Backwater Cruise",
    //             description:
    //               "Traditional houseboat experience through scenic backwaters",
    //             entry_fee: 800.0,
    //             timing: "14:00:00",
    //             duration: 3.0,
    //             day_no: 2,
    //           },
    //         ],
    //       },
    //       {
    //         city_id: 2,
    //         country: 1,
    //         city_name: "Trivandrum",
    //         city_price: 3100.0,
    //         stay_duration: 2,
    //         country_name: "India",
    //         spots: [
    //           {
    //             spot_id: 7,
    //             city: 2,
    //             spot_name: "Padmanabhaswamy Temple",
    //             description: "Ancient Hindu temple dedicated to Lord Vishnu",
    //             entry_fee: 0.0,
    //             timing: "04:00:00",
    //             duration: 2.0,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 8,
    //             city: 2,
    //             spot_name: "Napier Museum",
    //             description:
    //               "Art and natural history museum with unique architecture",
    //             entry_fee: 20.0,
    //             timing: "10:00:00",
    //             duration: 2.0,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 9,
    //             city: 2,
    //             spot_name: "Kuthiramalika Palace",
    //             description:
    //               "Traditional palace with horse-shaped wooden brackets",
    //             entry_fee: 30.0,
    //             timing: "14:00:00",
    //             duration: 1.5,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 10,
    //             city: 2,
    //             spot_name: "City Shopping",
    //             description: "Local markets and handicraft shopping",
    //             entry_fee: 0.0,
    //             timing: "16:30:00",
    //             duration: 1.5,
    //             day_no: 1,
    //           },
    //           {
    //             spot_id: 11,
    //             city: 2,
    //             spot_name: "Kovalam Beach",
    //             description: "Famous crescent-shaped beach with lighthouse",
    //             entry_fee: 0.0,
    //             timing: "06:00:00",
    //             duration: 4.0,
    //             day_no: 2,
    //           },
    //           {
    //             spot_id: 12,
    //             city: 2,
    //             spot_name: "Veli Tourist Village",
    //             description:
    //               "Backwater destination with boating and water sports",
    //             entry_fee: 50.0,
    //             timing: "14:00:00",
    //             duration: 3.0,
    //             day_no: 2,
    //           },
    //         ],
    //       },
    //     ],
    //   }
    // ];

    const sampleData = packageResults || [];
    console.log('Sample Data:', sampleData);
    console.log('Sample Data:', packageResults);
    setTimeout(() => {
      setPackages(sampleData);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setCurrentView('details');
  };

  const handleBookClick = async (pkg) => {
    setSelectedPackage(pkg);
    setFlightsLoading(true);
    setCurrentView('flights');

    try {
      const response = await fetch('http://127.0.0.1:8000/trip_package/get_onwards_flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: pkg.package_id,
          head_count: searchParams?.headCount || 1,
          package_date: searchParams?.date ? searchParams.date.toISOString().split('T')[0] : '2025-07-31',
          customer_source: searchParams?.source?.name || 'Singapore'
        })
      });

      if (response.ok) {
        const flightData = await response.json();
        setFlights(flightData);
      } else {
        console.error('Failed to fetch flights');
        setFlights([
          {
            "total_duration_minutes": 340,
            "total_price": 6100.0,
            "flights": [
              {
                "flight_id": "FL201",
                "airline_name": "SpiceJet",
                "flight_number": "SG301",
                "source_airport": "DEL",
                "destination_airport": "HYD",
                "departure_time": "2025-07-30  07:00:00",
                "arrival_time": "2025-07-30 08:45:00",
                "duration_minutes": 105,
                "base_price": 2300.0,
                "available_seats": 7
              },
              {
                "flight_id": "FL305",
                "airline_name": "Vistara",
                "flight_number": "UK410",
                "source_airport": "HYD",
                "destination_airport": "BLR",
                "departure_time": "2025-07-30 10:00:00",
                "arrival_time": "2025-07-30 11:55:00",
                "duration_minutes": 115,
                "base_price": 2800.0,
                "available_seats": 7
              }
            ]
          },
          {
            "total_duration_minutes": 375,
            "total_price": 5500.0,
            "flights": [
              {
                "flight_id": "FL202",
                "airline_name": "IndiGo",
                "flight_number": "6E789",
                "source_airport": "DEL",
                "destination_airport": "MAA",
                "departure_time": "2025-07-30 06:30:00",
                "arrival_time": "2025-07-30 08:20:00",
                "duration_minutes": 110,
                "base_price": 2500.0,
                "available_seats": 8
              },
              {
                "flight_id": "FL312",
                "airline_name": "Air India",
                "flight_number": "AI222",
                "source_airport": "MAA",
                "destination_airport": "BLR",
                "departure_time": "2025-07-30 09:45:00",
                "arrival_time": "2025-07-30 11:20:00",
                "duration_minutes": 95,
                "base_price": 3000.0,
                "available_seats": 8
              }
            ]
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlights([]);
    } finally {
      setFlightsLoading(false);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    setCurrentView('passengers');
  };

  const handlePassengerSubmit = (passengers) => {
    console.log('Booking Details:', {
      package: selectedPackage,
      flight: selectedFlight,
      passengers: passengers,
      searchParams: searchParams
    });
    // Here you would typically submit the booking to your API
    alert('Booking submitted successfully!');
  };

  const handleBack = () => {
    switch (currentView) {
      case 'details':
        setCurrentView('packages');
        setSelectedPackage(null);
        break;
      case 'flights':
        setCurrentView('details');
        setFlights([]);
        break;
      case 'passengers':
        setCurrentView('flights');
        setSelectedFlight(null);
        break;
      default:
        setCurrentView('packages');
    }
  };

  return (
    <div>
      {currentView === 'packages' && (
        <PackageList
          packages={packages}
          onPackageClick={handlePackageClick}
          onBookClick={handleBookClick}
          loading={loading}
        />
      )}
      
      {currentView === 'details' && selectedPackage && (
        <PackageDetails
          package={selectedPackage}
          onBack={handleBack}
          onBookClick={handleBookClick}
        />
      )}
      
      {currentView === 'flights' && (
        <FlightSelection
          flights={flights}
          onFlightSelect={handleFlightSelect}
          onBack={handleBack}
          loading={flightsLoading}
        />
      )}
      
      {currentView === 'passengers' && (
        <PassengerDetails
          headCount={searchParams?.headCount || 1}
          onPassengerSubmit={handlePassengerSubmit}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default PackageExplorer;