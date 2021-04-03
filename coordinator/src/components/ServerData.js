import React  from 'react'

function ServerData (props){

    return(
            <tr>
                <td>{props.ip}</td>
                <td><span className={(props.state)?"badge bg-success":"badge bg-danger"}>
                {(props.state)?'ACTIVO':'INACTIVO'}</span></td>
            </tr>
        )
    
}

export default ServerData