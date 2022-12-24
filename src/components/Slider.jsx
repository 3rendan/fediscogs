import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from '@firebase/firestore'
import { db } from '../firebase.config'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import Spinner from './Spinner'




const Slider = () => {
  const [ records, setrecords ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchrecords = async() => {    
      const recordsRef = collection(db, 'records')
      const q = query(recordsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)
  
      let records = []
      querySnap.forEach((doc) => {
        return records.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setrecords(records)
      setLoading(false)
    }
    fetchrecords()
  }, [])
  if(loading) {
    return <Spinner />
  }
  if(records.length === 0) {
    <> </>
  }
  return records && (
    <>
    <p className="exploreHeading">Recommended</p>
    <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        navigation
        scrollbar={{ draggable: true }}
    >
      { records.map(({data, id}) => (
        <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
          <div style={{
                background: `url(${data.imgUrls[0]}) center no-repeat`,
                backgroundSize: 'cover',
                minHeight: '16rem',
              }}
              className='swiperSlideDiv'
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                ${data.discountedPrice ? data.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </p>
          </div>

        </SwiperSlide>
      ))}
    </Swiper>
    </>
  )
}

export default Slider

