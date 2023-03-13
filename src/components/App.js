import React, { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup ";
import ConfirmPopup from "./ConfirmPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRouteElement from "./ProtectedRoute";
import * as auth from "../utils/Auth.js";


const App = () => {
  const [isEditProfilePopupOpen, setisEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setisEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setisConfirmPopupOpen] = React.useState(false);
  const [selectedCard, setselectedCard] = React.useState({});
  const [currentUser, setcurrentUser] = React.useState({});
  const [cards, setcards] = React.useState([]);
  const [cardToDelete, setcardToDelete] = React.useState({});
  const [isLoading, setisLoading] = React.useState(false);
  const [loggedIn, setloggedIn] = React.useState(false);
  const [header, setheader] = React.useState({ text: "Войти", link: "/sign-in" });
  const navigate = useNavigate();
  useEffect(() => {
    handleTokenCheck();
    api.getUserInfo()
      .then((data) => {
        setcurrentUser(data)
      })
      .catch((err) => console.log(err))
    api.getCardsInfo()
      .then((data) => {
        const newCards = data.map((card) => {
          return {
            _id: card._id,
            link: card.link,
            name: card.name,
            likes: card.likes,
            likesCount: card.likes.length,
            ownerId: card.owner._id
          }
        })
        setcards(newCards)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleTokenCheck = () => {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setloggedIn(true);
            navigate("/main", { replace: true })
          }
        })

    };
  }



  const handleEditAvatarClick = () => {
    setisEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setisEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setisAddPlacePopupOpen(true)
  }

  const handleCardClick = (data) => {
    setselectedCard(data)
  }

  const setCard = (data) => {
    const newCard = {
      _id: data._id,
      link: data.link,
      name: data.name,
      likes: data.likes,
      likesCount: data.likes.length,
      ownerId: data.owner._id
    }
    const newCards = this.state.cards.map((item) => {
      if (item._id === data._id) { return newCard } else { return item }
    })
    setcards(newCards)
  }

  const handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if (isLiked) {
      api.deleteLike(card._id)
        .then((data) => {
          setCard(data)
        })
        .catch((err) => console.log(err))
    } else {
      api.putLike(card._id)
        .then((data) => {
          setCard(data)
        })
        .catch((err) => console.log(err))
    }
  }

  const handleCardDelete = (card) => {
    setisConfirmPopupOpen(true)
    setcardToDelete(card)
  }

  const handleConfirmSubmit = (card) => {
    setisLoading(true)
    api.deleteCard(card._id)
      .then((data) => {
        const newCards = cards.filter(item => item._id !== card._id);
        setcards(newCards);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { setisLoading(false) })
  }

  const handleUpdateUser = (name, about) => {
    setisLoading(true);
    api.patchUserInfo(name, about)
      .then((data) => {
        setcurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { setisLoading(false) })
  }

  const handleUpdateAvatar = (newAvatar) => {
    setisLoading(true);
    api.pacthAvatarImg(newAvatar)
      .then((data) => {
        setcurrentUser({ ...currentUser, avatar: data.avatar })
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { setisLoading(false) })
  }

  const handleAddPlace = (name, link) => {
    setisLoading(true);
    api.addNewCard(name, link)
      .then((data) => {
        const newCard = {
          _id: data._id,
          link: data.link,
          name: data.name,
          likes: data.likes,
          likesCount: data.likes.length,
          ownerId: data.owner._id
        }
        setcards([newCard, ...cards])
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { setisLoading(false) })
  }

  const closeAllPopups = () => {
    setisEditProfilePopupOpen(false)
    setisAddPlacePopupOpen(false)
    setisEditAvatarPopupOpen(false)
    setisConfirmPopupOpen(false)
    setselectedCard({})
  }

  const handleLogin = () => {
    setloggedIn(true)
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header content={header} />
        <Routes>
          <Route path="/" element={loggedIn ? <Navigate to="/main" replace /> : <Navigate to="/sign-up" replace />} />
          <Route path="/main" element={<ProtectedRouteElement
            element={
              Main} cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onLikeClick={handleCardLike}
            onCardDelete={handleCardDelete}


            loggedIn={loggedIn} />} />
          <Route path="/sign-up" element={<Register />} />
          <Route path="/sign-in" element={<Login handleLogin={handleLogin} />} />
        </Routes>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlace}
          isLoading={isLoading}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirmSubmit={handleConfirmSubmit}
          cardToDelete={cardToDelete}
          isLoading={isLoading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider >
  )
};


export default App;
