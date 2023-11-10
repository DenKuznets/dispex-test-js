import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ClientsList from '../ClientsList/ClientsList';

const Apartment = ({ apartment }) => {
    const [showClients, setShowClients] = useState(false);
    useEffect(() => {
        document.body.style.overflow = showClients ? 'hidden' : 'auto';
    }, [showClients]);

    return (
        <div
            onClick={() => {
                setShowClients(true);
            }}
            className="bg-green-600 pl-4 hover:bg-green-300"
        >
            Кваритра: {apartment.flat}
            {showClients && (
                <div className="fixed left-0 top-0 min-h-full min-w-full cursor-default bg-slate-200/75">
                    <div className="absolute left-1/2 top-1/2 flex min-h-[70vh] min-w-[70vw] -translate-x-1/2 -translate-y-1/2  flex-col  overflow-hidden rounded-lg bg-gray-200 p-4 sm:p-10">
                        <ClientsList
                            addressId={apartment.addressId}
                            clients={apartment.clients}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowClients(false);
                            }}
                            className="absolute right-[5px] top-[5px] rounded bg-gray-600 p-2 hover:bg-gray-400"
                        >
                            Х
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AparatmentsList = ({
    streetId,
    houseId,
    houseCorp,
    houseNumber
}) => {
    const [apartments, setApartments] = useState();

    useEffect(() => {
        axios
            .get(
                `https://dispex.org/api/vtest/HousingStock?streetId=${streetId}&houseId=${houseId}`
            )
            .then((result) => {
                const aparts = result.data.filter((obj) => {
                    return houseCorp
                        ? obj.building === houseNumber &&
                              obj.corpus === houseCorp
                        : obj.building === houseNumber &&
                              !Object.prototype.hasOwnProperty.call(
                                  obj,
                                  'corpus'
                              );
                });
                setApartments(aparts);
            });
    }, [houseCorp, houseNumber, houseId, streetId]);

    if (!apartments) return <div>Loading...</div>;

    const apartList = apartments.map((apart, index) => (
        <Apartment apartment={apart} key={index} />
    ));

    return <div>{apartList}</div>;
};

export default AparatmentsList;
