import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ServerData from './ServerData'


function App (){
    const [val, setVal]=useState(false)
    const [hour, setHour]=useState('-1:-1:-1')
    const [stop,setStop]=useState(0)
    const [servers,setServers]=useState([])

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


    socket.on('servers-data',(data)=>{
        let event = window.event
        if(event) event.preventDefault()
        setServers(JSON.parse(JSON.stringify(data)))
    })

    return (
            <div className="container mt-5">
                <div className="row">
                    <div className="col ">
                        <div className="text-center">
                            <h1>HORA DEL COORDINADOR:</h1>
                            <h1 class="display-1">{hour}</h1>
                        </div>
                        <div className="col-sm-8 align-self-center text-left pt-5">
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr className="align-self-center">
                                        <th scope="col" className="card-title">
                                            SERVIDORES
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>IP</th>
                                        <th>ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {servers.map(s=>{
                                        return <ServerData ip={s.server} state={s.state}/>
                                    })}
                                </tbody>
                            </table>
                            
                        </div>
                        <div className="text-center">
                            <button className='btn btn-primary'
                                    onClick={createInstance}>CREAR INSTANCIA</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    

}
export default App ;