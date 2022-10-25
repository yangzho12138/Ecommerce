import React from 'react'
import PropTypes from 'prop-types'


const Rating = ({ value, text, color }) => {
  return (
    <div className='rating'>
        {/* five stars for rating */}
      <span>
        <i style={{color: color}} className={value >= 1 ? 'fas fa-star' : value >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i style={{color: color}} className={value >= 2 ? 'fas fa-star' : value >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i style={{color: color}} className={value >= 3 ? 'fas fa-star' : value >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i style={{color: color}} className={value >= 4 ? 'fas fa-star' : value >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      <span>
        <i style={{color: color}} className={value >= 5 ? 'fas fa-star' : value >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
      </span>
      {/* equals to {text ? text : ''} */}
      <span>{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
    color: "#57b99d",
}

// Rating.propTypes = {
//     value: PropTypes.number.isRequired, // check the props type and required
//     text: PropTypes.string.isRequired,
//     color: PropTypes.string,
// }

export default Rating
