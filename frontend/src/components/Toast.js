import React from 'react';

const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '32px',
      right: '30px',
      zIndex: '9999',
      background: '#23283a',
      color: '#fff',
      padding: '18px 36px',
      borderRadius: '12px',
      boxShadow: '0 4px 22px rgba(41,128,185,0.19)',
      fontSize: '1.11rem',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '18px',
          background: '#44a1fa',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '7px 18px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        OK
      </button>
    </div>
  );
};

export default Toast;
