// import React, { useState } from "react";
// import { ArrowLeft, User } from "lucide-react";
// import "./Packages.css";

// const PassengerDetails = ({ headCount, onPassengerSubmit, onBack }) => {
//   const [passengers, setPassengers] = useState(
//     Array.from({ length: headCount }, () => ({
//       name: '',
//       age: '',
//       gender: '',
//       passport_no: ''
//     }))
//   );

//   const [errors, setErrors] = useState({});

//   const handlePassengerChange = (index, field, value) => {
//     const updatedPassengers = [...passengers];
//     updatedPassengers[index] = {
//       ...updatedPassengers[index],
//       [field]: value
//     };
//     setPassengers(updatedPassengers);

//     // Clear specific error when user starts typing
//     if (errors[`${index}-${field}`]) {
//       const newErrors = { ...errors };
//       delete newErrors[`${index}-${field}`];
//       setErrors(newErrors);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     passengers.forEach((passenger, index) => {
//       if (!passenger.name.trim()) {
//         newErrors[`${index}-name`] = 'Name is required';
//       }
//       if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
//         newErrors[`${index}-age`] = 'Valid age is required';
//       }
//       if (!passenger.gender) {
//         newErrors[`${index}-gender`] = 'Gender is required';
//       }
//       if (!passenger.passport_no.trim()) {
//         newErrors[`${index}-passport_no`] = 'Passport number is required';
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       onPassengerSubmit(passengers);
//     }
//   };

//   return (
//     <div className="passenger-details">
//       <div className="container">
//         <button className="back-button" onClick={onBack}>
//           <ArrowLeft size={20} />
//           <span>Back to Flights</span>
//         </button>

//         <div className="passenger-header">
//           <h1 className="passenger-title">Passenger Details</h1>
//           <p className="passenger-subtitle">Enter details for all {headCount} passenger{headCount > 1 ? 's' : ''}</p>
//         </div>

//         <form onSubmit={handleSubmit} className="passenger-form">
//           {passengers.map((passenger, index) => (
//             <div key={index} className="passenger-card">
//               <div className="passenger-card-header">
//                 <User size={20} />
//                 <h3>Passenger {index + 1}</h3>
//               </div>

//               <div className="passenger-fields">
//                 <div className="field-row">
//                   <div className="field-group">
//                     <label htmlFor={`name-${index}`}>Full Name *</label>
//                     <input
//                       type="text"
//                       id={`name-${index}`}
//                       value={passenger.name}
//                       onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
//                       placeholder="Enter full name"
//                       className={errors[`${index}-name`] ? 'error' : ''}
//                     />
//                     {errors[`${index}-name`] && (
//                       <span className="error-message">{errors[`${index}-name`]}</span>
//                     )}
//                   </div>

//                   <div className="field-group">
//                     <label htmlFor={`age-${index}`}>Age *</label>
//                     <input
//                       type="number"
//                       id={`age-${index}`}
//                       value={passenger.age}
//                       onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || '')}
//                       placeholder="Age"
//                       min="1"
//                       max="120"
//                       className={errors[`${index}-age`] ? 'error' : ''}
//                     />
//                     {errors[`${index}-age`] && (
//                       <span className="error-message">{errors[`${index}-age`]}</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="field-row">
//                   <div className="field-group">
//                     <label htmlFor={`gender-${index}`}>Gender *</label>
//                     <select
//                       id={`gender-${index}`}
//                       value={passenger.gender}
//                       onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
//                       className={errors[`${index}-gender`] ? 'error' : ''}
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="M">Male</option>
//                       <option value="F">Female</option>
//                       <option value="O">Other</option>
//                     </select>
//                     {errors[`${index}-gender`] && (
//                       <span className="error-message">{errors[`${index}-gender`]}</span>
//                     )}
//                   </div>

//                   <div className="field-group">
//                     <label htmlFor={`passport-${index}`}>Passport Number *</label>
//                     <input
//                       type="text"
//                       id={`passport-${index}`}
//                       value={passenger.passport_no}
//                       onChange={(e) => handlePassengerChange(index, 'passport_no', e.target.value.toUpperCase())}
//                       placeholder="Enter passport number"
//                       className={errors[`${index}-passport_no`] ? 'error' : ''}
//                     />
//                     {errors[`${index}-passport_no`] && (
//                       <span className="error-message">{errors[`${index}-passport_no`]}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           <div className="form-actions">
//             <button type="submit" className="submit-button">
//               Continue to Payment
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PassengerDetails;

import React, { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import "./Packages.css";

const PassengerDetails = ({ 
  headCount, 
  onPassengerSubmit, 
  onBack,
  selectedFlight,
  flightPlan,
  selectedEndFlight,
  selectedPackage,
  searchParams,
  onCreateBooking,
  bookingLoading
}) => {
  const [passengers, setPassengers] = useState(
    Array.from({ length: headCount }, () => ({
      name: '',
      age: '',
      gender: '',
      passport_no: ''
    }))
  );

  const [errors, setErrors] = useState({});

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);

    // Clear specific error when user starts typing
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`${index}-name`] = 'Name is required';
      }
      if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
        newErrors[`${index}-age`] = 'Valid age is required';
      }
      if (!passenger.gender) {
        newErrors[`${index}-gender`] = 'Gender is required';
      }
      if (!passenger.passport_no.trim()) {
        newErrors[`${index}-passport_no`] = 'Passport number is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const bookingResult = await onCreateBooking(passengers);
      
      if (bookingResult.success) {
        // Call the original onPassengerSubmit with all booking data
        onPassengerSubmit({
          passengers,
          bookingResult: bookingResult.data,
          consolidatedFlights: bookingResult.consolidatedFlights,
          bookingPayload: bookingResult.bookingPayload
        });
      } else {
        alert(bookingResult.error);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="passenger-details">
      <div className="container">
        <button className="back-button" onClick={onBack} disabled={bookingLoading}>
          <ArrowLeft size={20} />
          <span>Back to Flights</span>
        </button>

        <div className="passenger-header">
          <h1 className="passenger-title">Passenger Details</h1>
          <p className="passenger-subtitle">Enter details for all {headCount} passenger{headCount > 1 ? 's' : ''}</p>
        </div>

        {/* Flight Summary Section */}
        {/* <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-details">
            <div className="summary-item">
              <span>Package:</span>
              <span>{selectedPackage?.package_name || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span>Package Cost:</span>
              <span>₹{selectedPackage?.total_price?.toLocaleString() || '0'}</span>
            </div>
            <div className="summary-item">
              <span>Initial Flight:</span>
              <span>₹{selectedFlight?.total_price?.toLocaleString() || '0'}</span>
            </div>
            <div className="summary-item">
              <span>Inter-city Flights:</span>
              <span>
                {flightPlan?.length || 0} flights - ₹{
                  flightPlan?.reduce((total, plan) => 
                    total + (plan.flight?.base_price || 0) * (plan.head_count || 1), 0
                  )?.toLocaleString() || '0'
                }
              </span>
            </div>
            <div className="summary-item">
              <span>Return Flight:</span>
              <span>₹{selectedEndFlight?.total_price?.toLocaleString() || '0'}</span>
            </div>
            <div className="summary-item total">
              <span>Total Cost:</span>
              <span>₹{(
                (selectedPackage?.total_price || 0) +
                (selectedFlight?.total_price || 0) + 
                (flightPlan?.reduce((total, plan) => 
                  total + (plan.flight?.base_price || 0) * (plan.head_count || 1), 0
                ) || 0) +
                (selectedEndFlight?.total_price || 0)
              ).toLocaleString()}</span>
            </div>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="passenger-form">
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-card">
              <div className="passenger-card-header">
                <User size={20} />
                <h3>Passenger {index + 1}</h3>
              </div>

              <div className="passenger-fields">
                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor={`name-${index}`}>Full Name *</label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      placeholder="Enter full name"
                      className={errors[`${index}-name`] ? 'error' : ''}
                      disabled={bookingLoading}
                    />
                    {errors[`${index}-name`] && (
                      <span className="error-message">{errors[`${index}-name`]}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label htmlFor={`age-${index}`}>Age *</label>
                    <input
                      type="number"
                      id={`age-${index}`}
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || '')}
                      placeholder="Age"
                      min="1"
                      max="120"
                      className={errors[`${index}-age`] ? 'error' : ''}
                      disabled={bookingLoading}
                    />
                    {errors[`${index}-age`] && (
                      <span className="error-message">{errors[`${index}-age`]}</span>
                    )}
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor={`gender-${index}`}>Gender *</label>
                    <select
                      id={`gender-${index}`}
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className={errors[`${index}-gender`] ? 'error' : ''}
                      disabled={bookingLoading}
                    >
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                    {errors[`${index}-gender`] && (
                      <span className="error-message">{errors[`${index}-gender`]}</span>
                    )}
                  </div>

                  <div className="field-group">
                    <label htmlFor={`passport-${index}`}>Passport Number *</label>
                    <input
                      type="text"
                      id={`passport-${index}`}
                      value={passenger.passport_no}
                      onChange={(e) => handlePassengerChange(index, 'passport_no', e.target.value.toUpperCase())}
                      placeholder="Enter passport number"
                      className={errors[`${index}-passport_no`] ? 'error' : ''}
                      disabled={bookingLoading}
                    />
                    {errors[`${index}-passport_no`] && (
                      <span className="error-message">{errors[`${index}-passport_no`]}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button" 
              disabled={bookingLoading}
            >
              {bookingLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PassengerDetails;