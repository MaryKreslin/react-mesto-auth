import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Header from "./Header";

const Login = ({ handleLogin }) => {
    const [formValue, setFormValue] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    return (
        <>
            <Header />
            <form className="popup__content" name="login" >
                <h2 className="popup__title">Вход</h2>
                <fieldset className="popup__fieldset">
                    <div className="popup__field">
                        <input
                            type="email"
                            className="popup__item popup__item_el_name"
                            id="email"
                            name="email"
                            placeholder="Email"
                            minLength="2"
                            maxLength="40"
                            required
                        />
                        <p className="popup__error email-error"></p>
                    </div>
                    <div className="popup__field">
                        <input
                            type="password"
                            className="popup__item popup__item_el_about"
                            id="password"
                            name="password"
                            placeholder="Вид деятельности"
                            minLength="8" maxLength="200"
                            required
                        />
                        <p className="popup__error password-error"></p>
                    </div>
                    <button type="submit" className="popup__save-button">Войти</button>
                </fieldset>
            </form>

        </>
    )
}
export default Login;