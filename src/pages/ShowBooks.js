import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { getEnv } from "../config/enviroment";
import { Link } from "react-router-dom";

const ShowBooks = () => {

    const url = getEnv().serviceHost;

    const [id, setId] = useState();
    const [books, setBooks] = useState([]);
    const [name, setName] = useState();
    const [date, setDate] = useState();
    const [author, setAuthor] = useState();
    const [genre, setGenre] = useState();
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [title, setTitle] = useState();
    const [operation, setOperation] = useState();

    useEffect( () => {
        getBooks();
        getGenres();
        getAuthors();
    }, [])

    const getBooks = async () => {
        try {
            const response = await axios.get(url + '/api/Books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
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

    const getAuthors = async () => {
        try {
            const response = await axios.get(url + '/api/Person');
            setAuthors(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const openModal = ( option, id, name, date, author, genre ) => {
        setId(0);
        setName('');
        setDate('');
        setAuthor('');
        setGenre('');
        setOperation(option);

        switch(option) {

            case 1:
                setTitle('Registrar autor');
                break
            
            case 2:
                setTitle('Editar autor');
                setId(id);
                setName(name);
                setDate(date);
                setAuthor(author);
                setGenre(genre)
                break

            default:
                break

        }
    }

    const validate = () => {
        if ( !name || !date || !author || !genre ) {
            Swal.fire({
                title: 'Error',
                text: 'Rellene todos los datos',
                icon: 'error'
            })

            return
        }

        const authorFind = authors.find( a => a.id === parseInt(author) );
        const genreFind = genres.find( g => g.id === parseInt(genre) );

        sendRequest(
            operation === 1 ? 'POST' : 'PUT',
            {
                id,
                name,
                date: parseInt(date),
                author: authorFind.id,
                genre: genreFind.id
            },
            operation === 1 ? '/api/Books' : '/api/Books/' + id
        )
    }

    const deleteBook = async ( id ) => {
        try {
            await axios.delete(url + '/api/Books/' + id )
                .then( () => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Se elimino el registro con exito',
                        icon: "success"
                    })
                })
            
            getBooks();
            getGenres();
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

            getBooks();
            getGenres();
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
                                <i className="fa-solid fa-circle-plus"></i> Agregar libro
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
                                        <th>Fecha</th>
                                        <th>Autor</th>
                                        <th>Genero</th>
                                    </tr>
                                </thead>

                                <tbody className="table-group-divider">
                                    {
                                        books.map( (book, id) => (
                                            <tr key={id}>
                                                <td>
                                                    { book.id }
                                                </td>

                                                <td>
                                                    { book.name }
                                                </td>

                                                <td>
                                                    { book.date }
                                                </td>

                                                <td>
                                                    { book.author }
                                                </td>

                                                <td>
                                                    { book.genre }
                                                </td>

                                                <td>
                                                    <button 
                                                        className="btn btn-warning"
                                                        data-bs-toggle = 'modal'
                                                        data-bs-target = '#modalBooks'
                                                        onClick={() => openModal(
                                                            2,
                                                            book.id,
                                                            book.name,
                                                            book.date,
                                                            book.author,
                                                            book.genre
                                                        )}
                                                    >
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button 
                                                        className="btn btn-danger"
                                                        onClick={() => deleteBook(book.id)}
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
                                    <i className="fa-solid fa-gift"></i>
                                </span>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Fecha"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-gift"></i>
                                </span>
                                <select 
                                    name="author" 
                                    className="form-control"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                >
                                    <option value=""> -- Elija un autor --</option>

                                    {
                                        authors.map( (author, id) => (
                                            <option
                                                key={id}
                                                value={author.id}
                                            >
                                                {author.name}
                                            </option>
                                        ))
                                    }

                                </select>
                            </div>

                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="fa-solid fa-gift"></i>
                                </span>
                                <select 
                                    name="genre" 
                                    className="form-control"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                >
                                    <option value=""> -- Elija un genero --</option>

                                    {
                                        genres.map( (genre, id) => (
                                            <option 
                                                key={id}
                                                value={genre.id}
                                            >
                                                {genre.name}
                                            </option>
                                        ))
                                    }

                                </select>
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

export default ShowBooks