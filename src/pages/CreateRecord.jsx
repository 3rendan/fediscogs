import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase.config'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

const Createrecord = () => {
  // eslint-disable-next-line
    const [ geolocationEnabled, setGeolocationEnabled ] = useState(true)
    const [ loading, setLoading ] = useState(false)
    const [ formData, setFormData ] = useState({
        type: 'Full Length',
        title: '',
        artist: '',
        regularPrice: 0,
        discountedPrice: 0,
        imgages: {},
        links: {},
        year: 1999,
        address: ''
    })
    const {
      type,
      title,
      artist,
      regularPrice,
      discountedPrice,
      images,
      links,
      address,
      year,
      latitude,
      longitude 
    } = formData
    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)
    useEffect(() => {
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])
    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        if(discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price cannot be more than regular price')
            return
        }
        if(images.length > 6) {
            setLoading(false)
            toast.error('You can upload a maximum of 6 images')
            return
        }
        if(links.length > 6) {
            setLoading(false)
            toast.error('You can upload a maximum of 6 images')
            return
        }
        let geolocation = { }
        let location
        if(geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`)
            const data = await response.json()
            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            location = address
        }
        if(location === undefined || location.includes('undefined')) {
            setLoading(false)
            toast.error('Please enter a correct address')
            return
        }
        // Store image in firebase
        const storeImage = async (image) => {
          return new Promise((resolve, reject) => {
            const storage = getStorage()
            const fileName = `${auth.currentUser.uid}-${image.title}-${uuidv4()}`
            const storageRef = ref(storage, 'img/' + fileName)
            const uploadTask = uploadBytesResumable(storageRef, image)
            uploadTask.on(
              'state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log('Upload is ' + progress + '% done')
                console.log(storage)
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused')
                    break
                  case 'running':
                    console.log('Upload is running')
                    break
                  default:
                    break
                }
              }, 
              (error) => {
                reject(error)
              }, 
              () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL)
                })
              }
            )
          })
        }
        const imgUrls = await Promise.all(
          [...images].map((image) => storeImage(image))
        ).catch(() => {
          setLoading(false)
          toast.error('Images not uploaded')
          return
        })
        const formDataCopy = {
          ...formData,
          imgUrls,
          geolocation,
          timestamp: serverTimestamp()
        }
        delete formDataCopy.images
        delete formDataCopy.address
        location && (formDataCopy.location = location)
        !formDataCopy.offer && delete formDataCopy.discountedPrice
        const docRef = await addDoc(collection(db, 'records'), formDataCopy)
        setLoading(false)
        toast.success('You have created a new record!')
        console.log(formDataCopy)
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }
    const onMutate = (e) => {
        let boolean = null
        if(e.target.value === true) {
            boolean = true
        } 
        if(e.target.value === false) {
            boolean = false
        } 
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                img: e.target.files
            }))
        }
        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }
    }
    if(loading) {
        return <Spinner />
    }
  return (
    <div className='profile'>
      <header>
        <p className='pageHeader'>Create a record</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className='formButtons'>
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className='formLabel'>Title</label>
          <input
            className='formInputName'
            type='text'
            id='title'
            value={title}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />
          <label className='formLabel'>Artist</label>
          <input
            className='formInputName'
            type='text'
            id='artist'
            value={artist}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />
          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          <label className='formLabel'>Images</label>
          <p className='imgInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createrecordButton'>
            Create record
          </button>
        </form>
      </main>
    </div>
  )
}
export default Createrecord
