const IntegrationsFlow = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-16">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mb-8">
          <div className="integration-box group">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-blue-600 rounded-lg">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mt-2">Microsoft Teams</p>
          </div>

          <div className="integration-box group">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-blue-500 rounded-lg">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mt-2">Outlook Calendar</p>
          </div>

          <div className="integration-box group">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-green-500 rounded-lg">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mt-2">Google Meet</p>
          </div>

          <div className="integration-box group">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-blue-400 rounded-lg">
              <span className="text-white font-bold text-lg">📅</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-gray-700 mt-2">Google Calendar</p>
          </div>
        </div>

        <div className="relative w-full max-w-4xl h-32 md:h-40">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="xMidYMid meet">
            <line x1="100" y1="0" x2="100" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />
            <line x1="300" y1="0" x2="300" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />
            <line x1="500" y1="0" x2="500" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />
            <line x1="700" y1="0" x2="700" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />

            <line x1="100" y1="80" x2="400" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />
            <line x1="700" y1="80" x2="400" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />

            <line x1="400" y1="80" x2="400" y2="160" stroke="#3b82f6" strokeWidth="3" strokeDasharray="10 5" className="flow-line" />
          </svg>
        </div>

        <div className="integration-box integration-box-notably group">
          <img src="/Notably logo icon.svg" alt="Notably" className="w-12 h-12 md:w-16 md:h-16" />
          <p className="text-sm md:text-base font-semibold text-white mt-2">Notably</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsFlow;
