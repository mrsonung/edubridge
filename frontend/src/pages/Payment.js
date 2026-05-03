import React from "react";

const Payment = () => {

  const handlePayment = () => {
    const options = {
      key: "rzp_test_SiBDmK2Zlj6QOy", 
      amount: 50000, // ₹500
      currency: "INR",
      name: "EduBridge",
      description: "Course Payment",
      handler: function (response) {
        alert("Payment Successful 🎉");
        console.log(response);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h2>Buy Course</h2>
      <button onClick={handlePayment}>Pay ₹500</button>
    </div>
  );
};

export default Payment;