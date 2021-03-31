import React, {useState,useEffect} from 'react';
import io from 'socket.io-client';


function App (){
    const [hour, setHour]=useState('-1:-1:-1')
    const [val, setVal]=useState(false)
    const [stop,setStop]=useState(0)
    const [time,setTime]=useState('')

    const changeTime=()=>{
        if (time==""||time=='') {
            alert('POR FAVOR INGRESE UNA HORA A ENVIAR')
        }else{
            fetch(`${window.location}time`, {
                method: 'post',
                body: JSON.stringify({time: time}),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                document.getElementById('in-time').value=''
            })
        }
    }
    var socket=io('/',{autoConnect: false})

    useEffect(()=>{
        if (!val) {
            socket.connect()
            setVal(true)
        }
    },[stop])
    
    socket.on('hours',(time)=>{
        let event = window.event
        if(event) event.preventDefault()
        setHour(time)
    })
    return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col">
                        <h1 class="display-1">{hour}</h1>
                        <h3>CAMBIAR LA HORA</h3>
                        <input id="in-time" type='time' onChange={e=>{
                            setTime(e.target.value)
                        }}></input>
                        <button className='btn btn-primary'
                            onClick={changeTime}>ENVIAR</button>
                    </div>
                </div>
            </div>
        )
    

}
export default App ;