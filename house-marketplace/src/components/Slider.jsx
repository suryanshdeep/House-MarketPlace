import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection,getDocs,query,orderBy,limit } from 'firebase/firestore'
import { db } from '../firebase.config'
// ✅ Import Swiper v11 and modules properly
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

// ✅ Import Swiper styles (Use correct styles for v11)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner'

function Slider() {
    const [loading,setLoading]=useState(true);
    const [listings,setListings]=useState(null)
    const navigate =useNavigate()

    useEffect( ()=>{
        const fetchListings= async ()=>{
        const listingRef=collection(db,'listings')
        const q=query(listingRef,orderBy('timestamp','desc',),
        limit(5))
        const querySnap= await getDocs(q)
        let listings=[]
        querySnap.forEach((doc)=>{
            return listings.push({
                id:doc.id,
                data:doc.data()
            })
        })
        console.log(listings)
        setListings(listings)
        setLoading(false)
    }
    fetchListings();
    },[])

    if(loading){
        return <Spinner/>
    }
  return listings && (
    <>
    <p className="exploreHeading">Recommended</p>
    <Swiper 
  modules={[Pagination]} 
  slidesPerView={1} 
  pagination={{clickable:true}}
>
  {listings.map(({data,id})=>(
    <SwiperSlide key={id} onClick={()=> navigate(`/category/${data.type}/${id}`)}>
      <div 
        className="swiperSlideDiv"
        style={{
          background:`url(${data.imgUrls[0]}) center no-repeat`,
          backgroundSize:'cover',
          width: '100%',
          height: '300px' // Set a consistent height
        }}
      >
        <p className="swiperSlideText">
            {data.name}
        </p>
        <p className="swiperSlidePrice">
            ${data.discountedPrice ?? data.regularPrice}{' '}
            {data.type==='rent' && '/ month'}
        </p>
      </div>
    </SwiperSlide>
  ))}
</Swiper>
    </>
  )
}

export default Slider
