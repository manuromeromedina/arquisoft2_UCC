import React, { useContext, useState } from 'react';
import { AuthContext } from './auth';
import { useNavigate } from 'react-router-dom';
import '../estilo/login_admin.css';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginAdmin = () => {
        fetch('http://localhost/user-res-api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => {
                if (response.status === 400 || response.status === 401 || response.status === 403) {
                    throw new Error('Invalid credentials');
                }
                return response.json();
            })
            .then(data => {
                if (data.type === true) {
                    login(data.accessToken, data.refreshToken, data.type);
                    navigate('/admin');
                } else {
                    alert("No eres un administrador.");
                }
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
            });
    };

    return (
        <div className="bodyAdmin">
            <div className="container">
                <div className="container2A">
                    <h1 className="title">Bienvenido Administrador</h1>
                    <div className="form-container">
                        <input
                            id="username"
                            type="text"
                            placeholder="Correo electrónico"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="button-container">
                            <button className="button" onClick={handleLoginAdmin}>
                                Iniciar Sesión
                            </button>
                            <Link to="/" className="botonAtras">
                                Volver a Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;