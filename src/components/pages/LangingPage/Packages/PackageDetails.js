import React from "react";
import {
  MapPin,
  Clock,
  IndianRupee,
  Calendar,
  ArrowLeft,
  Users,
} from "lucide-react";
import "./Packages.css";

const PackageDetails = ({ package: pkg, onBack, onBookClick }) => {
  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const groupSpotsByDay = (spots) => {
    return spots.reduce((acc, spot) => {
      if (!acc[spot.day_no]) {
        acc[spot.day_no] = [];
      }
      acc[spot.day_no].push(spot);
      return acc;
    }, {});
  };

  return (
    <div className="package-details">
      <div className="container">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          <span>Back to Packages</span>
        </button>

        <div className="details-header">
          <div className="details-header-content">
            <h1 className="details-title">{pkg.package_name}</h1>
            <p className="details-description">{pkg.description}</p>
            <div className="details-info">
              <div className="details-info-item">
                <IndianRupee size={24} />
                <div>
                  <span className="details-price">
                    ₹{pkg.total_price.toLocaleString()}
                  </span>
                  <span className="details-price-label">Total Price</span>
                </div>
              </div>
              <div className="details-info-item">
                <Calendar size={24} />
                <div>
                  <span className="details-duration">{pkg.duration_days}</span>
                  <span className="details-duration-label">Days</span>
                </div>
              </div>
              <div className="details-info-item">
                <MapPin size={24} />
                <div>
                  <span className="details-cities">{pkg.cities.length}</span>
                  <span className="details-cities-label">Cities</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="details-book-section">
            <button 
              className="details-book-button"
              onClick={() => onBookClick(pkg)}
            >
              Book This Package
            </button>
          </div>
        </div>

        <div className="cities-container">
          {pkg.cities.map((city, cityIndex) => (
            <div key={city.city_id} className="city-section">
              <div className="city-header">
                <div className="city-number">{cityIndex + 1}</div>
                <div className="city-info">
                  <h2 className="city-name">{city.city_name}</h2>
                  <div className="city-details">
                    <div className="city-detail-item">
                      <Calendar size={16} />
                      <span>{city.stay_duration} Days Stay</span>
                    </div>
                    <div className="city-detail-item">
                      <IndianRupee size={16} />
                      <span>₹{city.city_price.toLocaleString()}</span>
                    </div>
                    <div className="city-detail-item">
                      <MapPin size={16} />
                      <span>{city.spots.length} Attractions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="spots-container">
                {Object.entries(groupSpotsByDay(city.spots))
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([dayNo, daySpots]) => (
                    <div
                      key={`${city.city_id}-day-${dayNo}`}
                      className="day-section"
                    >
                      <div className="day-header">
                        <div className="day-number">Day {dayNo}</div>
                        <div className="day-line"></div>
                      </div>
                      
                      <div className="spots-timeline">
                        {daySpots.map((spot, spotIndex) => (
                          <div key={spot.spot_id} className="spot-timeline-item">
                            <div className="spot-timeline-marker">
                              <div className="spot-sequence">{spotIndex + 1}</div>
                            </div>
                            
                            <div className="spot-timeline-content">
                              <div className="spot-main">
                                <h4 className="spot-name">{spot.spot_name}</h4>
                                <p className="spot-description">{spot.description}</p>
                              </div>
                              
                              <div className="spot-meta">
                                <div className="spot-meta-item">
                                  <Clock size={14} />
                                  <span>{formatTime(spot.timing)}</span>
                                </div>
                                <div className="spot-meta-item">
                                  <Users size={14} />
                                  <span>{formatDuration(spot.duration)}</span>
                                </div>
                                <div className="spot-meta-item">
                                  <IndianRupee size={14} />
                                  <span className="spot-fee">
                                    {spot.entry_fee === 0
                                      ? "Free"
                                      : `₹${spot.entry_fee}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;