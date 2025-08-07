import React from 'react';
import { Button } from 'primereact/button';

const TicketPDFDownloader = ({ ticket, onDownload }) => {
  const generateTicketPDF = async () => {
    try {
      console.log('PDF Download triggered!');
      console.log('Ticket data received:', ticket);
      
      // Check if ticket data is valid
      if (!ticket) {
        console.error('No ticket data provided');
        alert('Error: No ticket data available');
        return;
      }

      console.log('Creating PDF content...');
      
      // Create a simple text content for the ticket
      const ticketContent = `
FLIGHT TICKET
=============

Ticket ID: ${ticket.ticket_id || 'N/A'}
Booking ID: ${ticket.booking?.booking_id || 'N/A'}
Status: ${ticket.status || 'N/A'}

FLIGHT INFORMATION
==================
Flight Number: ${ticket.flight_details?.flight_number || 'N/A'}
Airline: ${ticket.flight_details?.airline || 'N/A'}
Departure: ${ticket.flight_details?.departure || 'N/A'}
Arrival: ${ticket.flight_details?.arrival || 'N/A'}

PASSENGER INFORMATION
=====================
Name: ${ticket.passenger?.name || 'N/A'}
Age: ${ticket.passenger?.age || 'N/A'}
Gender: ${ticket.passenger?.gender || 'N/A'}
Passport: ${ticket.passenger?.passport_no || 'N/A'}

BOOKING DETAILS
===============
Booking Date: ${ticket.booking?.booking_date || 'N/A'}
Flight Booking ID: ${ticket.flight_booking_id || 'N/A'}
Total Passengers: ${ticket.booking?.passenger_count || 'N/A'}
Total Amount: ${formatAmount(ticket.flight_details?.total_price || ticket.booking?.total_amount)}

Generated on: ${new Date().toLocaleString()}
      `;

      console.log('Ticket content created:', ticketContent);

      // Create and download the file
      const blob = new Blob([ticketContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flight-ticket-${ticket.ticket_id || 'unknown'}.txt`;
      document.body.appendChild(a);
      
      console.log('Triggering download...');
      a.click();
      
      console.log('Cleaning up...');
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully!');

      // Call the onDownload callback if provided
      if (onDownload) {
        console.log('Calling onDownload callback...');
        onDownload(ticket);
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      console.error('Error stack:', error.stack);
      alert(`Error generating ticket PDF: ${error.message}`);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    } catch (error) {
      console.error('Error formatting amount:', error);
      return `₹${amount}`;
    }
  };

  console.log('TicketPDFDownloader rendered with ticket:', ticket);

  return (
    <Button 
      label="Download PDF" 
      icon="pi pi-download" 
      className="ticket-pdf-download-btn" 
      size="small"
      disabled={ticket?.status !== 'issued'}
      onClick={generateTicketPDF}
      tooltip={ticket?.status !== 'issued' ? 'PDF download is only available for issued tickets' : 'Download ticket as PDF'}
    />
  );
};

export default TicketPDFDownloader;