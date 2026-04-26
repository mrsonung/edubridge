import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        width: '400px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '24px' }}>{message}</p>
        <button
          onClick={onConfirm}
          style={{
            marginRight: '16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: '#777',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
