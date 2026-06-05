import React, { useEffect } from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import Carcard from './Carcard'
import {useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getPublicCars } from '../redux/ownerSlice'

const Featuredsection = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {publicCars,loading} = useSelector((state)=>state.owner);
    useEffect(()=>{
      dispatch(getPublicCars());
    },[dispatch])
  return (
    <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">
      <div>
        <Title
          title="Featured Vehicles"
          subTitle="Explore Our Selection Of Premium Vehicles For Your Next Adventure"
        />
      </div>
      {loading ? (
        <div className="mt-16 text-lg font-medium text-gray-500">
          Loading Cars...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
          {publicCars?.slice(0, 6).map((car) => (
            <div key={car._id}>
              <Carcard car={car} />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          navigate("/cars");
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore All Cars
        <img src={assets.arrow_icon} alt="" />
      </button>
    </div>
  )
}

export default Featuredsection