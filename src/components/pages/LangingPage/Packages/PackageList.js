import React from "react";
import {
  ChevronRight,
  MapPin,
  IndianRupee,
  Calendar,
} from "lucide-react";
import "./Packages.css";

const PackageList = ({ packages, onPackageClick, onBookClick, loading }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="package-explorer">
      <div className="container">
        <div className="header">
          <h1 className="header-title">Travel Packages</h1>
          <p className="header-subtitle">
            Discover amazing destinations and create unforgettable memories
          </p>
        </div>

        <div className="packages-list">
          {packages.map((pkg) => (
            <div key={pkg.package_id} className="package-card">
              <div 
                className="package-header"
                onClick={() => onPackageClick(pkg)}
              >
                <div className="package-content">
                  <div className="package-title-row">
                    <h2 className="package-title">{pkg.package_name}</h2>
                    <div className="duration-badge">
                      {pkg.duration_days} Days
                    </div>
                  </div>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-info">
                    <div className="info-item">
                      <IndianRupee size={20} />
                      <span className="price">
                        ₹{pkg.total_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="info-item">
                      <MapPin size={18} />
                      <span>{pkg.cities.length} Cities</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={18} />
                      <span>{pkg.duration_days} Days</span>
                    </div>
                  </div>
                </div>
                <div className="expand-icon">
                  <ChevronRight size={20} />
                </div>
              </div>
              
              <div className="package-actions">
                <button 
                  className="book-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookClick(pkg);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && !loading && (
          <div className="empty-state">
            <MapPin size={48} />
            <h3 className="empty-title">No packages available</h3>
            <p className="empty-subtitle">
              Check back later for exciting travel packages!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageList;