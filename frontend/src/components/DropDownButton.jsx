import React from 'react'; 
import './DropDownButton.scss';

const DropDownButton = ({children, open, toggle}) =>{ 
    return(
        <div 
        onClick={ toggle }
        className={`dropdown-btn ${open ? "button-open" : ""}`}        
        >
            {children}
            <span className="toggle-icon">
            {open ? '▲' : '▼' } 
            </span>
        </div>
    );
};
export default DropDownButton; 