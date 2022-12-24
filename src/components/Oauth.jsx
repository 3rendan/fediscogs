import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'


const Oauth = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const onGoogleClick = async (e) => {
        try {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            const user = result.user
            // Check to make sure an account doesn't already exist with email
            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)
            // If user doesn't exist, create user
            if(!docSnap.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            } 
            navigate('/')
        } catch (error) {
            toast.error('It is not happening with Google')
        }
    }

  return (
    <div className='socialLogin'>
        <p>Sign { location.pathname === '/sign-up' ? 'Up' : 'In' } with</p>
        <button className="socialIconDiv" onClick={onGoogleClick}>
            <img src={googleIcon} alt="Google" className='socialIconImg'/>

        </button>
    </div>
  )
}
export default Oauth
