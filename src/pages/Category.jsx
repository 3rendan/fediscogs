import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter 
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import RecordItem from '../components/RecordItem'

const Category = () => {
    const [ records, setrecords ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ lastFetchedrecord, setLastFetchedrecord ] = useState(null)
    const params = useParams()
    useEffect(() => {
     const fetchrecords = async () => {
        try {
            // Fetch reference
            const recordsRef = collection(db, 'records')
            // Create a query
            const q = query(recordsRef, 
                where('type', '==', params.categoryName), 
                orderBy('timestamp', 'desc'), 
                limit(10)
            )
            // Execute query and get snapshot
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedrecord(lastVisible)
            const records = []
            querySnap.forEach((doc) => {
                return records.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setrecords(records)
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch records')
        }
     }
     fetchrecords()   
    }, [params.categoryName])
    // Pagination/ Load more
    const onFetchMorerecords = async () => {
        try {
            // Fetch reference
            const recordsRef = collection(db, 'records')
            // Create a query
            const q = query(recordsRef, 
                where('type', '==', params.categoryName), 
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedrecord), 
                limit(10)
            )
            // Execute query and get snapshot
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedrecord(lastVisible)
            const records = []
            querySnap.forEach((doc) => {
                return records.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setrecords((prevState) => [...prevState, ...records])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch records')
        }
     }
  return (
    <div className="category">
        <header>
            <p className="pageHeader">{ params.categoryName === 'rent' ? 'Places for Rent' : 'Places for Sale' }</p>
        </header>
        { loading ?( 
            <Spinner />
        ) : records && records.length > 0 ? (
        <>
        <main>
            <ul className="categoryrecords">
                { records.map((record) => (
                    <RecordItem record={record.data} id={record.id} key={record.id}/>
                ))}
            </ul>
        </main>
        <br />
        <br />
        { lastFetchedrecord && (
            <p className="loadMore" onClick={onFetchMorerecords}>Load More</p>
        )}
        </>
        ) : (
            <p>No records for { params.categoryName }</p>
        )}
    </div>
  )
}
export default Category