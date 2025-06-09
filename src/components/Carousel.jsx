import { Star } from "lucide-react";
import { useState } from "react";
import SwapModal from "../components/SwapModal";

const Carousel = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(null);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev - 1 + items.length) % items.length);

  const openModal = (item) => {
    setRecipientId(item.user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRecipientId(null);
  };

  const handleSwapSubmit = (response) => {
    console.log("Swap request successful:", response);
    closeModal();
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={item._id} className="min-w-full px-4 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-xl">
              {/* Thumbnail (Video) */}
              <div className="relative bg-gradient-to-r from-orange-400 to-pink-500 aspect-video">
                <video
                  className="w-full h-full object-cover"
                  src={item.videoURL}
                  preload="metadata"
                  controls
                />
              </div>

              {/* Content */}
              <div className="p-6 space-y-2">
                <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
                <p className="text-gray-700 text-sm">
                  Skills: <span className="font-medium">{item.skills}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Offering: <span className="font-medium">{item.categoryOffered}</span> | Looking for:{" "}
                  <span className="font-medium">{item.lookingFor || item.categoryLookingFor}</span>
                </p>
              </div>

              {/* Swap Button */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => openModal(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Swap
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 px-4">
        <button
          onClick={prev}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          ← Prev
        </button>
        <button
          onClick={next}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          Next →
        </button>
      </div>

      {/* Slide Indicator */}
      <p className="text-center mt-3 text-gray-500 font-medium">
        {current + 1} / {items.length}
      </p>

      {/* Modal */}
      {isModalOpen && recipientId && (
        <SwapModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSwapSubmit}
          recipientId={recipientId}
        />
      )}
    </div>
  );
};

export default Carousel;
