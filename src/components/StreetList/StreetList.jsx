import axios from 'axios'
import { useEffect, useState } from 'react'
import HouseList from '../HouseList/HouseList'


const StreetList = () => {
    const [streets, setStreets] = useState()
    useEffect(() => {
        axios
            .get('https://dispex.org/api/vtest/Request/streets')
            .then((result) => {
                setStreets(result.data)
            })
    }, [])

    if (!streets) return <div>Loading...</div>
    const streetList = streets.map((street) => {
        return (
            <details
                className="cursor-pointer bg-purple-500 p-2 hover:bg-purple-300"
                key={street.nameWithPrefix}
            >
                <summary>{street.nameWithPrefix}</summary>
                <div>
                    <HouseList street={street} />
                </div>
            </details>
        )
    })
    return <div>{streetList}</div>
}

export default StreetList
