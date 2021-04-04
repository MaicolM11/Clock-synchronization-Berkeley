import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ServerData from './ServerData'


function App (){
    const [val, setVal]=useState(false)
    const [hour, setHour]=useState('-1:-1:-1')
    const [stop,setStop]=useState(0)
    const [servers,setServers]=useState([])
    const [lines,setLines]=useState([])

    var socket=io('/',{autoConnect: false})

    useEffect(()=>{
        if (!val) {
            socket.connect()
            setVal(true)
        }
    },[stop])
    
    const createInstance=()=>{
        fetch(`${window.location}new_server`, {
            method: 'post',
            body: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            alert('Instancia Creada')
        })
        .catch(()=>{
            alert('Ocurrio un error al crear una insccia')
        })
    }

    socket.on('hours',(time)=>{
        let event = window.event
        if(event) event.preventDefault()
        setHour(time)
    })

    socket.on('log',(data)=>{
        let event = window.event
        if(event) event.preventDefault()
        setLines(String(data).split('\n'))
    })

    socket.on('servers-data',(data)=>{
        let event = window.event
        if(event) event.preventDefault()
        var temp=JSON.parse(JSON.stringify(data))
        var s=[]
        for (const key in temp) {
            if (Object.hasOwnProperty.call(temp, key)) {
                s.push({server: key, time:temp[key],state:(temp[key]=='')?false:true})
            }
        }
        setServers(s)
    })

    return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col ">
                        <div className="text-center">
                            <h1>HORA DEL COORDINADOR:</h1>
                            <h1 class="display-1">{hour}</h1>
                        </div>
                        <div className="card mt-5">
                            <div class="card-header text-center mb-2">
                                <h1>SERVIDORES</h1>
                            </div>
                            <div className="row row-cols-5">
                                {servers.map((element)=>{
                                    return(<ServerData server={element.server} time={element.time} state={element.state}/>)
                                })}
                            </div>
                            <div className="card-footer text-center">
                                <button className='btn btn-primary'
                                        onClick={createInstance}>CREAR INSTANCIA</button>
                            </div>
                        </div>
                        <div class="card mt-5" >
                            <div class="card-header text-center">
                                <h1>LOGS</h1>
                            </div>
                            <div id="log" className='h-50 d-inline-block overflow-auto'>
                                {lines.map(element=>{
                                    return <p>{element}</p>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    

}
export default App ;