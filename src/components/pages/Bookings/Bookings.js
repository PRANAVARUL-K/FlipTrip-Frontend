import React, { useState, useEffect } from 'react';
import { Download, Plane, Calendar, Users, CreditCard } from 'lucide-react';

// Import the actual getCookie utility
import { getCookie } from '../../../utils/SessionUtils';

// CSS Styles Component
const BookingStyles = () => (
  <style jsx>{`
    .tbm-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .tbm-header {
      text-align: center;
      margin-bottom: 30px;
      color: #1f2937;
    }

    .tbm-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .tbm-header p {
      color: #6b7280;
      font-size: 1rem;
    }

    .tbm-loading {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }

    .tbm-error {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .tbm-booking-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .tbm-booking-header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px;
    }

    .tbm-booking-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .tbm-booking-id {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .tbm-booking-status {
      background: #059669;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .tbm-booking-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }

    .tbm-meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
    }

    .tbm-meta-icon {
      width: 16px;
      height: 16px;
    }

    .tbm-passengers-section {
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
    }

    .tbm-section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tbm-passengers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .tbm-passenger-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }

    .tbm-passenger-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .tbm-passenger-detail {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 4px;
    }

    .tbm-tickets-section {
      padding: 20px;
    }

    .tbm-tickets-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .tbm-view-tickets-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tbm-view-tickets-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }

    .tbm-tickets-count {
      background: #d1fae5;
      color: #059669;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .tbm-container {
        padding: 16px;
      }
      
      .tbm-booking-info {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .tbm-booking-meta {
        grid-template-columns: 1fr;
      }
      
      .tbm-passengers-grid {
        grid-template-columns: 1fr;
      }
    }
  `}</style>
);

// Flight Ticket Details Component
const FlightTicketDetails = ({ tickets, onClose }) => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;

  useEffect(() => {
    fetchTicketDetails();
  }, [tickets]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${backendUrl}/trip_package/fetch_ticket_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickets })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTicketDetails(data.results);
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Failed to fetch ticket details');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (flight) => {
    // Create a fancy HTML ticket layout with airline-specific theming
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flight Ticket - ${flight.flight_number}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          }
          
          .ticket { 
            background: white;
            border-radius: 20px; 
            padding: 0;
            max-width: 700px; 
            margin: 0 auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
          }
          
          .ticket::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -10px;
            width: 20px;
            height: 20px;
            background: #f0f9ff;
            border-radius: 50%;
            transform: translateY(-50%);
          }
          
          .ticket::after {
            content: '';
            position: absolute;
            top: 50%;
            right: -10px;
            width: 20px;
            height: 20px;
            background: #f0f9ff;
            border-radius: 50%;
            transform: translateY(-50%);
          }
          
          .header { 
            background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-top: 10px solid #065f46;
          }
          
          .airline { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .flight-number {
            font-size: 18px;
            font-weight: 500;
            opacity: 0.9;
            letter-spacing: 2px;
          }
          
          .main-content {
            padding: 30px;
          }
          
          .flight-route {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            padding: 25px;
            border-radius: 15px;
            border: 1px solid #bbf7d0;
          }
          
          .route-point {
            text-align: center;
            flex: 1;
          }
          
          .route-time {
            font-size: 20px;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 5px;
          }
          
          .route-date {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
            margin-bottom: 15px;
          }
          
          .route-location {
            border-top: 2px solid #059669;
            padding-top: 12px;
          }
          
          .airport-code {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 6px;
          }
          
          .airport-name {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
            line-height: 1.3;
          }
          
          .city-name {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
          }
          
          .route-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .route-arrow {
            flex: 0 0 60px;
            text-align: center;
            color: #059669;
            font-size: 24px;
            font-weight: bold;
          }
          
          .flight-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .detail-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #059669;
          }
          
          .detail-title {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
          }
          
          .detail-value {
            font-size: 18px;
            font-weight: 700;
            color: #065f46;
          }
          
          .passengers-section {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #bbf7d0;
          }
          
          .section-title {
            font-weight: 700;
            color: #065f46;
            font-size: 18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .passenger-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
          }
          
          .passenger {
            background: white;
            padding: 18px;
            border-radius: 10px;
            border: 1px solid #d1fae5;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
          }
          
          .passenger-name {
            font-weight: 700;
            color: #065f46;
            font-size: 16px;
            margin-bottom: 8px;
          }
          
          .passenger-info {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .booking-footer {
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 0 0 20px 20px;
          }
          
          .booking-ref {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .qr-placeholder {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 8px;
            margin: 15px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
          }
          
          .boarding-note {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 10px;
          }
          
          .dashed-line {
            border-top: 2px dashed #d1d5db;
            margin: 25px 0;
            position: relative;
          }
          
          @media print {
            body { background: white; padding: 0; }
            .ticket { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="airline">${flight.airline_name}</div>
            <div class="flight-number">Flight ${flight.flight_number}</div>
          </div>
          
          <div class="main-content">
            <div class="flight-route">
              <div class="route-point">
                <div class="route-label">Departure</div>
                <div class="route-time">${new Date(flight.departure_time).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="route-date">${new Date(flight.departure_time).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                <div class="route-location">
                  <div class="airport-code">${flight.source_airport_code}</div>
                  <div class="airport-name">${flight.source_airport_name}</div>
                  <div class="city-name">${flight.source_city_name}</div>
                </div>
              </div>
              <div class="route-arrow">✈️</div>
              <div class="route-point">
                <div class="route-label">Arrival</div>
                <div class="route-time">${new Date(flight.arrival_time).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</div>
                <div class="route-date">${new Date(flight.arrival_time).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                <div class="route-location">
                  <div class="airport-code">${flight.destination_airport_code}</div>
                  <div class="airport-name">${flight.destination_airport_name}</div>
                  <div class="city-name">${flight.destination_city_name}</div>
                </div>
              </div>
            </div>
            
            <div class="flight-details">
              <div class="detail-card">
                <div class="detail-title">Total Fare</div>
                <div class="detail-value">₹${flight.total_price.toLocaleString()}</div>
              </div>
              <div class="detail-card">
                <div class="detail-title">Status</div>
                <div class="detail-value" style="text-transform: capitalize;">${flight.status}</div>
              </div>
            </div>
            
            <div class="dashed-line"></div>
            
            <div class="passengers-section">
              <div class="section-title">
                👥 Passengers (${flight.passenger_count})
              </div>
              <div class="passenger-grid">
                ${flight.passengers.map(passenger => `
                  <div class="passenger">
                    <div class="passenger-name">${passenger.name}</div>
                    <div class="passenger-info">Age: ${passenger.age} years</div>
                    <div class="passenger-info">Gender: ${passenger.gender}</div>
                    <div class="passenger-info">Passport: ${passenger.passport_no}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="booking-footer">
            <div class="booking-ref">Booking Reference: ${flight.booking_id}</div>
            <div class="qr-placeholder">QR CODE</div>
            <div class="boarding-note">Please arrive at the airport at least 2 hours before departure</div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="ftd-overlay">
        <div className="ftd-modal">
          <div className="ftd-loading">Loading ticket details...</div>
        </div>
        <style jsx>{`
          .ftd-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .ftd-modal {
            background: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
          }
          .ftd-loading {
            text-align: center;
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ftd-overlay">
      <div className="ftd-modal">
        <div className="ftd-header">
          <h2 className="ftd-title">Flight Ticket Details</h2>
          <button className="ftd-close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="ftd-error">{error}</div>}
        
        <div className="ftd-tickets-list">
          {ticketDetails.map((flight, index) => (
            <div key={index} className="ftd-ticket-card">
              <div className="ftd-ticket-header">
                <div className="ftd-airline">
                  <Plane className="ftd-plane-icon" />
                  <span>{flight.airline_name}</span>
                </div>
                <div className="ftd-flight-number">{flight.flight_number}</div>
              </div>
              
              <div className="ftd-flight-times">
                <div className="ftd-time-block">
                  <div className="ftd-time-label">Departure</div>
                  <div className="ftd-time">{new Date(flight.departure_time).toLocaleString()}</div>
                  <div className="ftd-airport-info">
                    <div className="ftd-airport-code">{flight.source_airport_code}</div>
                    <div className="ftd-airport-name">{flight.source_airport_name}</div>
                    <div className="ftd-city-name">{flight.source_city_name}</div>
                  </div>
                </div>
                <div className="ftd-arrow">→</div>
                <div className="ftd-time-block">
                  <div className="ftd-time-label">Arrival</div>
                  <div className="ftd-time">{new Date(flight.arrival_time).toLocaleString()}</div>
                  <div className="ftd-airport-info">
                    <div className="ftd-airport-code">{flight.destination_airport_code}</div>
                    <div className="ftd-airport-name">{flight.destination_airport_name}</div>
                    <div className="ftd-city-name">{flight.destination_city_name}</div>
                  </div>
                </div>
              </div>
              
              <div className="ftd-ticket-details">
                <div className="ftd-detail-row">
                  <span>Price:</span>
                  <span>₹{flight.total_price.toLocaleString()}</span>
                </div>
                <div className="ftd-detail-row">
                  <span>Passengers:</span>
                  <span>{flight.passenger_count}</span>
                </div>
                <div className="ftd-detail-row">
                  <span>Status:</span>
                  <span className="ftd-status">{flight.status}</span>
                </div>
              </div>
              
              <div className="ftd-passengers">
                <div className="ftd-passengers-title">Passengers:</div>
                {flight.passengers.map((passenger, pIndex) => (
                  <div key={pIndex} className="ftd-passenger">
                    {passenger.name} ({passenger.age}y, {passenger.gender}) - {passenger.passport_no}
                  </div>
                ))}
              </div>
              
              <button 
                className="ftd-download-btn"
                onClick={() => generatePDF(flight)}
              >
                <Download className="ftd-download-icon" />
                Download Ticket PDF
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .ftd-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .ftd-modal {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }
        
        .ftd-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        }
        
        .ftd-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .ftd-close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          padding: 5px;
          border-radius: 4px;
        }
        
        .ftd-close-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .ftd-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 16px;
          border-radius: 8px;
          margin: 20px;
        }
        
        .ftd-tickets-list {
          padding: 20px;
        }
        
        .ftd-ticket-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .ftd-ticket-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .ftd-airline {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1f2937;
          font-size: 1.1rem;
        }
        
        .ftd-plane-icon {
          width: 20px;
          height: 20px;
          color: #10b981;
        }
        
        .ftd-flight-number {
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
        }
        
        .ftd-flight-times {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 16px;
          background: white;
          border-radius: 8px;
        }
        
        .ftd-time-block {
          text-align: center;
          flex: 1;
        }
        
        .ftd-time-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .ftd-time {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }
        
        .ftd-airport-info {
          border-top: 1px solid #e5e7eb;
          padding-top: 8px;
        }
        
        .ftd-airport-code {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 4px;
        }
        
        .ftd-airport-name {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 2px;
          line-height: 1.2;
        }
        
        .ftd-city-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }
        
        .ftd-arrow {
          font-size: 1.5rem;
          color: #10b981;
          font-weight: bold;
        }
        
        .ftd-ticket-details {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .ftd-detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .ftd-detail-row:last-child {
          margin-bottom: 0;
        }
        
        .ftd-status {
          background: #059669;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.875rem;
          text-transform: capitalize;
        }
        
        .ftd-passengers {
          background: white;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .ftd-passengers-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .ftd-passenger {
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 6px;
          font-size: 0.9rem;
        }
        
        .ftd-passenger:last-child {
          margin-bottom: 0;
        }
        
        .ftd-download-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .ftd-download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        .ftd-download-icon {
          width: 18px;
          height: 18px;
        }
        
        @media (max-width: 768px) {
          .ftd-flight-times {
            flex-direction: column;
            gap: 16px;
          }
          
          .ftd-arrow {
            transform: rotate(90deg);
          }
          
          .ftd-ticket-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

// Main Booking List Component
const TripBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(null);
  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = parseInt(getCookie('userId'));
      
      if (!userId) {
        throw new Error('User ID not found in cookies');
      }
      
      const response = await fetch(`${backendUrl}/trip_package/view_bookings/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(`Failed to fetch bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="tbm-container">
        <BookingStyles />
        <div className="tbm-loading">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tbm-container">
        <BookingStyles />
        <div className="tbm-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tbm-container">
      <BookingStyles />
      
      <div className="tbm-header">
        <h1>Your Trip Bookings</h1>
        <p>Manage and view your flight bookings</p>
      </div>

      {bookings.map((booking) => (
        <div key={booking.booking_id} className="tbm-booking-card">
          <div className="tbm-booking-header">
            <div className="tbm-booking-info">
              <div className="tbm-booking-id">
                Booking #{booking.booking_id}
              </div>
              <div className="tbm-booking-status">
                {booking.status}
              </div>
            </div>
            
            <div className="tbm-booking-meta">
              <div className="tbm-meta-item">
                <Calendar className="tbm-meta-icon" />
                <span>{formatDate(booking.booking_date)}</span>
              </div>
              <div className="tbm-meta-item">
                <CreditCard className="tbm-meta-icon" />
                <span>{formatAmount(booking.total_amount)}</span>
              </div>
              <div className="tbm-meta-item">
                <Users className="tbm-meta-icon" />
                <span>{booking.passengers.length} Passengers</span>
              </div>
            </div>
          </div>

          <div className="tbm-passengers-section">
            <div className="tbm-section-title">
              <Users className="tbm-meta-icon" />
              Passengers
            </div>
            <div className="tbm-passengers-grid">
              {booking.passengers.map((passenger) => (
                <div key={passenger.passenger_id} className="tbm-passenger-card">
                  <div className="tbm-passenger-name">{passenger.full_name}</div>
                  <div className="tbm-passenger-detail">Age: {passenger.age} years</div>
                  <div className="tbm-passenger-detail">Gender: {passenger.gender}</div>
                  <div className="tbm-passenger-detail">Passport: {passenger.passport_number}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="tbm-tickets-section">
            <div className="tbm-tickets-header">
              <div className="tbm-section-title">
                <Plane className="tbm-meta-icon" />
                Flight Tickets
                <span className="tbm-tickets-count">
                  {booking.tickets.length} tickets
                </span>
              </div>
              <button 
                className="tbm-view-tickets-btn"
                onClick={() => setSelectedTickets(booking.tickets)}
              >
                <Plane className="tbm-meta-icon" />
                View Tickets
              </button>
            </div>
          </div>
        </div>
      ))}

      {selectedTickets && (
        <FlightTicketDetails 
          tickets={selectedTickets}
          onClose={() => setSelectedTickets(null)}
        />
      )}
    </div>
  );
};

export default TripBookingsList;