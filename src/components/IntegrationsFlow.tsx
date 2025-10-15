const IntegrationsFlow = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-16">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mb-8">
          <div className="integration-box group">
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftteams.svg" 
              alt="Microsoft Teams" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            />
          </div>

          <div className="integration-box group">
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftoutlook.svg" 
              alt="Outlook Calendar" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            />
          </div>

          <div className="integration-box group">
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlemeet.svg" 
              alt="Google Meet" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            />
          </div>

          <div className="integration-box group">
            <img 
              src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlecalendar.svg" 
              alt="Google Calendar" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain" 
            />
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
