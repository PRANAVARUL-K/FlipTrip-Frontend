import React from "react";
import {
  Clock,
  IndianRupee,
  ArrowLeft,
  Users,
  Plane,
  ArrowRight,
} from "lucide-react";
import "../LangingPage/Packages/Packages.css";

const FlightSelectionBooking = ({ 
  flights, 
  onFlightSelect, 
  onBack, 
  loading,
  title = "Select Your Flight",
  subtitle = "Choose your preferred onward flight option"
}) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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
      })
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-selection">
      <div className="container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="flight-header">
          <h1 className="flight-title">{title}</h1>
          <p className="flight-subtitle">{subtitle}</p>
        </div>

        <div className="flights-list">
          {flights.map((flightOption, index) => (
            <div key={index} className="flight-option-card">
              <div className="flight-option-header">
                <div className="flight-summary">
                  <div className="flight-duration">
                    <Clock size={20} />
                    <span>{formatDuration(flightOption.total_duration_minutes)}</span>
                  </div>
                  <div className="flight-price">
                    <IndianRupee size={20} />
                    <span>₹{flightOption.total_price.toLocaleString()}</span>
                  </div>
                  <div className="flight-stops">
                    {flightOption.flights.length === 1 ? 'Direct' : `${flightOption.flights.length - 1} Stop${flightOption.flights.length > 2 ? 's' : ''}`}
                  </div>
                </div>
              </div>

              <div className="flight-details">
                {flightOption.flights.map((flight, flightIndex) => {
                  const departure = formatDateTime(flight.departure_time);
                  const arrival = formatDateTime(flight.arrival_time);
                  
                  return (
                    <div key={flight.flight_id} className="flight-segment">
                      <div className="flight-info">
                        <div className="airline-info">
                          <Plane size={18} />
                          <div>
                            <div className="airline-name">{flight.airline_name}</div>
                            <div className="flight-number">{flight.flight_number}</div>
                          </div>
                        </div>

                        <div className="flight-route">
                          <div className="airport-info">
                            <div className="airport-code">{flight.source_airport}</div>
                            <div className="city-name">{flight.source_city}</div>
                            <div className="flight-time">{departure.time}</div>
                            <div className="flight-date">{departure.date}</div>
                          </div>

                          <div className="flight-path">
                            <div className="flight-duration-line">
                              <span>{formatDuration(flight.duration_minutes)}</span>
                            </div>
                            <ArrowRight size={16} />
                          </div>

                          <div className="airport-info">
                            <div className="airport-code">{flight.destination_airport}</div>
                            <div className="city-name">{flight.destination_city}</div>
                            <div className="flight-time">{arrival.time}</div>
                            <div className="flight-date">{arrival.date}</div>
                          </div>
                        </div>

                        <div className="flight-meta">
                          <div className="available-seats">
                            <Users size={16} />
                            <span>{flight.available_seats} seats</span>
                          </div>
                          <div className="flight-price-individual">
                            ₹{flight.base_price.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {flightIndex < flightOption.flights.length - 1 && (
                        <div className="layover-info">
                          <div className="layover-text">Layover in {flight.destination_city} ({flight.destination_airport})</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flight-actions">
                <button 
                  className="select-flight-button"
                  onClick={() => onFlightSelect(flightOption)}
                >
                  Select This Flight
                </button>
              </div>
            </div>
          ))}
        </div>

        {flights.length === 0 && (
          <div className="empty-state">
            <Plane size={48} />
            <h3 className="empty-title">No flights available</h3>
            <p className="empty-subtitle">Please try different dates or destinations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSelectionBooking;