import React from 'react';
import logo from '../images/logo.svg';
import menu from '../images/menu.png';
import close from "../images/CloseIcon.svg"
import { Link } from 'react-router-dom';

const Header = (props) => {
    const [header, setheader] = React.useState({ linkText: "", link: "", text: "" });
    const [isMenuOpen, setisMenuOpen] = React.useState(false);
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
    const handleMenuClick = () => {
        setisMenuOpen(true)
    }

    const handleMenuClose = () => {
        setisMenuOpen(false)
    }
    return (
        <>
            {isMenuOpen &&
                <div className='header__email-block header__email-block_vertical' >
                    <p className="header__text">{header.text}</p>
                    <button onClick={handleButtonClick} className="header__button" >
                        <Link className="header__link" to={header.link}>{header.linkText}</Link>
                    </button>
                </div>}
            <header className="header">
                <img className="header__logo" src={logo} alt="Логотип Место" />
                {(props.responsiveInfo.isDesktop || props.responsiveInfo.isTablet) &&
                    <div className='header__email-block'>
                        <p className="header__text">{header.text}</p>
                        <button onClick={handleButtonClick} className="header__button" >
                            <Link className="header__link" to={header.link}>{header.linkText}</Link>
                        </button>
                    </div>}
                {(props.responsiveInfo.isMobile && !isMenuOpen) &&
                    <img className="header__menu" src={menu} alt="Меню" onClick={handleMenuClick} />
                }
                {(props.responsiveInfo.isMobile && isMenuOpen) &&
                    <img className="header__menu" src={close} alt="Закрыть" onClick={handleMenuClose} />}

            </header>
        </>
    )
}
export default Header;