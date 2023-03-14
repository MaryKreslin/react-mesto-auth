import React from "react";
import success from "../images/auth-success.png";
import failed from "../images/auth-failed.png";

const InfoTooltip = (props) => {

    const [classOpen, setClassOpen] = React.useState("");
    const [type, setType] = React.useState({ infoImage: {}, infoText: "" });

    React.useEffect(() => {
        if (props.isOpen) {
            setClassOpen("popup_opened")
        } else { setClassOpen("") }
    }, [props.isOpen])

    React.useEffect(() => {
        if (props.type === "success") {
            setType({ infoImage: success, infoText: "Вы успешно зарегистрировались!" })
        } else {
            setType({ infoImage: failed, infoText: "Что-то пошло не так! Попробуйте ещё раз." })
        }
    }, [props.type])

    const handleClose = () => { props.onClose(props.type) }

    return (
        <div className={`popup popup_type_infoTooltip ${classOpen}`}>
            <form className="popup__content popup__content_type_info">
                <button aria-label="Закрыть" className="popup__close-button" type="button" onClick={handleClose}></button>
                <fieldset className="popup__fieldset popup__fielset_type_info">
                    <img src={type.infoImage} className="popup__infoImage" alt="" />
                    <p className="popup__title popup__title_type_info">{type.infoText}</p>
                </fieldset>
            </form>
        </div>
    )
}
export default InfoTooltip;