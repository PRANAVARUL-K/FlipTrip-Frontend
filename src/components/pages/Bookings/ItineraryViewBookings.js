import React from "react";
import {
  ArrowLeft,
  Plane,
  MapPin,
  Clock,
  Calendar,
  Users,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import '../LangingPage/Packages/ItineraryView.css';

const ItineraryViewBookings = ({ flightPlan, spotSchedule, onBack, onConfirm, loading }) => {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      fullDateTime: date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const groupSpotsByDate = (spots) => {
    return spots.reduce((acc, spot) => {
      const date = new Date(spot.start_time).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(spot);
      return acc;
    }, {});
  };

  const sortSpotsByTime = (spots) => {
    return spots.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  };

  // Function to order flight plan by spot schedule sequence
  const orderFlightPlanBySchedule = (flightPlan, spotSchedule) => {
    if (!flightPlan || !spotSchedule || flightPlan.length === 0 || spotSchedule.length === 0) {
      return flightPlan || [];
    }

    // Create a map of city names to their order in spot schedule
    const cityOrderMap = {};
    spotSchedule.forEach((citySchedule, index) => {
      cityOrderMap[citySchedule.city_name.toLowerCase()] = index;
    });

    // Sort flight plan based on city order
    return flightPlan.sort((a, b) => {
      const sourceOrderA = cityOrderMap[a.source.toLowerCase()] ?? Infinity;
      const destOrderA = cityOrderMap[a.destination.toLowerCase()] ?? Infinity;
      const sourceOrderB = cityOrderMap[b.source.toLowerCase()] ?? Infinity;
      const destOrderB = cityOrderMap[b.destination.toLowerCase()] ?? Infinity;

      // Compare based on source city order first, then destination
      if (sourceOrderA !== sourceOrderB) {
        return sourceOrderA - sourceOrderB;
      }
      return destOrderA - destOrderB;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Generating your itinerary...</p>
        </div>
      </div>
    );
  }

  const orderedFlightPlan = orderFlightPlanBySchedule(flightPlan, spotSchedule);

  return (
    <div className="itinerary-view">
      <div className="container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back to Flights</span>
        </button>

        <div className="itinerary-header">
          <h1 className="itinerary-title">Your Complete Itinerary</h1>
          <p className="itinerary-subtitle">
            Review your personalized travel plan with flights and activities
          </p>
        </div>

        {/* Flight Plan Section */}
        {orderedFlightPlan && orderedFlightPlan.length > 0 && (
          <div className="itinerary-section">
            <div className="section-header">
              <Plane size={24} />
              <h2 className="section-title">Inter-city Flights</h2>
            </div>
            
            <div className="flight-plan-list">
              {orderedFlightPlan.map((plan, index) => {
                const departure = formatDateTime(plan.flight.departure_time);
                const arrival = formatDateTime(plan.flight.arrival_time);
                
                return (
                  <div key={index} className="flight-plan-card">
                    <div className="flight-plan-header">
                      <div className="flight-route-info">
                        <div className="route-cities">
                          <span className="source-city">{plan.source}</span>
                          <Plane size={16} className="route-arrow" />
                          <span className="destination-city">{plan.destination}</span>
                        </div>
                        <div className="flight-date">
                          <Calendar size={16} />
                          <span>{departure.date}</span>
                        </div>
                      </div>
                      <div className="passenger-count">
                        <Users size={16} />
                        <span>{plan.head_count} passenger{plan.head_count > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flight-details-card">
                      <div className="airline-info">
                        <div className="airline-details">
                          <div className="airline-name">{plan.flight.airline_name}</div>
                          <div className="flight-number">{plan.flight.flight_number}</div>
                        </div>
                      </div>

                      <div className="flight-times">
                        <div className="departure-info">
                          <div className="airport-code">{plan.flight.source_airport}</div>
                          <div className="city-name">{plan.flight.source_city}</div>
                          <div className="flight-time">{departure.time}</div>
                        </div>

                        <div className="flight-duration">
                          <div className="duration-line"></div>
                          <span className="duration-text">
                            {formatDuration(plan.flight.duration_minutes)}
                          </span>
                        </div>

                        <div className="arrival-info">
                          <div className="airport-code">{plan.flight.destination_airport}</div>
                          <div className="city-name">{plan.flight.destination_city}</div>
                          <div className="flight-time">{arrival.time}</div>
                        </div>
                      </div>

                      <div className="flight-meta">
                        <div className="available-seats">
                          <span>{plan.flight.available_seats} seats available</span>
                        </div>
                        <div className="flight-price">
                          <IndianRupee size={16} />
                          <span>₹{plan.flight.base_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Spot Schedule Section */}
        {spotSchedule && spotSchedule.length > 0 && (
          <div className="itinerary-section">
            <div className="section-header">
              <MapPin size={24} />
              <h2 className="section-title">Activity Schedule</h2>
            </div>

            <div className="spot-schedule-container">
              {spotSchedule.map((citySchedule, cityIndex) => {
                const groupedSpots = groupSpotsByDate(citySchedule.spots);
                
                return (
                  <div key={citySchedule.city_id} className="city-schedule">
                    <div className="city-schedule-header">
                      <div className="city-number">{cityIndex + 1}</div>
                      <h3 className="city-schedule-name">{citySchedule.city_name}</h3>
                      <div className="city-spots-count">
                        {citySchedule.spots.length} activities
                      </div>
                    </div>

                    <div className="daily-schedules">
                      {Object.entries(groupedSpots)
                        .sort(([a], [b]) => new Date(a) - new Date(b))
                        .map(([dateString, daySpots]) => {
                          const sortedSpots = sortSpotsByTime(daySpots);
                          const dateObj = new Date(dateString);
                          const formattedDate = dateObj.toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          });

                          return (
                            <div key={dateString} className="daily-schedule">
                              <div className="daily-schedule-header">
                                <Calendar size={18} />
                                <h4 className="daily-date">{formattedDate}</h4>
                                <div className="daily-spots-count">
                                  {sortedSpots.length} stops
                                </div>
                              </div>

                              <div className="spots-timeline">
                                {sortedSpots.map((spot, spotIndex) => {
                                  const startTime = formatDateTime(spot.start_time);
                                  const endTime = formatDateTime(spot.end_time);
                                  
                                  return (
                                    <div key={spot.spot_id} className="spot-timeline-item">
                                      <div className="spot-timeline-marker">
                                        <div className="spot-sequence">{spotIndex + 1}</div>
                                      </div>
                                      
                                      <div className="spot-timeline-content">
                                        <div className="spot-main-info">
                                          <h5 className="spot-name">{spot.spot_name}</h5>
                                          <div className="spot-timing">
                                            <Clock size={14} />
                                            <span>
                                              {startTime.time} - {endTime.time}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmation Section */}
        <div className="itinerary-actions">
          <div className="itinerary-summary">
            <div className="summary-item">
              <Plane size={20} />
              <span>{orderedFlightPlan?.length || 0} Inter-city Flight{(orderedFlightPlan?.length || 0) !== 1 ? 's' : ''}</span>
            </div>
            <div className="summary-item">
              <MapPin size={20} />
              <span>
                {spotSchedule?.reduce((total, city) => total + city.spots.length, 0) || 0} Activities Planned
              </span>
            </div>
            <div className="summary-item">
              <Calendar size={20} />
              <span>
                {spotSchedule?.length || 0} Cit{(spotSchedule?.length || 0) !== 1 ? 'ies' : 'y'} to Visit
              </span>
            </div>
          </div>

          <button className="confirm-itinerary-button" onClick={onConfirm}>
            <CheckCircle size={20} />
            <span>Confirm Itinerary</span>
          </button>
        </div>

        {(!orderedFlightPlan || orderedFlightPlan.length === 0) && (!spotSchedule || spotSchedule.length === 0) && (
          <div className="empty-state">
            <Calendar size={48} />
            <h3 className="empty-title">No itinerary available</h3>
            <p className="empty-subtitle">
              Unable to generate travel plan. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryViewBookings;