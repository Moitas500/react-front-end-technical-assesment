import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getEnv } from "../config/enviroment";
import { Link } from "react-router-dom";

const ShowGenres = () => {

    const url = getEnv().serviceHost;

    const [genres, setGenres] = useState([]);
    const [title, setTitle] = useState();
    const [id, setId] = useState();
    const [type, setType] = useState();
    const [operation, setOperation] = useState();

    useEffect( () => {
        getGenres();
    }, [])

    const openModal = ( option, id, type ) => {
        setId(0);
        setType('');
        setOperation(option);

        switch(option) {

            case 1:
                setTitle('Registrar autor');
                break
            
            case 2:
                setTitle('Editar autor');
                setId(id);
                setType(type);
                break

            default:
                break

        }
    }

    const getGenres = async () => {
        try {
            const response = await axios.get(url + '/api/Genres');
            setGenres(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const validate = () => {
        if ( type.trim() === '' ) {
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
                name: type,
            },
            operation === 1 ? '/api/Genres' : '/api/Genres/' + id
        )
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

            getGenres();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteGenre = async ( id ) => {
        try {
            await axios.delete(url + '/api/Genres/' + id )
                .then( () => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Se elimino el registro con exito',
                        icon: "success"
                    })
                })
            
            getGenres();
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
                                data-bs-target="#modalGenres"
                                onClick={() => openModal(1)}
                            >
                                <i className="fa-solid fa-circle-plus"></i> Agregar genero
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
                                        <th>Tipo</th>
                                    </tr>
                                </thead>

                                <tbody className="table-group-divider">

                                    {
                                        genres.map( (genre, id) => (
                                            <tr key={id}>
                                                <td>
                                                    { genre.id }
                                                </td>

                                                <td>
                                                    { genre.name }
                                                </td>

                                                <td>
                                                    <button 
                                                        className="btn btn-warning"
                                                        onClick={() => openModal(2, genre.id, genre.name )}
                                                        data-bs-toggle = 'modal'
                                                        data-bs-target = '#modalGenres'
                                                    >
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button 
                                                        className="btn btn-danger"
                                                        onClick={() => deleteGenre(genre.id)}
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
                                        to='/authors'
                                    >
                                        Autores
                                    </Link>
                                </div>

                                <div className="col">
                                    <Link 
                                        className="p-3 btn btn-info"
                                        to='/'
                                    >
                                        Libros
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

            </div>

            <div className="modal fade" id="modalGenres" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                                    placeholder="Tipo"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
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

export default ShowGenres