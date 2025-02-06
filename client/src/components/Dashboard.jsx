import { useState, useEffect } from "react"
import axios from "axios"
import "./Dashboard.css"



function Dashboard() {
  const [links, setLinks] = useState([])
  const [selectedLink, setSelectedLink] = useState({ title: "", username: "" })
  const [editingLink, setEditingLink] = useState(null)
  const [theme, setTheme] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#3b2",
  })
  const [username, setUsername] = useState("")
  const [imgProfile, setImgProfile] = useState("")
  const [imageToUpload, setImageToUpload] = useState(null)

  const socialMediaList = [
    { title: "https://www.facebook.com/", url: "https://www.facebook.com/" },
    { title: "https://www.instagram.com/", url: "https://www.instagram.com/" },
    { title: "https://twitter.com/", url: "https://twitter.com/" },
    { title: "https://www.linkedin.com/in/", url: "https://www.linkedin.com/in/" },
    { title: "https://www.youtube.com/", url: "https://www.youtube.com/" },
    { title: "https://www.tiktok.com/", url: "https://www.tiktok.com/" },
    { title: "https://www.pinterest.com/", url: "https://www.pinterest.com/" },
  ]
//enviar al login si no hay token

  if (!localStorage.getItem("token")) {
    window.location.href = "/"
  }

  useEffect(() => {
    fetchLinks()
    fetchTheme()
    fetchUsername()
    fetchImgProfile()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/links", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setLinks(response.data)
    } catch (error) {
      console.error("Error al obtener enlaces:", error)
    }
  }

  const fetchTheme = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setTheme(
        response.data.theme || {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          buttonColor: "#3fb8af",
        },
      )
    } catch (error) {
      console.error("Error al obtener tema:", error)
      setTheme({
        backgroundColor: "#ffffff",
        textColor: "#000000",
        buttonColor: "#3fb8af",
      })
    }
  }

  const fetchUsername = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsername(response.data.username || "Invitado")
    } catch (error) {
      console.error("Error al obtener el nombre de usuario:", error)
    }
  }

  const fetchImgProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setImgProfile(response.data.profile_image)
    } catch (error) {
      console.error("Error al obtener la imagen de perfil:", error)
    }
  }

  const handleProfileImageChange = (e) => {
    setImageToUpload(e.target.files[0])
  }

  const handleUploadImage = async () => {
    if (!imageToUpload) {
      console.error("No hay imagen seleccionada")
      return
    }

    const formData = new FormData()
    formData.append("profile_image", imageToUpload)

    try {
      const response = await axios.put("http://localhost:5000/api/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setImgProfile(response.data.imageUrl)
      console.log("Imagen subida exitosamente:", response.data.imageUrl)
    } catch (error) {
      console.error("Error al subir la imagen:", error)
    }
  }

  const handleAddLink = async () => {
    if (selectedLink.title === "" || selectedLink.username === "") return
    const socialMediaUrl = socialMediaList.find((sm) => sm.title === selectedLink.title)?.url
    const fullUrl = `${socialMediaUrl}${selectedLink.username}`
    try {
      await axios.put(
        "http://localhost:5000/api/links",
        { links: [...links, { title: selectedLink.title, url: fullUrl }] },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      setSelectedLink({ title: "", username: "" })
      fetchLinks()
    } catch (error) {
      console.error("Error al añadir enlace:", error)
    }
  }

  const handleDeleteLink = async (index) => {
    try {
      const updatedLinks = links.filter((_, i) => i !== index)
      await axios.put(
        "http://localhost:5000/api/links",
        { links: updatedLinks },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      fetchLinks()
    } catch (error) {
      console.error("Error al eliminar enlace:", error)
    }
  }

  const handleEditLink = (link, index) => {
    setEditingLink({ ...link, index })
  }

  const handleUpdateLink = async () => {
    try {
      const updatedLinks = [...links]
      updatedLinks[editingLink.index] = { title: editingLink.title, url: editingLink.url }
      await axios.put(
        "http://localhost:5000/api/links",
        { links: updatedLinks },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      setEditingLink(null)
      fetchLinks()
    } catch (error) {
      console.error("Error al actualizar enlace:", error)
    }
  }

  return (
    <div className="dashboard-container" style={{ height: "90%",display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 className="dashboard-title">Dashboard</h1>
        <button onClick={() => {
          localStorage.removeItem("token")
          window.location.href = "/"
        }} className="logout-button">
          Cerrar Sesión
        </button>
      <div className="dashboard-content">
        <div className="profile-section">
          <div className="profile-image-container">
            {imgProfile ? (
              <img src={`http://localhost:5000${imgProfile}`} alt="Perfil" className="profile-img" />
            ) : (
              <p className="no-image">No hay imagen</p>
            )}
          </div>
          <input type="file" onChange={handleProfileImageChange} className="file-input" />
          <br />
          <button onClick={handleUploadImage} className="upload-button">
            Subir Imagen
          </button>
        </div>
        <h2 className="welcome-message">Bienvenido, {username}</h2>
        <div className="links-section">
          <h3 className="section-title">Aquí tienes tus enlaces:</h3>
          <button onClick={() => (window.location.href = `/u/${username}`)} className="view-profile-button">
            Ver perfil publico
          </button>
          <div className="add-link-form">
            <h4>Añadir nuevo enlace</h4>
            <select
              value={selectedLink.title}
              onChange={(e) => {
                const selectedSocial = e.target.value
                setSelectedLink({ title: selectedSocial, username: "" })
              }}
              className="input-field"
            >
              <option value="">Selecciona una red social</option>
              {socialMediaList.map((social, index) => (
                <option key={index} value={social.title}>
                  {social.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={selectedLink.username}
              onChange={(e) => setSelectedLink({ ...selectedLink, username: e.target.value })}
              className="input-field"
            />
            {selectedLink.title && selectedLink.username && (
              <button onClick={handleAddLink} className="add-link-button">
                Añadir enlace
              </button>
            )}
          </div>
          <div className="links-list">
            {links.length > 0 ? (
              links.map((link, index) => (
                <div key={index} className="link-item">
                  <p>
                    {link.title}: {link.url}
                  </p>
                  <div className="link-actions">
                    <button onClick={() => handleEditLink(link, index)} className="edit-button">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteLink(index)} className="delete-button">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-links">No hay enlaces disponibles.</p>
            )}
          </div>
        </div>
      </div>
      {editingLink && (
        <div className="edit-section">
          <h3>Editar enlace</h3>
          <input
            type="text"
            value={editingLink.title}
            onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
            className="input-field"
          />
          <input
            type="text"
            value={editingLink.url}
            onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
            className="input-field"
          />
          <button onClick={handleUpdateLink} className="update-button">
            Actualizar
          </button>
          <button onClick={() => setEditingLink(null)} className="cancel-button">
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard

