import React, { useState } from "react";
import { Plus, X, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { Switch } from "../components/switch";
import { useNavigate } from "react-router-dom";
import { TabsContent } from "../components/ui/tabs";

export default function Editdashboard() {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const addCard = (type = null) => {
    const newCard = { id: Date.now(), type };
    setCards([...cards, newCard]);
  };

  const removeCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  const clearCards = () => setCards([]);

  // Switch handler: if toggled off, go back to home page
  const handleSwitchChange = (checked) => {
    if (!checked) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
      <Navbar />
      <div className="flex items-center space-x-2 mt-6 px-4">
        <span className="text-sm text-black dark:text-white">Dashboard</span>
        <Switch checked={true} onCheckedChange={handleSwitchChange} />
        <span className="text-sm text-black dark:text-white">Redigering</span>
      </div>

      {/* Header Controls */}
      <div className="flex justify-end items-center gap-4 px-6 py-4 mb-[40px]">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-[#262C2E] px-3 py-2 rounded-lg shadow text-white"
        >
          <Plus className="mr-2" /> Lägg till analyskort
        </button>

        <button
          onClick={clearCards}
          className="flex items-center bg-[#262C2E] px-3 py-2 rounded-lg shadow text-white"
        >
          Rensa allt
          <X className="ml-2" />
        </button>
      </div>

      <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex">
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-xl p-6 relative w-[90%] max-w-6xl shadow-lg h-[80%] max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* X-knapp */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>

              {/* Modalinnehåll */}
              <p className="text-center text-gray-700 font-semibold">
                Lägg till sparade analyser
              </p>
              <button
                onClick={addCard}
                className="flex items-center bg-[#262C2E] px-3 py-2 mt-5 rounded-lg shadow text-white"
              >
                <Plus className="mr-2" /> Lägg till analyskort
              </button>
            </div>
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative bg-white rounded-xl shadow p-4 min-h-[150px]"
            >
              <button
                onClick={() => removeCard(card.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <X />
              </button>
              <p className="text-center text-gray-500">[Kortinnehåll här]</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
