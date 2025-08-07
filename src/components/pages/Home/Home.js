// components/Home/Home.js
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './Home.css';
import PackageExplorer from '../LangingPage/Packages/Packages';

const Home = () => {
  const [selectedSource, setSelectedSource] = useState(null);
  // const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [budget, setBudget] = useState(null);
  const [headCount, setHeadCount] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const [animatedStats, setAnimatedStats] = useState({
    bookings: 0,
    destinations: 0,
    customers: 0,
    packages: 0
  });

  const [packageResults, setPackageResults] = useState([]);

  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;
  const emailServiceUrl = process.env.REACT_APP_EMAIL_SERVICE_URL;

  // Animate statistics on component mount
  useEffect(() => {
    const targetStats = {
      bookings: 2847,
      destinations: 156,
      customers: 15420,
      packages: 340
    };

    const animateValue = (key, target, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(start) }));
      }, 16);
    };

    // Stagger the animations
    setTimeout(() => animateValue('bookings', targetStats.bookings), 200);
    setTimeout(() => animateValue('destinations', targetStats.destinations), 400);
    setTimeout(() => animateValue('customers', targetStats.customers), 600);
    setTimeout(() => animateValue('packages', targetStats.packages), 800);
  }, []);

  // Sample data for cities
  const cities = [
    { name: 'Mumbai', code: 'MUM' },
    { name: 'Delhi', code: 'DEL' },
    { name: 'Bangalore', code: 'BLR' },
    { name: 'Chennai', code: 'MAA' },
    { name: 'Kochi', code: 'COK' },
    { name: 'Kolkata', code: 'CCU' },
    { name: 'Hyderabad', code: 'HYD' },
    { name: 'Pune', code: 'PNQ' },
    { name: 'Ahmedabad', code: 'AMD' },
    { name: 'Jaipur', code: 'JAI' },
    { name: 'Surat', code: 'STV' },
    { name: 'Lucknow', code: 'LKO' },
    { name: 'Kanpur', code: 'KNU' },
    { name: 'Nagpur', code: 'NAG' },
    { name: 'Indore', code: 'IDR' },
    { name: 'Thane', code: 'THN' },
    { name: 'Bhopal', code: 'BHO' },
    { name: 'Visakhapatnam', code: 'VTZ' },
    { name: 'Pimpri-Chinchwad', code: 'PCM' },
    { name: 'Patna', code: 'PAT' },
    { name: 'Vadodara', code: 'BDQ' },
    { name: 'Ghaziabad', code: 'GZB' },
    { name: 'Ludhiana', code: 'LUH' },
    { name: 'Agra', code: 'AGR' },
    { name: 'Nashik', code: 'ISK' },
    { name: 'Faridabad', code: 'FDB' },
    { name: 'Meerut', code: 'MRT' },
    { name: 'Rajkot', code: 'RAJ' },
    { name: 'Kalyan-Dombivali', code: 'KYN' },
    { name: 'Vasai-Virar', code: 'VVR' },
    { name: 'Varanasi', code: 'VNS' },
    { name: 'Singapore', code: 'SIN' },
    { name: 'Los Angeles', code: 'LAX' }
  ];

  // Popular destinations data
  const popularDestinations = [
    { name: 'Goa', image: '🏖️', bookings: 1245 },
    { name: 'Kerala', image: '🌴', bookings: 987 },
    { name: 'Rajasthan', image: '🏰', bookings: 856 },
    { name: 'Himachal', image: '🏔️', bookings: 743 },
    { name: 'Kashmir', image: '❄️', bookings: 654 },
    { name: 'Uttarakhand', image: '⛰️', bookings: 532 }
  ];

  // Travel tips data
  const travelTips = [
    { icon: '💡', tip: 'Book in advance for better deals', color: '#4CAF50' },
    { icon: '🎒', tip: 'Pack light for easier travel', color: '#66BB6A' },
    { icon: '📱', tip: 'Keep digital copies of documents', color: '#81C784' },
    { icon: '🌍', tip: 'Research local customs and culture', color: '#A5D6A7' }
  ];

  const formatDate = (date) => {
    console.log("date:", date);
    if (!date) return '';
    
    const d = new Date(date); // Convert string to Date object
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };


  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSearch = async () => {
    console.log("date from Search:", selectedDate);
    const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString('en-CA') // YYYY-MM-DD in local time
      : null;
    const params = {
      head_count: headCount,
      start_date: formattedDate,
      starting_place: selectedSource.name,
      budget: (budget/headCount)
    };
    console.log('Individual budget', budget/headCount);
    const Searchparams = {
      headCount: headCount,
      date: formattedDate,
      source: selectedSource,
      budget: budget
    };

    setSearchParams(Searchparams);
    setShowResults(true);
    console.log('Search Parameters:', params);

    try {
      const response = await fetch(`${backendUrl}/trip_package/filter_package`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });

      if (response.ok) {
        const data = await response.json();
        setPackageResults(data); // store API response
        console.log('Package results:', data);
      } else {
        console.error('API call failed');
        setPackageResults([]); // clear results on error
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackageResults([]); // clear results on exception
    }
  };

  const handleBack = () => {
    setShowResults(false);
    setSearchParams(null);
    setPackageResults([]);
  };

  const handleReset = () => {
    setSelectedSource(null);
    // setSelectedDestination(null);
    setSelectedDate(null);
    setBudget(null);
    setHeadCount(null);
  };

  // Check if all required fields are filled
  const isSearchEnabled = selectedSource && selectedDate && budget && headCount;

  if (showResults && searchParams) {
    return (
      <div className="home-container">
        {/* Search Results Header */}
        <Card className="search-results-header">
          <div className="results-header-content">
            <div className="search-params-inline">
              <div className="param-item">
                <span className="param-label">From:</span>
                <span className="param-value">{searchParams.source?.name}</span>
              </div>
              
              {/* {searchParams.destination && (
                <div className="param-item">
                  <span className="param-label">To:</span>
                  <span className="param-value">{searchParams.destination.name}</span>
                </div>
              )} */}
              
              <div className="param-item">
                <span className="param-label">Date:</span>
                <span className="param-value">{formatDate(searchParams.date)}</span>
              </div>
              
              <div className="param-item">
                <span className="param-label">Budget:</span>
                <span className="param-value">{formatCurrency(searchParams.budget)}</span>
              </div>

              <div className="param-item">
                <span className="param-label">Head Count:</span>
                <span className="param-value">{searchParams.headCount} {searchParams.headCount === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
            
            <Button
              icon="pi pi-edit"
              label="Modify Search"
              onClick={handleBack}
              className="modify-button"
              size="small"
            />
          </div>
        </Card>
        
        {/* Package Explorer Results */}
        {packageResults && (
          <PackageExplorer searchParams={searchParams} packageResults={packageResults} />
        )}

      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Floating Animation Elements */}
      <div className="floating-elements">
        <div className="floating-icon floating-icon-1">✈️</div>
        <div className="floating-icon floating-icon-2">🏖️</div>
        <div className="floating-icon floating-icon-3">🏔️</div>
        <div className="floating-icon floating-icon-4">🎒</div>
        <div className="floating-icon floating-icon-5">🗺️</div>
      </div>

      {/* Booking Search Form */}
      <Card className="booking-search-card" style={{background: "none"}}>
        <div className="booking-search-header">
          <h3 className="search-title">Find Your Perfect Trip</h3>
          <p className="search-subtitle">Search and book your travel with ease</p>
        </div>
        
        <div className="booking-search-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="source" className="field-label">From *</label>
              <Dropdown
                id="source"
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Select Source City"
                filter
                showClear
                className="search-dropdown"
              />
            </div>
            
            {/* <div className="form-field">
              <label htmlFor="destination" className="field-label">To</label>
              <Dropdown
                id="destination"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.value)}
                options={cities}
                optionLabel="name"
                placeholder="Select Destination (Optional)"
                filter
                showClear
                className="search-dropdown"
              />
            </div> */}

            <div className="form-field">
              <label htmlFor="headCount" className="field-label">Head Count *</label>
              <InputNumber
                id="headCount"
                value={headCount}
                onValueChange={(e) => setHeadCount(e.value)}
                placeholder="Number of people"
                min={1}
                max={20}
                className="search-input-number"
                suffix={headCount === 1 ? " person" : " people"}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="date" className="field-label">Travel Date *</label>
              <Calendar
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
                placeholder="Select Date"
                showIcon
                minDate={new Date()}
                className="search-calendar"
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="budget" className="field-label">Budget (₹) *</label>
              <InputNumber
                id="budget"
                value={budget}
                onValueChange={(e) => setBudget(e.value)}
                placeholder="Enter your budget"
                prefix="₹ "
                min={0}
                max={1000000}
                className="search-input-number"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <Button
              label="Search Packages"
              icon="pi pi-search"
              onClick={handleSearch}
              className="search-button"
              disabled={!isSearchEnabled}
            />
            <Button
              label="Reset"
              icon="pi pi-refresh"
              onClick={handleReset}
              outlined
              className="reset-button"
            />
          </div>
          
          {!isSearchEnabled && (
            <div className="form-note">
              <i className="pi pi-info-circle"></i>
              <span>Please fill in all required fields (*) to search</span>
            </div>
          )}
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="stats-section">
        <h3 className="section-title">Why Choose Us</h3>
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon booking-icon">
                <i className="pi pi-calendar-plus"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">{animatedStats.bookings.toLocaleString()}</div>
                <div className="stat-label">Happy Bookings</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon destination-icon">
                <i className="pi pi-map-marker"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">{animatedStats.destinations}</div>
                <div className="stat-label">Destinations</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon customer-icon">
                <i className="pi pi-users"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">{animatedStats.customers.toLocaleString()}</div>
                <div className="stat-label">Satisfied Customers</div>
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-content">
              <div className="stat-icon package-icon">
                <i className="pi pi-gift"></i>
              </div>
              <div className="stat-info">
                <div className="stat-value">{animatedStats.packages}</div>
                <div className="stat-label">Travel Packages</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="destinations-section">
        <h3 className="section-title">Popular Destinations</h3>
        <div className="destinations-grid">
          {popularDestinations.map((dest, index) => (
            <Card key={dest.name} className={`destination-card destination-card-${index + 1}`}>
              <div className="destination-content">
                <div className="destination-image">{dest.image}</div>
                <div className="destination-info">
                  <h4 className="destination-name">{dest.name}</h4>
                  <p className="destination-bookings">{dest.bookings} bookings this month</p>
                </div>
                <div className="destination-overlay">
                  <Button 
                    label="Explore" 
                    icon="pi pi-arrow-right"
                    className="explore-button"
                    size="small"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Travel Tips */}
      <div className="tips-section">
        <h3 className="section-title">Travel Tips</h3>
        <div className="tips-grid">
          {travelTips.map((tip, index) => (
            <Card key={index} className={`tip-card tip-card-${index + 1}`}>
              <div className="tip-content">
                <div className="tip-icon" style={{ color: tip.color }}>
                  {tip.icon}
                </div>
                <p className="tip-text">{tip.tip}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Animated Wave Background */}
      <div className="wave-background">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,100 600,20 1200,60 L1200,120 L0,120 Z" className="wave-path-1"></path>
          <path d="M0,80 C300,120 600,40 1200,80 L1200,120 L0,120 Z" className="wave-path-2"></path>
        </svg>
      </div>
    </div>
  );
};

export default Home;