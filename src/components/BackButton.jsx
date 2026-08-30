import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const BackButton = ({ label = 'Back', to }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="page-back-bar">
      <div className="container">
        <button
          onClick={handleBack}
          className="btn-back"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={18} />
          <span>{label}</span>
        </button>
      </div>
    </div>
  );
};
