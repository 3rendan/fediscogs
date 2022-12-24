import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import { async } from '@firebase/util'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'



const Record = () => {
    const [ record, setRecord ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ shareLinkCopied, setShareLinkCopied ] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchrecord = async () => {
            const docRef = doc(db, 'records', params.recordId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setRecord(docSnap.data())
                setLoading(false)
            }
        }
        fetchrecord() 
    }, [navigate, params.recordId])
    if(loading) {
      return <Spinner />
    }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        uniqueNavElements='false'
        scrollbar={{ draggable: true }}
      >
        {record.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${record.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
                minHeight: '16rem',
              }}
              className='swiperSlideDiv'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='shareIconDiv' onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          setShareLinkCopied(true)
          setTimeout(() => {
            setShareLinkCopied(false)
          }, 2000)
        }} >
          <img src={ shareIcon } alt='Share Icon' />
          { shareLinkCopied && <p className='linkCopied'>Link successfully copied</p> }
          </div>
          <div className='recordDetails'>
            <p className='recordName'>{ record.name } - {' $'}
            { record.offer 
              ? record.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
              : record.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
            <p className='recordLocation'>{ record.location }</p>
            <p className='recordType'>For { record.type === 'rent' ? 'Rent' : 'Sale' }</p>
              { record.offer && (
                <p className='discountPrice'>
                  ${ record.regularPrice - record.discountedPrice } discount 
                </p> 
              )}
                <ul className='recordDetailsList'>
                  <li>
                    { record.bedrooms > 1 ? `${record.bedrooms} Bedrooms` : `1 Bedroom` }
                  </li>
                  <li>
                    { record.bathrooms > 1 ? `${record.bathrooms} Bathrooms` : `1 Bathroom` }
                  </li>
                  <li>
                    { record.parking && `Parking Spot` }
                  </li>
                  <li>
                    { record.furnished && `Fully Furnished` }
                  </li>
                </ul>
                <p className='recordLocationTitle'>
                  Location
                </p>
                <div className="leafletContainer">
                  {/* <MapContainer style={{height: '100%', width: '100%'}} center={[record.geolocation.lat, record.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer 
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
                    />
                    <Marker position={[record.geolocation.lat, record.geolocation.lng]}>
                      <Popup>{record.location}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
                { auth.currentUser?.uuid !== record.userRef && (
                  <Link 
                    to={`/contact/${record.userRef}?recordName=${record.name}`} 
                    className='primaryButton' 
                  >
                    Contact Landlord
                  </Link>
                )} */}
                </div>
          </div>
    </main>
  )
}
export default Record
