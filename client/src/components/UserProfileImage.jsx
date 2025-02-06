import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"

function UserProfileImage({ username }) {
  const [imgProfile, setImgProfile] = useState("")

  useEffect(() => {
    fetchImgProfile()
  }, []) // Removed unnecessary dependency: username

  const fetchImgProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/u/${username}`)
      setImgProfile(response.data.profile_image)
    } catch (error) {
      console.error("Error al obtener la imagen de perfil:", error)
    }
  }

  return (
    <motion.div
      className="profile-image-container"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
    >
      {imgProfile ? (
        <img src={`http://localhost:5000${imgProfile}`} alt="Perfil" className="avatar" />
      ) : (
        <div className="no-image">No hay imagen</div>
      )}
    </motion.div>
  )
}

export default UserProfileImage

