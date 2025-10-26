import React from 'react'; 
import './DropDownContent.scss';

const DropDownContent = ({children, open}) =>{ 
    return( 
        <div className={`dropdown-content ${open ? "content-open" : ""}`}>
            {children} 
        </div>
    );
};

export default DropDownContent; 