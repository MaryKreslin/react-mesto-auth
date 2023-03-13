import logo from '../images/logo.svg';
import { Link } from 'react-router-dom';
function Header(props) {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Логотип Место" />
            <Link to={props.content.link} className="header__text">{props.content.text}</Link>
        </header>
    )
}
export default Header;