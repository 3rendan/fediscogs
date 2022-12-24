import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

const recordsItem = ({ record, id, onDelete, onEdit }) => {
  return (
    <li className="categoryrecord">
        <Link to={`/category/${record.type}/${id}`} className='categoryrecordLink'>
            <img src={record.imgUrls[0]} alt={record.name} className='categoryrecordImg' />
            <div className="categoryrecordDetails">
                <p className="categoryrecordLocation">
                    {record.location}
                </p>
                <p className="categoryrecordName">
                    {record.name}
                </p>
                <p className="categoryrecordPrice">
                    ${ record.offer 
                    ? record.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : record.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    { record.type === 'rent' && ' / Month '}             
                </p>
                <div className="categoryrecordInfoDiv">
                    <img src={bedIcon} alt="Bed" />
                    <p className="categoryrecordInfoText">
                        { record.bedrooms > 1 ? `${record.bedrooms} Bedrooms` : '1 Bedroom'}
                    </p>
                    <img src={bathtubIcon} alt="bathtub" />
                    <p className="categoryrecordInfoText">
                        { record.bathrooms > 1 ? `${record.bathrooms} Bathrooms` : '1 Bathroom'}
                    </p>
                </div>
            </div>
        </Link>
        { onDelete && (
            <DeleteIcon className='removeIcon' fill='rgb(231,76,60)' onClick={() => onDelete(record.id, record.name)} />
        )}
        { onEdit && (
            <EditIcon className='editIcon' onClick={() => onEdit(id)} />
        )}
    </li>
  )
}
export default recordsItem
