import React from 'react';

import "./DropDownItem.scss";

interface DropDownItemProps {
    children: React.ReactNode;
    onClick: () => void;
  }

const DropDownItem = ({children, onClick}: DropDownItemProps) => { 
    return( 
        <div className="dropdown-item" onClick={ onClick }> 
            {children} 
        </div>
    )
}

export default DropDownItem;