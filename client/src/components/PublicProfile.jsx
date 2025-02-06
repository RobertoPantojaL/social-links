import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import "./PublicProfile.css"

function PublicProfile() {
  const [profile, setProfile] = useState(null)
  const { username } = useParams()

  useEffect(() => {
    fetchProfile()
  }, []) // Updated useEffect dependency array

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/u/${username}`)
      setProfile(res.data)
      console.log(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!profile) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
      //agregar. antes de la comilla invertida en la ruta de la imagen
        src={`http://localhost:5000${profile.profile_image}`}
        alt="Avatar"
        className="avatar"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
      />
      <motion.h1 className="username" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {profile.username}
      </motion.h1>
      <motion.p className="welcome-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        Bienvenido al perfil público de {profile.username}. Aquí están algunos de sus enlaces compartidos:
      </motion.p>
      <motion.ul className="links-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {profile.links.map((link, index) => (
          <motion.li
            key={link._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <a className="hover-link" href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default PublicProfile

