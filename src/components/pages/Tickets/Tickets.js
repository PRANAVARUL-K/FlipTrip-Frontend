import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import './Tickets.css';
import { getCookie } from '../../../utils/SessionUtils';

const Tickets = () => {
  const [allTickets, setAllTickets] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingOptions, setBookingOptions] = useState([]);

  useEffect(() => {
    fetchTicketsData();
  }, []);

  const fetchTicketsData = async () => {
    try {
      setLoading(true);
      const userId = parseInt(getCookie('userId'));
      
      if (!userId) {
        setError('User ID not found. Please login again.');
        return;
      }

      // First, fetch all bookings
      const bookingsResponse = await fetch(`http://127.0.0.1:8000/trip_package/view_bookings/${userId}`);
      
      if (!bookingsResponse.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const bookingsData = await bookingsResponse.json();
      
      // Prepare booking options for dropdown
      const options = [
        { label: 'All Bookings', value: null },
        ...bookingsData.map(booking => ({
          label: `BK-${booking.booking_id}`,
          value: `BK-${booking.booking_id}`
        }))
      ];
      setBookingOptions(options);

      // Collect all tickets from all bookings
      const allTicketsFromBookings = [];
      
      for (const booking of bookingsData) {
        if (booking.tickets.length > 0) {
          // Fetch ticket details for this booking
          const ticketDetailsResponse = await fetch('http://127.0.0.1:8000/trip_package/fetch_ticket_details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets: booking.tickets }),
          });

          if (ticketDetailsResponse.ok) {
            const ticketDetailsData = await ticketDetailsResponse.json();
            const ticketDetails = ticketDetailsData.results || [];

            // Map tickets with their details and booking info
            booking.tickets.forEach(ticket => {
              const detail = ticketDetails.find(d => d.booking_id === ticket.flight_booking_id);
              if (detail) {
                // Map each passenger to a separate ticket entry
                detail.passengers.forEach((passenger, passengerIndex) => {
                  allTicketsFromBookings.push({
                    ticket_id: `${ticket.ticket_id}-${passengerIndex + 1}`,
                    original_ticket_id: ticket.ticket_id,
                    booking: {
                      booking_id: `BK-${booking.booking_id}`,
                      booking_date: booking.booking_date,
                      total_amount: booking.total_amount,
                      status: booking.status,
                      passenger_count: booking.passengers.length
                    },
                    flight_booking_id: ticket.flight_booking_id,
                    flight_details: {
                      flight_number: detail.flight_number,
                      airline: detail.airline_name,
                      departure: detail.departure_time,
                      arrival: detail.arrival_time,
                      status: detail.status,
                      total_price: detail.total_price
                    },
                    passenger: {
                      name: passenger.name,
                      age: passenger.age,
                      gender: passenger.gender,
                      passport_no: passenger.passport_no
                    },
                    status: detail.status === 'confirmed' ? 'issued' : 'pending'
                  });
                });
              }
            });
          }
        }
      }

      setAllTickets(allTicketsFromBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Issued', value: 'issued' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  // Filter tickets based on selected booking and status
  const filteredTickets = allTickets.filter(ticket => {
    const bookingMatch = !selectedBooking || ticket.booking.booking_id === selectedBooking;
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    return bookingMatch && statusMatch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getRouteFromTimes = (departure, arrival) => {
    // Extract location codes or create a simple route display
    const depDate = new Date(departure);
    const arrDate = new Date(arrival);
    return `${depDate.toLocaleDateString()} → ${arrDate.toLocaleDateString()}`;
  };

  const handleViewDetails = (ticket) => {
    // Handle view details action
    console.log('View details for ticket:', ticket.ticket_id);
    // You can implement modal or navigation logic here
  };

  const handleDownloadTicket = (ticket) => {
    // Handle download ticket action
    console.log('Download ticket:', ticket.ticket_id);
    // You can implement download logic here
  };

  if (loading) {
    return (
      <div className="flight-tickets-main-container">
        <div className="flight-tickets-loading-wrapper">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', color: '#4a7c59' }}></i>
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flight-tickets-main-container">
        <div className="flight-tickets-error-wrapper">
          <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', color: '#d32f2f' }}></i>
          <p>Error: {error}</p>
          <Button label="Retry" onClick={fetchTicketsData} className="flight-tickets-retry-button" />
        </div>
      </div>
    );
  }

  return (
    <div className="flight-tickets-main-container">
      <h1 className="flight-tickets-page-title">Flight Tickets</h1>
      
      <div className="flight-tickets-main-content">
        <div className="flight-tickets-content-header">
          <h3 className="flight-tickets-section-heading">All Flight Tickets</h3>
          
          <div className="flight-tickets-filters-wrapper">
            <div className="flight-tickets-filter-group">
              <label className="flight-tickets-filter-label">Filter by Booking:</label>
              <Dropdown
                value={selectedBooking}
                options={bookingOptions}
                onChange={(e) => setSelectedBooking(e.value)}
                placeholder="Select Booking"
                className="flight-tickets-booking-dropdown"
              />
            </div>
            
            <div className="flight-tickets-filter-group">
              <label className="flight-tickets-filter-label">Filter by Status:</label>
              <Dropdown
                value={filterStatus}
                options={statusOptions}
                onChange={(e) => setFilterStatus(e.value)}
                className="flight-tickets-status-dropdown"
              />
            </div>
          </div>
        </div>
        
        <div className="flight-tickets-statistics-row">
          <div className="flight-tickets-stat-item">
            <div className="flight-tickets-stat-number">{filteredTickets.length}</div>
            <div className="flight-tickets-stat-description">Total Tickets</div>
          </div>
          <div className="flight-tickets-stat-item">
            <div className="flight-tickets-stat-number">
              {filteredTickets.filter(t => t.status === 'issued').length}
            </div>
            <div className="flight-tickets-stat-description">Issued</div>
          </div>
          <div className="flight-tickets-stat-item">
            <div className="flight-tickets-stat-number">
              {filteredTickets.filter(t => t.status === 'pending').length}
            </div>
            <div className="flight-tickets-stat-description">Pending</div>
          </div>
        </div>
        
        <div className="flight-tickets-list-container">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <div key={index} className="flight-ticket-individual-card">
                <div className="flight-ticket-card-header">
                  <div className="flight-ticket-id-section">
                    <div className="flight-ticket-id-display">
                      <i className="pi pi-ticket"></i>
                      {ticket.ticket_id}
                    </div>
                    <div className="flight-ticket-booking-link">
                      <i className="pi pi-link"></i>
                      Booking: {ticket.booking.booking_id}
                    </div>
                  </div>
                  <div className="flight-ticket-status-wrapper">
                    <span className={`flight-ticket-status-badge ${ticket.status}`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flight-ticket-card-body">
                  <div className="flight-ticket-flight-details">
                    <div className="flight-ticket-flight-header">
                      <div className="flight-ticket-airline-info">
                        <i className="pi pi-send"></i>
                        <span className="flight-ticket-flight-number">{ticket.flight_details.flight_number}</span>
                        <span className="flight-ticket-airline-name">{ticket.flight_details.airline}</span>
                      </div>
                      <div className="flight-ticket-route-display">{getRouteFromTimes(ticket.flight_details.departure, ticket.flight_details.arrival)}</div>
                    </div>
                    
                    <div className="flight-ticket-times-container">
                      <div className="flight-ticket-time-block">
                        <div className="flight-ticket-time-label">Departure</div>
                        <div className="flight-ticket-date-value">
                          {formatDate(ticket.flight_details.departure)}
                        </div>
                        <div className="flight-ticket-time-value">
                          {formatTime(ticket.flight_details.departure)}
                        </div>
                      </div>
                      <div className="flight-ticket-duration-arrow">
                        <i className="pi pi-arrow-right"></i>
                      </div>
                      <div className="flight-ticket-time-block">
                        <div className="flight-ticket-time-label">Arrival</div>
                        <div className="flight-ticket-date-value">
                          {formatDate(ticket.flight_details.arrival)}
                        </div>
                        <div className="flight-ticket-time-value">
                          {formatTime(ticket.flight_details.arrival)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flight-ticket-passenger-booking-grid">
                    <div className="flight-ticket-passenger-section">
                      <h4>Passenger Details</h4>
                      <div className="flight-ticket-passenger-details">
                        <div className="flight-ticket-passenger-name">
                          <i className="pi pi-user"></i>
                          {ticket.passenger.name}
                        </div>
                        <div className="flight-ticket-passenger-metadata">
                          <span>Age: {ticket.passenger.age}</span>
                          <span>Gender: {ticket.passenger.gender}</span>
                          <span>Passport: {ticket.passenger.passport_no}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flight-ticket-booking-section">
                      <h4>Booking Details</h4>
                      <div className="flight-ticket-booking-details">
                        <div className="flight-ticket-booking-customer">
                          <i className="pi pi-calendar"></i>
                          {formatDate(ticket.booking.booking_date)}
                        </div>
                        <div className="flight-ticket-booking-package">
                          {ticket.booking.passenger_count} Passenger{ticket.booking.passenger_count > 1 ? 's' : ''}
                        </div>
                        <div className="flight-ticket-booking-amount">
                          Flight Booking: {ticket.flight_booking_id}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flight-ticket-action-buttons">
                    <Button 
                      label="View Details" 
                      icon="pi pi-eye" 
                      className="flight-ticket-view-button" 
                      size="small"
                      onClick={() => handleViewDetails(ticket)}
                    />
                    <Button 
                      label="Download" 
                      icon="pi pi-download" 
                      className="flight-ticket-download-button" 
                      size="small"
                      disabled={ticket.status !== 'issued'}
                      onClick={() => handleDownloadTicket(ticket)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flight-tickets-empty-state">
              <div className="flight-tickets-empty-icon">
                <i className="pi pi-info-circle"></i>
              </div>
              <div className="flight-tickets-empty-message">
                <h3>No tickets found</h3>
                <p>No tickets match your current filter criteria.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tickets;