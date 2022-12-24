import { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import RecordItem from '../components/RecordItem'

const Profile = () => {
  const auth = getAuth()
  const [ changeDetails, setChangeDetails ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const [ records, setrecords ] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUserrecords = async() => {
      const recordsRef = collection(db, 'records')
      const q = query(recordsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
      const querySnap = await getDocs(q)
      const records = []
      querySnap.forEach((doc) => {
        return records.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setrecords(records)
      setLoading(false)
    }
    fetchUserrecords()
  }, [auth.currentUser.uid])
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }
  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name){
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName:name
        })
        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast('Could not update profile details')
    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  const onEdit = (recordId) => navigate(`/edit-record/${recordId}`)
    
  const onDelete = async(id) => {
    if(window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'records', id))
      const updatedrecords = records.filter((record) => record.id !== id )
      setrecords(updatedrecords)
      toast.success('Your record has been deleted')
    }
  }
  const { name, email } = formData
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className="logOut"  onClick={onLogout}>Log Out</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            { changeDetails ? 'done' : 'change' }
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input 
              type="text" 
              id='name' 
              className={ !changeDetails ? 'profileName' : 'profileNameActive' } 
              disabled={!changeDetails} 
              value={name} 
              onChange={onChange}
            />
            <input 
              type="text" 
              id='email' 
              className={ !changeDetails ? 'profileEmail' : 'profileEmailActive' } 
              disabled={!changeDetails} 
              value={email} 
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-record' className='createrecord'>
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        { !loading && records?.length > 0 && (
          <>
            <p className="recordText">You records</p>
            <ul className='recordsList'>
              { records.map((record) => (
                <recordItem key={record.id} record={record.data} id={record.id} onDelete={ () => onDelete(record.id) } onEdit={ () => onEdit(record.id)} />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
export default Profile
