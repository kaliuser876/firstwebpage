import React, { useState } from 'react';
import './coolButton.css';

// Define a functional component named 'Welcome'
function CoolButton( {onDataSend}) {
  // The component receives 'props' as an argument, which are properties passed to it.
  const [count, setCount] = useState(0);

  function handelClick() {
    setCount(count + 1)
    onDataSend(count);
  }

  return (
    <div>
        <button type="btn-prime" class="btn-prime" onClick={handelClick}>Send the updated count</button>
      
    </div>
  );
}

// Export the component to be used in other parts of the application
export default CoolButton;