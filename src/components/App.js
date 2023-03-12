import React from "react";
import { Route, Routes, Navigate} from 'react-router-dom';

import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup ";
import ConfirmPopup from "./ConfirmPopup";
import Register from "./Register";
import Login from "./Login";
import ProtectedRouteElement from "./ProtectedRoute";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isConfirmPopupOpen: false,
      selectedCard: {},
      currentUser: {},
      cards: [],
      cardToDelete: {},
      isLoading: false,
      loggedIn: false
    }
  }

  componentDidMount() {
    api.getUserInfo()
      .then((data) => {
        this.setState({ currentUser: data })
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
        this.setState({ cards: newCards })
      })
      .catch((err) => console.log(err))
  }

  handleEditAvatarClick = () => {
    this.setState({ isEditAvatarPopupOpen: true })
  }

  handleEditProfileClick = () => {
    this.setState({ isEditProfilePopupOpen: true })
  }
  handleAddPlaceClick = () => {
    this.setState({ isAddPlacePopupOpen: true })
  }

  handleCardClick = (data) => {
    this.setState({ selectedCard: data })
  }

  setCard = (data) => {
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
    this.setState({ cards: newCards })
  }

  handleCardLike = (card) => {
    const isLiked = card.likes.some(i => i._id === this.state.currentUser._id);
    if (isLiked) {
      api.deleteLike(card._id)
        .then((data) => {
          this.setCard(data)
        })
        .catch((err) => console.log(err))
    } else {
      api.putLike(card._id)
        .then((data) => {
          this.setCard(data)
        })
        .catch((err) => console.log(err))
    }
  }

  handleCardDelete = (card) => {
    this.setState({
      isConfirmPopupOpen: true,
      cardToDelete: card
    })
  }

  handleConfirmSubmit = (card) => {
    this.setState({ isLoading: true })
    api.deleteCard(card._id)
      .then((data) => {
        const newCards = this.state.cards.filter(item => item._id !== card._id);
        this.setState({ cards: newCards });
        this.closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { this.setState({ isLoading: false }) })
  }

  handleUpdateUser = (name, about) => {
    this.setState({ isLoading: true })
    api.patchUserInfo(name, about)
      .then((data) => {
        this.setState({ currentUser: data });
        this.closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { this.setState({ isLoading: false }) })
  }

  handleUpdateAvatar = (newAvatar) => {
    this.setState({ isLoading: true })
    api.pacthAvatarImg(newAvatar)
      .then((data) => {
        this.setState(prevState => ({ currentUser: { ...prevState.currentUser, avatar: data.avatar } }));
        this.closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { this.setState({ isLoading: false }) })
  }

  handleAddPlace = (name, link) => {
    this.setState({ isLoading: true })
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
        this.setState(prevState => ({ cards: [newCard, ...prevState.cards] }))
        this.closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => { this.setState({ isLoading: false }) })
  }

  closeAllPopups = () => {
    this.setState({
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isConfirmPopupOpen: false,
      selectedCard: {}
    })
  }
  handleLogin = () => {
    this.setState({ loggedIn: true })
  }

  render() {
    return (
      <CurrentUserContext.Provider value={this.state.currentUser}>
        <div className="page">
          
          <Routes>
            <Route path="/" element={this.state.loggedIn ? <Navigate to="/main" replace /> : <Navigate to="/sign-up" replace />} />
            <Route path="/main" element={<ProtectedRouteElement
              element={
                <Main cards={this.state.cards}
                  onEditProfile={this.handleEditProfileClick}
                  onAddPlace={this.handleAddPlaceClick}
                  onEditAvatar={this.handleEditAvatarClick}
                  onCardClick={this.handleCardClick}
                  onLikeClick={this.handleCardLike}
                  onCardDelete={this.handleCardDelete}
                />
              }
              loggedIn={this.state.loggedIn}/>} /> 
            <Route path="/sign-up" element={<Register />} />
            <Route path="/sign-in" element={<Login handleLogin={this.handleLogin} />} />
          </Routes>
          <Footer />
          <EditProfilePopup
            isOpen={this.state.isEditProfilePopupOpen}
            onClose={this.closeAllPopups}
            onUpdateUser={this.handleUpdateUser}
            isLoading={this.state.isLoading}
          />
          <AddPlacePopup
            isOpen={this.state.isAddPlacePopupOpen}
            onClose={this.closeAllPopups}
            onAddPlace={this.handleAddPlace}
            isLoading={this.state.isLoading}
          />
          <EditAvatarPopup
            isOpen={this.state.isEditAvatarPopupOpen}
            onClose={this.closeAllPopups}
            onUpdateAvatar={this.handleUpdateAvatar}
            isLoading={this.state.isLoading}
          />
          <ConfirmPopup
            isOpen={this.state.isConfirmPopupOpen}
            onClose={this.closeAllPopups}
            onConfirmSubmit={this.handleConfirmSubmit}
            cardToDelete={this.state.cardToDelete}
            isLoading={this.state.isLoading}
          />
          <ImagePopup card={this.state.selectedCard} onClose={this.closeAllPopups} />
        </div>
      </CurrentUserContext.Provider >
    )
  };
}

export default App;
