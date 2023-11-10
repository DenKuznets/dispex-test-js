import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";

const ClientsList = ({ clients, addressId }) => {
    const [addedClients, setAddedClients] = useState(clients);
    const [showForm, setShowForm] = useState(false);
    const { formState, register, handleSubmit } = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });
    const { errors } = formState;
    const deleteClient = (clientToDelete) => {
        axios
            .delete(
                `https://dispex.org/api/vtest/HousingStock/bind_client/${clientToDelete.serverId}`
            )
            .then((result) => {
                if (result.status === 200) {
                    setAddedClients(
                        addedClients.filter(
                            (client) => client.id !== clientToDelete.id
                        )
                    );
                }
            });
    };

    const onSubmit = (data) => {
        axios
            .post("https://dispex.org/api/vtest/HousingStock/client", {
                Name: data.name,
                Phone: data.phone,
                Email: data.email,
            })
            .then((result) => {
                if (result.data.result === "Ok") {
                    const clientId = result.data.id;
                    axios
                        .put(
                            "https://dispex.org/api/vtest/HousingStock/bind_client",
                            {
                                AddressId: addressId,
                                ClientId: clientId,
                            }
                        )
                        .then((result) => {
                            if (result.status === 200) {
                                setAddedClients((prev) => [
                                    ...prev,
                                    {
                                        Name: data.name,
                                        Phone: data.phone,
                                        Email: data.email,
                                        serverId: clientId,
                                        id: nanoid(),
                                    },
                                ]);
                            }
                        });
                }
            });
    };

    const cliList =
        addedClients.length > 0 ? (
            addedClients.map((client, index) => {
                return (
                    <div key={index} className="flex max-w-xs flex-col gap-2">
                        <div>{client.Name}</div>
                        <div>{client.Phone}</div>
                        <div>{client.Email}</div>
                        <button
                            className="bg-red-500 p-2"
                            onClick={() => client.id && deleteClient(client)}
                        >
                            Удалить
                        </button>
                    </div>
                );
            })
        ) : (
            <div>В квартире жильцов нет</div>
        );
    return (
        <div className="">
            <div className="flex max-h-80 flex-wrap gap-4 overflow-y-auto">
                {cliList}
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gray-400 px-4 py-6">
                {!showForm && (
                    <button
                        className=" rounded bg-amber-500 p-2 hover:bg-amber-300 active:scale-95"
                        onClick={() => setShowForm(true)}
                    >
                        Добавить жильца
                    </button>
                )}
                <form
                    noValidate
                    aria-label="personal info form"
                    onSubmit={handleSubmit(onSubmit)}
                    className={` ${
                        showForm ? "flex" : "hidden"
                    } flex-col flex-wrap items-center justify-start gap-10`}
                >
                    <div className="flex flex-col gap-4 lg:flex-row">
                        <div className="relative  flex flex-col">
                            <p className="absolute bottom-[-24px] left-0  w-full text-[0.75rem] text-red-800">
                                {errors.name?.message}
                            </p>
                            <label htmlFor="name"> Имя</label>
                            <input
                                autoFocus
                                id="name"
                                className={`min-w-0 rounded p-2 ${
                                    errors.name
                                        ? "bg-red-200 outline-red-600"
                                        : ""
                                }`}
                                placeholder="Иван"
                                type="text"
                                {...register(`name`, {
                                    required: "Поле необходимо заполнить",
                                })}
                            />
                        </div>
                        <div className="relative  flex flex-col">
                            <p className="absolute bottom-[-24px] left-0  w-full text-[0.75rem] text-red-800">
                                {errors.phone?.message}
                            </p>
                            <label htmlFor="phone"> Телефон</label>

                            <input
                                id="phone"
                                className={`min-w-0 rounded p-2  ${
                                    errors.phone
                                        ? "bg-red-200 outline-red-600"
                                        : ""
                                }`}
                                placeholder="+7"
                                type="text"
                                {...register(`phone`, {
                                    required: "Поле необходимо заполнить",
                                    pattern: {
                                        value: /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/g,
                                        message: "Некорректный номер телефона",
                                    },
                                })}
                            />
                        </div>
                        <div className="relative flex flex-col">
                            <p className="absolute bottom-[-24px] left-0  w-full text-[0.75rem] text-red-800">
                                {errors.email?.message}
                            </p>
                            <label htmlFor="email"> Почта</label>
                            <input
                                id="email"
                                className={`min-w-0 rounded p-2  ${
                                    errors.email
                                        ? "bg-red-200 outline-red-600"
                                        : ""
                                }`}
                                placeholder="example@test.ru"
                                type="text"
                                {...register(`email`, {
                                    required: "Поле необходимо заполнить",
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                        message: "Некорректный емейл",
                                    },
                                })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className=" rounded bg-amber-500 p-2 hover:bg-amber-300 active:scale-95">
                            ОК
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowForm(false);
                            }}
                            className=" rounded bg-amber-500 p-2 hover:bg-amber-300 active:scale-95"
                        >
                            Закрыть
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientsList;
