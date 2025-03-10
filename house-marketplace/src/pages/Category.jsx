import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    // console.log("useEffect triggered with category:", params.categoryName);

    const fetchListings = async () => {
    //   console.log("fetchListings function triggered");
      try {
        // Get reference to Firestore collection
        const listingsRef = collection(db, "listings");

        // Create a query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);

        const listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        // console.log("Fetched Listings:", listings);

        setListings(listings);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching listings:", error);
        toast.error("Could not fetch listings");
      }
    };

    fetchListings(); // Invoke the fetchListings function
  }, [params.categoryName]); // Dependency array ensures useEffect runs when category changes

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem 
                listing={listing.data}
                id={listing.id}
                key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  );
}

export default Category;

