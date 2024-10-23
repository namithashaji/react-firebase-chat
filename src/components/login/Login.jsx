import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaEnvelope, FaLock, FaUser, FaCamera } from "react-icons/fa"; // Icons
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import upload from "../../lib/upload";

// Motion animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  loading: { opacity: 0.6, scale: 0.95 },
};

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  // Separate loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Use react-intersection-observer to trigger animations
  const { ref: loginRef, inView: loginInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { ref: registerRef, inView: registerInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    if (!username || !email || !password) {
      toast.warn("Please enter inputs!");
      setRegisterLoading(false);
      return;
    }
    if (!avatar.file) {
      toast.warn("Please upload an avatar!");
      setRegisterLoading(false);
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.warn("Select another username");
      setRegisterLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    if (!email || !password) {
      toast.warn("Please enter your email and password!");
      setLoginLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <motion.div className="login">
      <motion.div
        className="item"
        variants={containerVariants}
        initial="hidden"
        animate={loginInView ? "visible" : "hidden"}
        ref={loginRef}
      >
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <motion.div className="input-group">
            <FaEnvelope className="input-icon" />
            <motion.input
              type="text"
              placeholder="Email"
              name="email"
              whileFocus={{ scale: 1.05, borderColor: "#00b4d8" }}
              required
            />
          </motion.div>

          <motion.div className="input-group">
            <FaLock className="input-icon" />
            <motion.input
              type="password"
              placeholder="Password"
              name="password"
              whileFocus={{ scale: 1.05, borderColor: "#00b4d8" }}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loginLoading}
            variants={buttonVariants}
            whileHover={!loginLoading ? "hover" : ""}
            whileTap={!loginLoading ? "tap" : ""}
            className={loginLoading ? "loading" : ""}
          >
            {loginLoading ? "Loading..." : "Sign In"}
          </motion.button>
        </form>
      </motion.div>

      <div className="separator"></div>

      <motion.div
        className="item"
        variants={containerVariants}
        initial="hidden"
        animate={registerInView ? "visible" : "hidden"}
        ref={registerRef}
      >
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file" className="avatar-label">
            <motion.img
              src={avatar.url || "./src/assets/avatar.png"}
              alt="avatar"
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="avatar"
            />
            <FaCamera className="input-icon avatar-icon" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />

          <motion.div className="input-group">
            <FaUser className="input-icon" />
            <motion.input
              type="text"
              placeholder="Username"
              name="username"
              whileFocus={{ scale: 1.05, borderColor: "#00b4d8" }}
              required
            />
          </motion.div>

          <motion.div className="input-group">
            <FaEnvelope className="input-icon" />
            <motion.input
              type="email"
              placeholder="Email"
              name="email"
              whileFocus={{ scale: 1.05, borderColor: "#00b4d8" }}
              required
            />
          </motion.div>

          <motion.div className="input-group">
            <FaLock className="input-icon" />
            <motion.input
              type="password"
              placeholder="Password"
              name="password"
              whileFocus={{ scale: 1.05, borderColor: "#00b4d8" }}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={registerLoading}
            variants={buttonVariants}
            whileHover={!registerLoading ? "hover" : ""}
            whileTap={!registerLoading ? "tap" : ""}
            className={registerLoading ? "loading" : ""}
          >
            {registerLoading ? "Loading..." : "Sign Up"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
