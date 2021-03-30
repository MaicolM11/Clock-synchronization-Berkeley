import React, {useState} from 'react';
import io from 'socket.io-client';


function App (){
    const [hour, setHour]=useState('')
    let socket=io('/')
    socket.on('hours',(time)=>{
        let event =window.event
        if (event) event.preventDefault()
        setHour(time)
    })
    return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        {hour}
                    </div>
                </div>
            </div>
        )
    

}
export default App ;