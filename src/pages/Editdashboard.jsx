import React, { useState } from "react";
import { Plus, X, User } from "lucide-react";



export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const placeholderCards = [
    { id: 'kostnader', title: 'Kostnader under 500kr' },
    { id: 'fakturor', title: 'Faktura betalningar' },
    { id: 'försäljning', title: 'Försäljning per månad' },
    { id: 'resultat', title: 'Resultatöversikt' },
  ];
  


  const addCard = (type = null) => {
    const newCard = { id: Date.now(), type };
    setCards([...cards, newCard]);
  };
  

  const removeCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const clearCards = () => setCards([]);

  return (
    <div className="min-h-screen ">
      {/* Topbar */}
      

      {/* Header Controls */}
      <div className="flex justify-end items-center gap-4 px-6 py-4 mb-12">
 
  <button
  onClick={() => setShowModal(true)}
  className="flex items-center bg-black px-3 py-2 rounded-xl shadow text-white"
>
  <Plus className="mr-2" /> Lägg till analyskort
</button>

  <button
    onClick={clearCards}
    className="flex items-center bg-black px-3 py-2 rounded-xl shadow text-white"
  > Rensa allt
    <X className="ml-2" /> 
  </button>
</div>

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
    className="flex items-center bg-black px-3 py-2 mt-5 rounded-xl shadow text-white"
  >
    <Plus className="mr-2" /> Lägg till analyskort
  </button>
    
    </div>
  </div>
)}



      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-6">
        {cards.map(card => (
          <div key={card.id} className="relative bg-white rounded-xl shadow p-4 min-h-[150px]">
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
    </div>
  );
}







// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// const availableWidgets = [
//     { id: 'dataTable', name: 'Data Table' },
//     { id: 'aiInsights', name: 'AI Insights' },
//     { id: 'barChart', name: 'Bar Chart' },
//     { id: 'pieChart', name: 'Pie Chart' },
//     { id: 'lineChart', name: 'Line Chart' },
// ];

// const Editdashboard = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Retrieve existing selected widgets from location.state or initialize as empty
//     const [selectedWidgets, setSelectedWidgets] = useState(location.state?.selectedWidgets || []);

//     const handleWidgetToggle = (widgetId) => {
//         setSelectedWidgets((prevWidgets) => {
//             const isSelected = prevWidgets.includes(widgetId);
//             return isSelected
//                 ? prevWidgets.filter((id) => id !== widgetId)
//                 : [...prevWidgets, widgetId];
//         });
//     };

//     const handleSave = () => {
//         // Navigate back to the dashboard with the updated selected widgets
//         navigate('/dashboard', { state: { selectedWidgets } });
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
//             <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
//                 <h1 className="text-xl font-bold">Edit Dashboard</h1>
//                 <button
//                     className="bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white"
//                     onClick={handleSave}
//                 >
//                     Save & Exit
//                 </button>
//             </header>

//             <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow">
//                 <h2 className="text-lg font-bold mb-4">Select Widgets to Display</h2>
//                 <ul className="space-y-4">
//                     {availableWidgets.map((widget) => (
//                         <li key={widget.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-md shadow">
//                             <span>{widget.name}</span>
//                             <input
//                                 type="checkbox"
//                                 checked={selectedWidgets.includes(widget.id)}
//                                 onChange={() => handleWidgetToggle(widget.id)}
//                                 className="form-checkbox h-5 w-5 text-[#26A69A] rounded"
//                             />
//                         </li>
//                     ))}
//                 </ul>
//             </main>

//             <footer className="text-white py-4 dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
//                 <div className="container mx-auto px-4 sm:px-6 text-center">
//                     <p>&copy; {new Date().getFullYear()} eSyn Cloud. All Rights Reserved. Powered by Sitea</p>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default Editdashboard;