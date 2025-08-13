// import React, { useState, useEffect } from "react";
// import FlightSelection from "./FlightSelection";
// import PassengerDetails from "./PassengerDetails";
// import PackageList from "./PackageList";
// import PackageDetails from "./PackageDetails";
// import ItineraryView from "./ItineraryView";
// import "./Packages.css";

// const PackageExplorer = ({ searchParams, packageResults }) => {
//   const [packages, setPackages] = useState([]);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [flights, setFlights] = useState([]);
//   const [selectedFlight, setSelectedFlight] = useState(null);
//   const [flightPlan, setFlightPlan] = useState([]);
//   const [spotSchedule, setSpotSchedule] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [flightsLoading, setFlightsLoading] = useState(false);
//   const [itineraryLoading, setItineraryLoading] = useState(false);
//   const [currentView, setCurrentView] = useState('packages'); // 'packages', 'details', 'flights', 'itinerary', 'passengers'

//   useEffect(() => {
//     console.log("PackagesResult: ", packageResults);
//     const sampleData = packageResults || [];
//     setTimeout(() => {
//       setPackages(sampleData);
//       setLoading(false);
//     }, 1000);
//   }, [packageResults]);

//   const handlePackageClick = (pkg) => {
//     setSelectedPackage(pkg);
//     console.log("Selected Package: ", pkg);
//     setCurrentView('details');
//   };

//   const handleBookClick = async (pkg) => {
//     setSelectedPackage(pkg);
//     setFlightsLoading(true);
//     setCurrentView('flights');

//     try {
//       const response = await fetch('http://127.0.0.1:8000/trip_package/start_flight_options', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           package_id: pkg.package_id,
//           head_count: searchParams?.headCount || 1,
//           package_date: searchParams?.date ? searchParams.date.toISOString().split('T')[0] : '2025-07-31',
//           customer_source: searchParams?.source?.name || 'Singapore'
//         })
//       });

//       if (response.ok) {
//         const flightData = await response.json();
//         setFlights(flightData);
//         console.log('Fetched flights:', flightData);
//       } else {
//         console.error('Failed to fetch flights');
//         setFlights([]);
//       }
//     } catch (error) {
//       console.error('Error fetching flights:', error);
//       setFlights([]);
//     } finally {
//       setFlightsLoading(false);
//     }
//   };

//   const handleFlightSelect = async (flight) => {
//     setSelectedFlight(flight);
//     console.log("Selected Flight: ", flight);
//     setItineraryLoading(true);
//     setCurrentView('itinerary');

//     // Extract last arrival_time and format it to "YYYY-MM-DD HH:MM"
//     const lastArrivalRaw = flight.flights[flight.flights.length - 1].arrival_time;
//     const lastArrivalFormatted = lastArrivalRaw.slice(0, 16); // removes seconds

//     const payload = {
//       head_count: searchParams.headCount,
//       package_id: selectedPackage.package_id,
//       src_to_first_arrival_time: lastArrivalFormatted, // e.g., "2025-07-31 08:00"
//       source: searchParams.source.name,
//     };

//     try {
//       const response = await fetch("http://localhost:8000/trip_package/generate_flight_plan", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Flight Plan Generated:", data);
//       await handleEndFlightOptions(data);
      
//       // Set the flight plan and spot schedule data
//       setFlightPlan(data.flight_plan || []);
//       setSpotSchedule(data.spot_schedule || []);
      
//     } catch (error) {
//       console.error("Failed to generate flight plan:", error);
//       setFlightPlan([]);
//       setSpotSchedule([]);
//     } finally {
//       setItineraryLoading(false);
//     }
//   };

//   const handleEndFlightOptions = async (generateResponse) => {
//     try {
//       // Flatten all spots across cities and get the latest one by end_time
//       const allSpots = generateResponse.spot_schedule.flatMap(city => city.spots);
//       const lastSpot = allSpots.reduce((latest, spot) =>
//         new Date(spot.end_time) > new Date(latest.end_time) ? spot : latest
//       );

//       const payload = {
//         spot_id: lastSpot.spot_id,
//         package_id: selectedPackage.package_id,
//         head_count: searchParams.headCount,
//         package_date_end_date_time: lastSpot.end_time.slice(0, 16), // remove seconds
//         customer_destination: searchParams.source.name,
//       };

//       const response = await fetch("http://localhost:8000/trip_package/end_flight_options", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`end_flight_options failed: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("End Flight Options:", data);
//       // Optionally update state here

//     } catch (error) {
//       console.error("Error fetching end flight options:", error);
//     }
//   };


//   const handleItineraryConfirm = () => {
//     // Navigate to passenger details after confirming itinerary
//     setCurrentView('passengers');
//   };

//   const handlePassengerSubmit = (passengers) => {
//     console.log('Booking Details:', {
//       package: selectedPackage,
//       flight: selectedFlight,
//       flightPlan: flightPlan,
//       spotSchedule: spotSchedule,
//       passengers: passengers,
//       searchParams: searchParams
//     });
//     // Here you would typically submit the booking to your API
//     alert('Booking submitted successfully!');
//   };

//   const handleBack = () => {
//     switch (currentView) {
//       case 'details':
//         setCurrentView('packages');
//         setSelectedPackage(null);
//         break;
//       case 'flights':
//         setCurrentView('details');
//         setFlights([]);
//         break;
//       case 'itinerary':
//         setCurrentView('flights');
//         setFlightPlan([]);
//         setSpotSchedule([]);
//         break;
//       case 'passengers':
//         setCurrentView('itinerary');
//         break;
//       default:
//         setCurrentView('packages');
//     }
//   };

//   return (
//     <div>
//       {currentView === 'packages' && (
//         <PackageList
//           packages={packages}
//           onPackageClick={handlePackageClick}
//           onBookClick={handleBookClick}
//           loading={loading}
//         />
//       )}
      
//       {currentView === 'details' && selectedPackage && (
//         <PackageDetails
//           package={selectedPackage}
//           onBack={handleBack}
//           onBookClick={handleBookClick}
//         />
//       )}
      
//       {currentView === 'flights' && (
//         <FlightSelection
//           flights={flights}
//           onFlightSelect={handleFlightSelect}
//           onBack={handleBack}
//           loading={flightsLoading}
//         />
//       )}
      
//       {currentView === 'itinerary' && (
//         <ItineraryView
//           flightPlan={flightPlan}
//           spotSchedule={spotSchedule}
//           onBack={handleBack}
//           onConfirm={handleItineraryConfirm}
//           loading={itineraryLoading}
//         />
//       )}
      
//       {currentView === 'passengers' && (
//         <PassengerDetails
//           headCount={searchParams?.headCount || 1}
//           onPassengerSubmit={handlePassengerSubmit}
//           onBack={handleBack}
//         />
//       )}
//     </div>
//   );
// };

// export default PackageExplorer;

import React, { useState, useEffect } from "react";
import FlightSelection from "./FlightSelection";
import PassengerDetails from "./PassengerDetails";
import PackageList from "./PackageList";
import PackageDetails from "./PackageDetails";
import ItineraryView from "./ItineraryView";
import "./Packages.css";
import { getCookie } from "../../../../utils/SessionUtils";

const PackageExplorer = ({ searchParams, packageResults }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightPlan, setFlightPlan] = useState([]);
  const [spotSchedule, setSpotSchedule] = useState([]);
  const [endFlightOptions, setEndFlightOptions] = useState([]);
  const [selectedEndFlight, setSelectedEndFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [endFlightsLoading, setEndFlightsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [srcToFirstArrivalTime, setSrcToFirstArrivalTime] = useState(null);
  const [currentView, setCurrentView] = useState('packages'); // 'packages', 'details', 'flights', 'itinerary', 'endFlights', 'passengers'
  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;

  useEffect(() => {
    console.log("PackagesResult: ", packageResults);
    const sampleData = packageResults || [];
    setTimeout(() => {
      setPackages(sampleData);
      setLoading(false);
    }, 1000);
  }, [packageResults]);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    console.log("Selected Package: ", pkg);
    setCurrentView('details');
  };

  const handleBookClick = async (pkg) => {
    setSelectedPackage(pkg);
    setFlightsLoading(true);
    setCurrentView('flights');
    const formattedDate = searchParams?.date
      ? new Date(searchParams?.date).toLocaleDateString('en-CA') // YYYY-MM-DD in local time
      : null;

    try {
      const response = await fetch(`${backendUrl}/trip_package/start_flight_options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: pkg.package_id,
          head_count: searchParams?.headCount || 1,
          package_date: formattedDate,
          customer_source: searchParams?.source?.name || 'Singapore'
        })
      });

      if (response.ok) {
        const flightData = await response.json();
        setFlights(flightData);
        console.log('Fetched flights:', flightData);
      } else {
        console.error('Failed to fetch flights');
        setFlights([]);
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      setFlights([]);
    } finally {
      setFlightsLoading(false);
    }
  };

  const handleFlightSelect = async (flight) => {
    setSelectedFlight(flight);
    console.log("Selected Flight: ", flight);
    setItineraryLoading(true);
    setCurrentView('itinerary');

    // Extract last arrival_time and format it to "YYYY-MM-DD HH:MM"
    const lastArrivalRaw = flight.flights[flight.flights.length - 1].arrival_time;
    const lastArrivalFormatted = lastArrivalRaw.slice(0, 16); // removes seconds
    setSrcToFirstArrivalTime(lastArrivalFormatted);

    const payload = {
      head_count: searchParams.headCount,
      package_id: selectedPackage.package_id,
      src_to_first_arrival_time: lastArrivalFormatted, // e.g., "2025-07-31 08:00"
      source: searchParams.source.name,
    };

    try {
      const response = await fetch(`${backendUrl}/trip_package/generate_flight_plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Flight Plan Generated:", data);
      
      // Set the flight plan and spot schedule data
      setFlightPlan(data.flight_plan || []);
      setSpotSchedule(data.spot_schedule || []);
      
      // Fetch end flight options
      await handleEndFlightOptions(data);
      
    } catch (error) {
      console.error("Failed to generate flight plan:", error);
      setFlightPlan([]);
      setSpotSchedule([]);
      setEndFlightOptions([]);
    } finally {
      setItineraryLoading(false);
    }
  };

  const handleEndFlightOptions = async (generateResponse) => {
    try {
      // Flatten all spots across cities and get the latest one by end_time
      const allSpots = generateResponse.spot_schedule.flatMap(city => city.spots);
      const lastSpot = allSpots.reduce((latest, spot) =>
        new Date(spot.end_time) > new Date(latest.end_time) ? spot : latest
      );

      const payload = {
        spot_id: lastSpot.spot_id,
        package_id: selectedPackage.package_id,
        head_count: searchParams.headCount,
        package_date_end_date_time: lastSpot.end_time.slice(0, 16), // remove seconds
        customer_destination: searchParams.source.name,
      };

      const response = await fetch(`${backendUrl}/trip_package/end_flight_options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`end_flight_options failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("End Flight Options:", data);
      setEndFlightOptions(data);

    } catch (error) {
      console.error("Error fetching end flight options:", error);
      setEndFlightOptions([]);
    }
  };

  const handleItineraryConfirm = () => {
    // Navigate to end flights selection
    setCurrentView('endFlights');
  };

  const handleEndFlightSelect = (flight) => {
    setSelectedEndFlight(flight);
    console.log("Selected End Flight: ", flight);
    // Navigate to passenger details after selecting end flight
    setCurrentView('passengers');
  };

  const consolidateAllFlights = () => {
    const allFlights = [];
    
    // Add initial flight (from source to first destination)
    if (selectedFlight && selectedFlight.flights) {
      selectedFlight.flights.forEach(flight => {
        allFlights.push({
          ...flight,
          flight_type: 'initial',
          total_price: selectedFlight.total_price,
          total_duration_minutes: selectedFlight.total_duration_minutes
        });
      });
    }

    // Add inter-city flights
    if (flightPlan && flightPlan.length > 0) {
      flightPlan.forEach(plan => {
        allFlights.push({
          ...plan.flight,
          flight_type: 'inter_city',
          source_city_name: plan.source,
          destination_city_name: plan.destination,
          head_count: plan.head_count
        });
      });
    }

    // Add return flights
    if (selectedEndFlight && selectedEndFlight.flights) {
      selectedEndFlight.flights.forEach(flight => {
        allFlights.push({
          ...flight,
          flight_type: 'return',
          total_price: selectedEndFlight.total_price,
          total_duration_minutes: selectedEndFlight.total_duration_minutes
        });
      });
    }

    return allFlights;
  };

  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const handleCreateBooking = async (passengers) => {
    try {
      setBookingLoading(true);

      const consolidatedFlights = consolidateAllFlights();
      console.log("Consolidated Flight: ",consolidatedFlights);
      const formattedDate = searchParams?.date
        ? new Date(searchParams?.date).toLocaleDateString('en-CA') // YYYY-MM-DD format
        : null;
        console.log("Booking Date: ",formattedDate)

      const sortedFlights = [...consolidatedFlights].sort(
        (a, b) => new Date(a.departure_time) - new Date(b.departure_time)
      );

      const bookingPayload = {
        package_id: selectedPackage?.package_id,
        head_count: searchParams?.headCount || 1,
        passengers: passengers,
        //booking_date: formattedDate,
        booking_date: formatDateTime(sortedFlights[0].departure_time),
        end_date: formatDateTime(sortedFlights[sortedFlights.length - 1].arrival_time),
        src_to_first_arrival_time: srcToFirstArrivalTime,
        flights: consolidatedFlights,
        user_id: parseInt(getCookie('userId')),
        flight_total: consolidatedFlights.reduce((sum, flight) => sum + flight.base_price, 0),
      };
      console.log("Payload for Create_booking's API: ", bookingPayload);

      const response = await fetch(`${backendUrl}/trip_package/create_booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      if (response.ok) {
        const bookingResult = await response.json();
        console.log('Booking created successfully:', bookingResult);

        // Now start payment redirect
        //handlePaymentGateway();

        return {
          success: true,
          data: bookingResult,
          consolidatedFlights,
          bookingPayload,
        };
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData);

        return {
          success: false,
          error: errorData.message || 'Booking failed. Please try again.',
        };
      }
    } catch (error) {
      console.error('Error creating booking:', error);

      return {
        success: false,
        error: 'An error occurred while creating your booking. Please try again.',
      };
    } finally {
      setBookingLoading(false);
    }
  };


  const handlePassengerSubmit = async (passengersData) => {
    // If passengersData contains booking result (from updated PassengerDetails)
    if (passengersData.bookingResult) {
      console.log('Booking completed:', passengersData);
      alert('Booking submitted successfully!');
      // Navigate to success page or reset flow
      setCurrentView('packages');
      return;
    }

    // If it's just passenger data (fallback for compatibility)
    const bookingResult = await handleCreateBooking(passengersData);
    
    if (bookingResult.success) {
      console.log('Booking Details:', {
        package: selectedPackage,
        flight: selectedFlight,
        flightPlan: flightPlan,
        spotSchedule: spotSchedule,
        endFlight: selectedEndFlight,
        passengers: passengersData,
        searchParams: searchParams,
        bookingData: bookingResult.data
      });
      alert('Booking submitted successfully!');
      // Navigate to success page or reset flow
      setCurrentView('packages');
    } else {
      alert(bookingResult.error);
    }
  };
  const handlePaymentGateway = (e) => {
    //e.preventDefault();
    let amount = 1000;

    if (!amount || isNaN(amount)) {
      return alert('Enter a valid amount');
    }

    const payload = {
      email: 'thabitha@gmail.com',
      code: 'thabitha@paygate',
      amount: parseFloat(amount)
    };

    const encoded = encodeURIComponent(btoa(JSON.stringify(payload))); // Base64 + URI encode
    const returnUrl = `${window.location.origin}/payment-result`;

    window.location.href = `http://172.22.150.21:3001/payment/${encoded}?returnUrl=${encodeURIComponent(returnUrl)}`;
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
      case 'itinerary':
        setCurrentView('flights');
        setFlightPlan([]);
        setSpotSchedule([]);
        setEndFlightOptions([]);
        break;
      case 'endFlights':
        setCurrentView('itinerary');
        break;
      case 'passengers':
        setCurrentView('endFlights');
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
      
      {currentView === 'itinerary' && (
        <ItineraryView
          flightPlan={flightPlan}
          spotSchedule={spotSchedule}
          onBack={handleBack}
          onConfirm={handleItineraryConfirm}
          loading={itineraryLoading}
        />
      )}
      
      {currentView === 'endFlights' && (
        <FlightSelection
          flights={endFlightOptions}
          onFlightSelect={handleEndFlightSelect}
          onBack={handleBack}
          loading={endFlightsLoading}
          title="Select Return Flight"
          subtitle="Choose your flight back home"
        />
      )}
      
      {currentView === 'passengers' && (
        <PassengerDetails
          headCount={searchParams?.headCount || 1}
          onPassengerSubmit={handlePassengerSubmit}
          onBack={handleBack}
          selectedFlight={selectedFlight}
          flightPlan={flightPlan}
          selectedEndFlight={selectedEndFlight}
          selectedPackage={selectedPackage}
          searchParams={searchParams}
          onCreateBooking={handleCreateBooking}
          bookingLoading={bookingLoading}
        />
      )}
    </div>
  );
};

export default PackageExplorer;