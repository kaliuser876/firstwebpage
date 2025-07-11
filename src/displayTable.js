import React, { useState } from 'react'
import CoolButton from './coolButton'

function DisplayTable(){
    const [dataFromChild, setDataFromChild] = useState('');

    const handleChildData = (data)=> {
        setDataFromChild(data);
    };

    return (
        <div>
            <h1>Display Table</h1>
            <p>Data from coolButton: {dataFromChild}</p>
            <CoolButton onDataSend={handleChildData} />
        </div>
    );
}
export default DisplayTable;