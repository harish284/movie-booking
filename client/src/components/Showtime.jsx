import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Showtime = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showtimesData, setShowtimesData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const movie = location.state?.movie;
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        console.log("move name",movie);
        const res = await fetch(
          `http://localhost:3000/api/auth/showtimes/movie/${movie.movieid}`
        );
        const data = await res.json();
        setShowtimesData(data || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [movie]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const filteredShowtimes = showtimesData.filter(
    (show) => show.date?.slice(0, 10) === selectedDate
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 to-purple-900 px-6 py-8 text-white">
      {!movie ? (
        <p className="text-center text-xl text-white">No movie selected.</p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start gap-8">
            <img
              src={`http://localhost:3000${movie.poster}`}
              alt={movie.title}
              className="w-60 h-auto rounded-xl shadow"
            />
            <div>
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              <p className="mt-1">{movie.genre}</p>
              <p>{movie.language}</p>
              <div className="mt-4 font-semibold">
                ❤️ {movie.likes || Math.floor(Math.random() * 100) + 1}% liked this
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 overflow-x-auto">
            {dates.map((date) => {
              const formatted = date.toISOString().split("T")[0];
              return (
                <button
                  key={formatted}
                  onClick={() => setSelectedDate(formatted)}
                  className={`px-4 py-2 rounded-md ${
                    selectedDate === formatted
                      ? "bg-purple-600 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <div>{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div>{date.getDate()}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-6">
            {filteredShowtimes.length === 0 ? (
              <div className="text-center text-white text-xl mt-10">
                No showtimes available for {selectedDate}
              </div>
            ) : (
              filteredShowtimes.map((show) => (
                <div
                  key={show._id}
                  className="bg-white text-black rounded-xl p-4 shadow-md"
                >
                  <div className="text-lg font-semibold">{show.theatre}</div>
                  <div className="flex items-center mt-1">
                    <span className="mr-2 text-lg font-medium">Screen:</span>
                    <span>{show.screen}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() =>
                        navigate("/Bookingpage", { state: { showtime: show } })
                      }
                      className="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-4 py-1 rounded transition"
                    >
                      {show.time}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Showtime;
