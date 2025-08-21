import React, { useState, useEffect } from 'react';
import { Download, Plane, Calendar, Users, CreditCard, X, AlertTriangle, RefreshCw} from 'lucide-react';
import ItineraryViewBookings from './ItineraryViewBookings';
import FlightSelectionBooking from './FlightSelectionsBooking';
import './Bookings.css'
import { getCookie } from '../../../utils/SessionUtils';

// Mock getCookie utility (replace with actual implementation)
// const getCookie = (name) => {
//   return '2'; // Mock user ID for demo
// };

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
      transition: all 0.2s;
    }

    .tbm-booking-card.cancelled {
      border-color: #ef4444;
      box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.1);
    }

    .tbm-booking-header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px;
      position: relative;
    }

    .tbm-booking-header.cancelled {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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

    .tbm-booking-status.cancelled {
      background: #dc2626;
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

    .tbm-cancel-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
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
      margin-left: 8px;
    }

    .tbm-cancel-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .tbm-tickets-count {
      background: #d1fae5;
      color: #059669;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .tbm-action-buttons {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Confirmation Modal Styles */
    .confirmation-overlay {
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

    .confirmation-modal {
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .confirmation-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .confirmation-icon {
      width: 24px;
      height: 24px;
      color: #ef4444;
    }

    .confirmation-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .confirmation-message {
      color: #6b7280;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .confirmation-buttons {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .confirm-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .cancel-btn {
      background: #f3f4f6;
      color: #374151;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-btn:hover {
      background: #e5e7eb;
    }

    .cancelled-badge {
      position: absolute;
      top: 15px;
      right: 20px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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

      .tbm-tickets-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .tbm-action-buttons {
        width: 100%;
      }

      .tbm-view-tickets-btn,
      .tbm-cancel-btn {
        flex: 1;
      }
    }
  `}</style>
);

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, booking }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <AlertTriangle className="confirmation-icon" />
          <h3 className="confirmation-title">Cancel Booking</h3>
        </div>
        <p className="confirmation-message">
          Are you sure you want to cancel booking #{booking?.booking_id}? 
          This action cannot be undone and may result in cancellation charges.
        </p>
        <div className="confirmation-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Keep Booking
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

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

const TripBookingsList = () => {
  // Sample data based on the provided JSON
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    booking: null
  });

  // New states for alter plan functionality
  const [showItinerary, setShowItinerary] = useState(false);
  const [flightPlan, setFlightPlan] = useState([]);
  const [spotSchedule, setSpotSchedule] = useState([]);
  const [endFlightOptions, setEndFlightOptions] = useState([]);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  
  // States for flight selection and consolidated data
  const [showEndFlightSelection, setShowEndFlightSelection] = useState(false);
  const [consolidatedFlights, setConsolidatedFlights] = useState([]);
  const [selectedFlightPlan, setSelectedFlightPlan] = useState([]);
  const [bookingPassengers, setBookingPassengers] = useState([]);
  const [headCount, setHeadCount] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const backendUrl = process.env.REACT_APP_TOUR_PACKAGE_BACKEND_URL;
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = parseInt(getCookie('userId'));
      console.log("fetched userID: ",userId);
      
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

  const handleCancelBooking = (booking) => {
    setConfirmationModal({
      isOpen: true,
      booking: booking
    });
  };

  const confirmCancellation = async () => {
    const { booking } = confirmationModal;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${backendUrl}/trip_package/cancel_booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: booking.booking_id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the booking status in local state
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.booking_id === booking.booking_id 
            ? { ...b, status: 'cancelled' }
            : b
        )
      );

      setConfirmationModal({ isOpen: false, booking: null });
      
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(`Failed to cancel booking: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, booking: null });
  };

  // Check if booking has any cancelled flight tickets
  const hasCancelledFlights = (booking) => {
    return booking.tickets && booking.tickets.some(ticket => ticket.flight_status === 'cancelled');
  };

  // Handle alter plan functionality
  const handleAlterPlan = async (booking) => {
    try {
      setCurrentBooking(booking);
      setItineraryLoading(true);
      setShowItinerary(true);

      // Extract package start date and format it to "YYYY-MM-DD HH:MM"
      const packageStartDate = new Date(booking.package_startdate);
      const formattedStartDate = packageStartDate.toISOString().slice(0, 16);

      const payload = {
        head_count: booking.passengers.length,
        package_id: booking.package.package_id,
        src_to_first_arrival_time: formattedStartDate,
        source: booking.source_place,
      };

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

      // Call end flight options API after getting the flight plan
      await handleEndFlightOptions(data, booking);
      
    } catch (error) {
      console.error("Failed to generate flight plan:", error);
      setFlightPlan([]);
      setSpotSchedule([]);
      setEndFlightOptions([]);
      setError(`Failed to generate flight plan: ${error.message}`);
    } finally {
      setItineraryLoading(false);
    }
  };

  // Handle end flight options API call
  const handleEndFlightOptions = async (flightPlanData, booking) => {
    try {
      if (!flightPlanData.spot_schedule || flightPlanData.spot_schedule.length === 0) {
        console.log("No spot schedule available for end flight options");
        return;
      }

      // Find the last spot from the spot schedule
      const lastCity = flightPlanData.spot_schedule[flightPlanData.spot_schedule.length - 1];
      const lastSpot = lastCity.spots[lastCity.spots.length - 1];

      // Format the end time to "YYYY-MM-DD HH:MM"
      const endDateTime = new Date(lastSpot.end_time);
      const formattedEndDateTime = endDateTime.toISOString().slice(0, 16).replace('T', ' ');

      const endFlightPayload = {
        spot_id: lastSpot.spot_id,
        package_id: booking.package.package_id,
        head_count: booking.passengers.length,
        package_date_end_date_time: formattedEndDateTime,
        customer_destination: booking.source_place
      };

      console.log("End Flight Options Payload:", endFlightPayload);

      const endFlightResponse = await fetch(`${backendUrl}/trip_package/end_flight_options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(endFlightPayload),
      });

      if (!endFlightResponse.ok) {
        throw new Error(`HTTP error! status: ${endFlightResponse.status}`);
      }

      const endFlightData = await endFlightResponse.json();
      console.log("End Flight Options Generated:", endFlightData);
      
      // Set the end flight options data
      setEndFlightOptions(endFlightData || []);
      
    } catch (error) {
      console.error("Failed to fetch end flight options:", error);
      setEndFlightOptions([]);
      // Don't set error here as it's a secondary call
    }
  };

  const handleBackFromItinerary = () => {
    setShowItinerary(false);
    setCurrentBooking(null);
    setFlightPlan([]);
    setSpotSchedule([]);
    setEndFlightOptions([]);
  };

  const handleBackFromFlightSelection = () => {
    setShowEndFlightSelection(false);
    setShowItinerary(true);
  };

  const handleEndFlightSelect = (selectedEndFlight) => {
    // Add the selected end flight to consolidated flights
    const endFlightDetails = {
      flight_id: selectedEndFlight.flights[0].flight_id, // Assuming single flight for return
      airline_name: selectedEndFlight.flights[0].airline_name,
      flight_number: selectedEndFlight.flights[0].flight_number,
      source_city: selectedEndFlight.flights[0].source_city,
      destination_city: selectedEndFlight.flights[0].destination_city,
      source_airport: selectedEndFlight.flights[0].source_airport,
      destination_airport: selectedEndFlight.flights[0].destination_airport,
      departure_time: selectedEndFlight.flights[0].departure_time,
      arrival_time: selectedEndFlight.flights[0].arrival_time,
      duration_minutes: selectedEndFlight.flights[0].duration_minutes,
      base_price: selectedEndFlight.flights[0].base_price,
      available_seats: selectedEndFlight.flights[0].available_seats,
      seats_required: headCount
    };

    // Add all flights from the selected end flight option (in case of connecting flights)
    const allEndFlights = selectedEndFlight.flights.map(flight => ({
      flight_id: flight.flight_id,
      airline_name: flight.airline_name,
      flight_number: flight.flight_number,
      source_city: flight.source_city,
      destination_city: flight.destination_city,
      source_airport: flight.source_airport,
      destination_airport: flight.destination_airport,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      duration_minutes: flight.duration_minutes,
      base_price: flight.base_price,
      available_seats: flight.available_seats,
      seats_required: headCount
    }));

    // Update consolidated flights with end flights
    setConsolidatedFlights(prev => [...prev, ...allEndFlights]);
    
    console.log("Selected End Flight:", selectedEndFlight);
    console.log("Updated Consolidated Flights:", [...consolidatedFlights, ...allEndFlights]);
    
    // Now call the update booking API
    handleUpdateBooking([...consolidatedFlights, ...allEndFlights]);
  };

  const handleUpdateBooking = async (allFlights) => {
    try {
      setLoading(true);

      const updatePayload = {
        booking_id: selectedBookingId,
        head_count: headCount,
        passengers: bookingPassengers.map(passenger => ({
          name: passenger.full_name,
          age: passenger.age,
          gender: passenger.gender,
          passport_no: passenger.passport_number
        })),
        flights: allFlights
      };

      console.log("Update Booking Payload:", updatePayload);

      const response = await fetch(`${backendUrl}/trip_package/update_booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Update Booking Response:", result);

      // Show success message and refresh bookings
      alert("Trip plan updated successfully!");
      await fetchBookings(); // Refresh the bookings list
      
      // Reset all states
      setShowEndFlightSelection(false);
      setConsolidatedFlights([]);
      setSelectedFlightPlan([]);
      setBookingPassengers([]);
      setHeadCount(0);
      setSelectedBookingId(null);
      setCurrentBooking(null);

    } catch (error) {
      console.error("Failed to update booking:", error);
      setError(`Failed to update booking: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmItinerary = () => {
    // Store all the consolidated flight details
    const allFlights = [];
    
    // Add inter-city flights from flight plan
    if (flightPlan && flightPlan.length > 0) {
      flightPlan.forEach(plan => {
        allFlights.push({
          flight_id: plan.flight.flight_id,
          airline_name: plan.flight.airline_name,
          flight_number: plan.flight.flight_number,
          source_city: plan.flight.source_city,
          destination_city: plan.flight.destination_city,
          source_airport: plan.flight.source_airport,
          destination_airport: plan.flight.destination_airport,
          departure_time: plan.flight.departure_time,
          arrival_time: plan.flight.arrival_time,
          duration_minutes: plan.flight.duration_minutes,
          base_price: plan.flight.base_price,
          available_seats: plan.flight.available_seats,
          seats_required: plan.head_count || currentBooking?.passengers.length || 1
        });
      });
    }
    
    // Store consolidated flight data
    setConsolidatedFlights(allFlights);
    setSelectedFlightPlan(flightPlan);
    setBookingPassengers(currentBooking?.passengers || []);
    setHeadCount(currentBooking?.passengers.length || 1);
    setSelectedBookingId(currentBooking?.booking_id);
    
    console.log("Consolidated Flights:", allFlights);
    console.log("Booking Details:", {
      bookingId: currentBooking?.booking_id,
      passengers: currentBooking?.passengers,
      headCount: currentBooking?.passengers.length
    });
    
    // Show end flight selection with end flight options
    setShowItinerary(false);
    setShowEndFlightSelection(true);
  };

  // If showing end flight selection, render the FlightSelection component
  if (showEndFlightSelection) {
    return (
      <FlightSelectionBooking
        flights={endFlightOptions}
        onFlightSelect={handleEndFlightSelect}
        onBack={handleBackFromFlightSelection}
        loading={loading}
        title="Select Return Flight"
        subtitle="Choose your preferred return flight to complete your trip plan"
      />
    );
  }

  // If showing itinerary, render the ItineraryView component
  if (showItinerary) {
    return (
      <ItineraryViewBookings
        flightPlan={flightPlan}
        spotSchedule={spotSchedule}
        endFlightOptions={endFlightOptions}
        onBack={handleBackFromItinerary}
        onConfirm={handleConfirmItinerary}
        loading={itineraryLoading}
        booking={currentBooking}
      />
    );
  }

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

      {bookings.map((booking) => {
        const isCancelled = booking.status === 'cancelled';
        const hasFlightCancellations = hasCancelledFlights(booking);
        
        return (
          <div key={booking.booking_id} className={`tbm-booking-card ${isCancelled ? 'cancelled' : ''}`}>
            <div className={`tbm-booking-header ${isCancelled ? 'cancelled' : ''}`}>
              {isCancelled && <div className="cancelled-badge">Cancelled</div>}
              {hasFlightCancellations && !isCancelled && (
                <div className="flight-cancelled-badge">Flight Changes Required</div>
              )}
              <div className="tbm-booking-info">
                <div className="tbm-booking-id">
                  Booking #{booking.booking_id}
                </div>
                <div className={`tbm-booking-status ${isCancelled ? 'cancelled' : ''}`}>
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
                <div className="tbm-action-buttons">
                  <button 
                    className="tbm-view-tickets-btn"
                    onClick={() => setSelectedTickets(booking.tickets)}
                  >
                    <Plane className="tbm-meta-icon" />
                    View Tickets
                  </button>
                  {hasFlightCancellations && !isCancelled && (
                    <button 
                      className="tbm-alter-plan-btn"
                      onClick={() => handleAlterPlan(booking)}
                    >
                      <RefreshCw className="tbm-meta-icon" />
                      Alter Plan
                    </button>
                  )}
                  {!isCancelled && (
                    <button 
                      className="tbm-cancel-btn"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      <X className="tbm-meta-icon" />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {selectedTickets && (
        <FlightTicketDetails 
          tickets={selectedTickets}
          onClose={() => setSelectedTickets(null)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmCancellation}
        booking={confirmationModal.booking}
      />
    </div>
  );
};

export default TripBookingsList;