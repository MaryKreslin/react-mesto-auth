import React from 'react';
import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';
const Header = (props) => {
    const [header, setheader] = React.useState({ linkText: "", link: "", text: "" });
    React.useEffect(() => {
        if (props.type === "main") {
            setheader({ linkText: "Выйти", link: "/sign-in", text: props.email })
        }
        if (props.type === "login") {
            setheader({ linkText: "Регистрация", link: "/sign-up", text: "" })
        }
        if (props.type === "register") {
            setheader({ linkText: "Войти", link: "/sign-in", text: "" })
        }
    }, [props.type])

    const handleButtonClick = () => {
        props.handleClick(props.type)
    }

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип Место" />
            <div className='header__email-block'>
                <p className="header__text">{header.text}</p>
                <button onClick={handleButtonClick} className="header__button" >
                    <Link className="header__link" to={header.link}>{header.linkText}</Link>
                </button>
            </div>
        </header>
    )
}
export default Header;