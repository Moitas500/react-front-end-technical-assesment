import React, { useEffect, useState } from "react";
import axios from "axios";
import { getEnv } from "../config/enviroment";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ShowAuthors = () => {

    const url = getEnv().serviceHost;

    const [authors, setAuthors] = useState([]);
    const [id, setId] = useState();
    const [name, setName] = useState();
    const [age, setAge] = useState();
    const [title, setTitle] = useState();
    const [operation, setOperation] = useState();

    useEffect( () => {
        getAuthors();
    }, [])

    const getAuthors = async () => {
        try {
            const response = await axios.get(url + '/api/Person');
            setAuthors(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const openModal = ( option, id, name, age ) => {
        setId(0);
        setName('');
        setAge('');
        setOperation(option);

        switch(option) {

            case 1:
                setTitle('Registrar autor');
                break
            
            case 2:
                setTitle('Editar autor');
                setId(id);
                setName(name);
                setAge(age);
                break

            default:
                break

        }
    }

    const validate = () => {
        if ( name.trim() === '' || !age ) {
            Swal.fire({
                title: 'Error',
                text: 'Rellene todos los datos',
                icon: 'error'
            })

            return
        }

        sendRequest(
            operation === 1 ? 'POST' : 'PUT',
            {
                id,
                name,
                age
            },
            operation === 1 ? '/api/Person' : '/api/Person/' + id
        )
    }

    const deleteAuthor = async ( id ) => {
        try {
            await axios.delete(url + '/api/Person/' + id )
                .then( () => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Se elimino el registro con exito',
                        icon: "success"
                    })
                })
            
            getAuthors();
        } catch (error) {
            console.error(error);
        }
    }

    const sendRequest = async ( method, data, endpoint ) => {
        try {
            await axios({method, url: url + endpoint, data })
                .then( () => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Operacion realizada con exito',
                        icon: "success"
                    })
                })

            getAuthors();
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div>
            <div className="container-fluid">

                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button 
                                className="btn btn-dark" 
                                data-bs-toggle="modal" 
                                data-bs-target="#modalBooks"
                                onClick={() => openModal(1)}
                            >
                                <i className="fa-solid fa-circle-plus"></i> Agregar autor
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-12">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                    </tr>
                                </thead>

                                <tbody className="table-group-divider">

                                    {
                                        authors.map( (author, id) => (
                                            <tr key={id}>
                                                <td>
                                                    { author.id }
                                                </td>

                                                <td>
                                                    { author.name }
                                                </td>

                                                <td>
                                                    { author.age }
                                                </td>

                                                <td>
                                                    <button 
                                                        className="btn btn-warning"
                                                        onClick={() => openModal(2, author.id, author.name, author.age )}
                                                        data-bs-toggle = 'modal'
                                                        data-bs-target = '#modalBooks'
                                                    >
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button 
                                                        className="btn btn-danger"
                                                        onClick={() => deleteAuthor(author.id)}
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>

                        <div className="container px-4 text-center">
                            <div className="row gx-5">
                                <div className="col">
                                    <Link 
                                        className="p-3 btn btn-info"
                                        to='/'
                                    >
                                        Libros
                                    </Link>
                                </div>

                                <div className="col">
                                    <Link 
                                        className="p-3 btn btn-info"
                                        to='/genres'
                                    >
                                        Generos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="modal fade" id="modalBooks" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-gift"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-comment"></i>
                                </span>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Edad"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                data-bs-dismiss="modal"
                            >
                                Cerrar
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => validate()}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowAuthors