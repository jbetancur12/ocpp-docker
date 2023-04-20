import React from 'react'
import { useParams } from 'react-router-dom';
import BasicTabs from './BasicTab';

function CPDetails() {
    const { id } = useParams();

  
    
  return (
    <div>
      <BasicTabs id={id}/>
    </div>
  )
}

export default CPDetails
