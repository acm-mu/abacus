import React from "react";
import { useState } from 'react'; 
import DropDownButton from './DropDownButton'; 
import DropDownContent from './DropDownContent'; 
import './DropDownMenu.scss';

interface DropDownMenuProps {
    buttonText: string;
    content: React.ReactNode;
}

const DropDownMenu = ({buttonText, content}: DropDownMenuProps) => { 
    
    const [open, setOpen] = useState(false);
    const toggleDropdown = () => { 
        setOpen(!open);
    };

    return( 
        <div className="dropdown">
            <DropDownButton toggle={ toggleDropdown } open={ open }>{buttonText}</DropDownButton>
            <DropDownContent open={ open }>{content}</DropDownContent>
        </div> 
    )
}

export default DropDownMenu;
