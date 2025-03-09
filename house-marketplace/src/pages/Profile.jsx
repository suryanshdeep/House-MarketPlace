import React, { useState,useEffect, use } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDocs,
query,collection,where,orderBy,deleteDoc,} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem'
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
  const [loading,setLoading]=useState(true)
  const [listings,setListings]=useState(null)
  const [formData, setFormData] = useState({
       name:auth.currentUser.displayName,
        email:auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('userRef', '==', auth.currentUser.uid),
          orderBy('timestamp', 'desc')
        );
  
        const querySnap = await getDocs(q);
        console.log('Query Snapshot:', querySnap.size); // Log number of documents
  
        const listing = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data()
        }));
  
        console.log('Fetched Listings:', listing); // Log the listings array
  
        setListings(listing);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };
  
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete=async (listingId)=>{
    if(window.confirm('Are you sure you want to delete ?')){
      await deleteDoc(doc(db,'listings',listingId))
      const updatedListings=listings.filter((listing)=>
        listing.id!==listingId)
        setListings(updatedListings)
        toast.success('Successfully deleted Listing')
      
    }
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in Firebase Auth
        await updateProfile(auth.currentUser, { displayName: name });

        // Update user data in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your Home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
          <p className="listingText">Your Listings</p>
          <ul className="listingList">
            {listings.map((listing)=>(
      <ListingItem key={listing.id} listing={listing.data} id={listing.id}
      onDelete={()=> onDelete(listing.id)} />  
            ))}
          </ul>
          </>
        )}

      </main>
    </div>
  );
}

export default Profile;
