import { Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  GlobeIcon,
  UsersIcon,
  MapPinIcon,
  Heart,
  Star,
  StarHalf,
  StarOff,
} from "lucide-react";

function StaticCounter({ value, icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white/60 backdrop-blur rounded-xl shadow hover:shadow-lg transition">
      <Icon className="w-10 h-10 mb-3 text-primary" />
      <span className="text-4xl font-bold">{value?.toLocaleString()}</span>
      <p className="text-gray-500 mt-1">{text}</p>
    </div>
  );
}

function LocationPulse({ top, left }) {
  return (
    <div
      className="absolute animate-ping"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <div className="w-4 h-4 bg-primary rounded-full opacity-75"></div>
    </div>
  );
}

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    cities: 0,
  });

  const [trendingUsers, setTrendingUsers] = useState([]);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [cities, setCities] = useState([]);

  const [visibleCities, setVisibleCities] = useState(4);
  const [visibleHotels, setVisibleHotels] = useState(6);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // const res = await axios.get("http://localhost:5001/api/vendor/:vendorId");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/review/userdashboard/stats`);

      setStats({
        users: res.data.totalUsers,
        vendors: res.data.totalVendors,
        cities: res.data.totalCities,
      });

      setTrendingUsers(res.data.trendingUsers);

      // ⭐ SORT HOTELS BY RATING – Highest → Lowest
      const sortedHotels = [...res.data.featuredHotels].sort(
        (a, b) => b.averageRating - a.averageRating
      );

      setFeaturedHotels(sortedHotels);
      setCities(res.data.cities);

      setLoading(false);
    } catch (err) {
      console.log("Home page fetch error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100">
      {/* HERO */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-pink-100/20 to-secondary/10">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')] bg-cover bg-center"></div>

        <div className="container mx-auto px-6 relative text-center max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Meet Amazing People Near You
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            Connect with real people locally. Build friendships and
            relationships.
          </p>

          <Link to="/hotels" className="btn btn-primary btn-lg px-10">
            Get Started
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-10 py-20 space-y-20">
        {/* ⭐ FEATURED HOTELS */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Featured Hotels</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredHotels.slice(0, visibleHotels).map((vendor) => {
              //  console.log('hotle data', vendor);
              const hotelImage =
                vendor.photos?.[0] || vendor.image || "/no-hotel.png";
 
              // const rating = vendor.averageRating || 0;
              return (
                <div
                  key={vendor._id}
                  className="rounded-2xl overflow-hidden shadow bg-white hover:shadow-xl transition"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hotelImage})` }}
                  ></div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-bold">{vendor.hotelName}</h3>
                    <p className="text-gray-600">{vendor.location}</p>

                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = vendor.averageRating || 0;

                        if (rating >= star) {
                          return (
                            <Star
                              key={star}
                              size={20}
                              className="text-yellow-500 fill-yellow-500"
                            />
                          );
                        } else if (rating >= star - 0.5) {
                          return (
                            <StarHalf
                              key={star}
                              size={20}
                              className="text-yellow-500 fill-yellow-500"
                            />
                          );
                        } else {
                          return (
                            <StarOff
                              key={star}
                              size={20}
                              className="text-gray-300"
                            />
                          );
                        }
                      })}

                      <span className="font-semibold ml-1">
                        {(vendor.averageRating || 0).toFixed(1)}
                      </span>

                      <span className="text-sm text-gray-500 ml-1">
                        ({vendor.totalReviews || 0} reviews)
                      </span>
                    </div>

                    {/* ➜ View Reviews */}
                    <Link
                      to={`/vendor/${vendor._id}/reviews`}
                      className="text-blue-600 underline text-sm mt-2 block"
                    >
                      View Reviews →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleHotels < featuredHotels.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleHotels((prev) => prev + 6)}
                className="btn btn-outline btn-primary px-10"
              >
                Show More
              </button>
            </div>
          )}
        </section>

        {/* USERS */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Trending Users Near You</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {trendingUsers.map((user) => (
              <div
                key={user._id}
                className="p-4 rounded-xl bg-base-200 shadow hover:shadow-lg transition"
              >
                <img
                  src={user.profilePic || "/default-user.png"}
                  className="w-28 h-28 mx-auto rounded-full border-4 border-primary/40 object-cover"
                />
                <p className="text-center mt-3 font-semibold">
                  {user.fullName}
                </p>
                <p className="text-center text-sm text-gray-500">{user.city}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CITIES */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Popular Cities</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {cities.slice(0, visibleCities).map((city, i) => (
              <div
                key={i}
                className="p-6 bg-base-200 rounded-2xl shadow hover:bg-base-300 transition"
              >
                <h3 className="text-xl font-semibold">{city}</h3>
              </div>
            ))}
          </div>

          {visibleCities < cities.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleCities((prev) => prev + 4)}
                className="btn btn-outline btn-primary px-10"
              >
                Show More
              </button>
            </div>
          )}
        </section>

        {/* STATS */}
        <section className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3 h-72 md:h-96 bg-base-200 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2000px-World_map_-_low_resolution.svg.png')] bg-contain bg-center opacity-40"></div>

            <LocationPulse top={40} left={20} />
            <LocationPulse top={60} left={55} />
            <LocationPulse top={30} left={45} />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <StaticCounter
              value={stats.cities}
              icon={GlobeIcon}
              text="Active Cities"
            />
            <StaticCounter value={stats.users} icon={UsersIcon} text="Users" />
            <StaticCounter
              value={stats.vendors}
              icon={MapPinIcon}
              text="Hotels"
            />
            <StaticCounter value={300} icon={Heart} text="Matches Today" />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary text-white py-16 rounded-xl shadow-lg">
          <h2 className="text-4xl font-bold mb-6">
            Plan Your Next Meetup Today
          </h2>
          <Link to="/hotels" className="btn btn-secondary btn-lg">
            Browse Hotels
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
