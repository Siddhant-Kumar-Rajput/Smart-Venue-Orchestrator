import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VenueContext } from '../context/VenueContext';
import EngineStatusDot from '../components/shared/EngineStatusDot';
import { startEngine, stopEngine } from '../engine';

export default function Landing() {
  const { state, dispatch, stateRef } = useContext(VenueContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      dispatch({ type: 'ADMIN_LOGIN' });
      navigate('/admin');
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col justify-between items-center py-10 px-4">
      
      <div className="w-full max-w-4xl flex justify-between items-center">
        <div>
          <button 
            onClick={() => setShowInstructionsModal(true)}
            className="flex items-center gap-2 bg-surface hover:bg-border border border-border px-4 py-2 rounded-full transition-colors cursor-pointer text-primary"
          >
            <span className="text-xl">ℹ️</span>
            <span className="text-sm font-semibold">How to use</span>
          </button>
        </div>
        <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-full">
           <EngineStatusDot size="sm" />
           <span className="text-xs font-semibold text-muted">System Active</span>
        </div>
      </div>

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-4xl w-full">
        <h1 className="text-5xl md:text-7xl font-bold text-accent mb-2 tracking-tight text-center">Smart Venue Orchestrator</h1>
        <p className="text-xl md:text-2xl text-primary font-medium mb-16 text-center">Welcome to the event</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
           
           {/* Card 1: Attendee Entry */}
           <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col justify-between hover:border-accent/50 transition-colors">
              <div>
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-2xl flex items-center justify-center text-3xl mb-6">👤</div>
                <h2 className="text-2xl font-bold text-primary mb-2">Attending the event?</h2>
                <p className="text-muted leading-relaxed mb-8">Scan your entry QR code or tap below to begin your personalized journey.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/scan?gate=gate-1')}
                  className="w-full bg-accent hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium transition-colors cursor-pointer"
                >
                   Simulate QR Entry &rarr;
                </button>
                <button 
                  onClick={() => navigate('/attendee')}
                  className="w-full border border-border text-muted hover:text-primary hover:border-primary rounded-lg px-4 py-3 font-medium transition-colors cursor-pointer"
                >
                   View Venue Info
                </button>
              </div>
           </div>

           {/* Card 2: Admin Entry */}
           <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col justify-between hover:border-border transition-colors">
              <div>
                <div className="w-16 h-16 bg-elevated text-primary rounded-2xl flex items-center justify-center text-3xl mb-6">🛡️</div>
                <h2 className="text-2xl font-bold text-primary mb-2">Operations Team</h2>
                <p className="text-muted leading-relaxed mb-8">Access the control centre and live monitoring dashboard.</p>
              </div>
              <div className="mt-auto">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-elevated hover:bg-border text-primary rounded-lg px-4 py-3 font-medium transition-colors cursor-pointer"
                >
                   Admin Login &rarr;
                </button>
              </div>
           </div>

        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-2">
         <p className="text-xs text-muted">Simulation Engine: {state.engine.running ? 'Running' : 'Stopped'}</p>
         <button 
           onClick={() => state.engine.running ? stopEngine(dispatch) : startEngine(dispatch, stateRef)}
           className="text-xs bg-surface border border-border px-3 py-1 rounded-full text-muted hover:text-primary transition-colors cursor-pointer"
         >
           {state.engine.running ? 'Pause Engine' : 'Start Engine'}
         </button>
      </div>

      {showInstructionsModal && (
        <div className="fixed inset-0 bg-base/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-primary">Application Workflow & Instructions</h3>
                <button onClick={() => setShowInstructionsModal(false)} className="text-muted hover:text-primary text-3xl font-bold cursor-pointer leading-none">&times;</button>
              </div>
              
              <p className="text-primary mb-4 bg-accent/20 p-4 rounded-lg border border-accent/30 leading-relaxed shadow-sm">
                <strong>💡 Important:</strong> Whether you are a user or an admin, click on the <strong>Start Engine</strong> button at the bottom of the landing page to start seeing data and feel it simulating a real-time environment.
              </p>

              <div className="space-y-6 text-left">
                <section>
                  <h4 className="text-xl font-semibold text-accent mb-3 flex items-center gap-2">👤 For Users (Attendees)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted leading-relaxed">
                    <li>On this landing page, click on <strong>"Simulate QR Entry &rarr;"</strong> under the <em>"Attending the event?"</em> section.</li>
                    <li>You will be taken to a QR scan screen. Click anywhere on the camera viewport to simulate a successful ticket scan.</li>
                    <li>Fill out the registration form with your details and click <strong>"Complete Registration"</strong>.</li>
                    <li>On the Welcome screen, click <strong>"Let's Go"</strong> to build your journey.</li>
                    <li>Explore the Attendee Dashboard! Use the navigation tabs to view the <strong>Venue Map</strong> and check live <strong>Queues</strong>.</li>
                  </ol>
                </section>
                
                <section>
                  <h4 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">🛡️ For Admins (Operations Team)</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted leading-relaxed">
                    <li>On this landing page, click on <strong>"Admin Login &rarr;"</strong> under the <em>"Operations Team"</em> section.</li>
                    <li>Enter the password <strong><code>admin123</code></strong> and click Login.</li>
                    <li>You are now in the Admin Control Centre. Review the <strong>Dashboard</strong> for a high-level overview of attendees, active zones, and overall status.</li>
                    <li>Use the sidebar to navigate through specialized views: <strong>Heat Map</strong>, <strong>Intent Map</strong>, <strong>CCTV</strong>, and <strong>Incidents</strong>.</li>
                    <li><strong>Pro Tip:</strong> Ensure the Simulation Engine is running (status indicator at the top right of the screen) to see live data updates and attendee movements. You can start/pause it from the Landing Page footer or the Admin Simulation panel.</li>
                  </ol>
                </section>
              </div>

              <div className="mt-8 flex justify-end">
                 <button onClick={() => setShowInstructionsModal(false)} className="bg-accent hover:bg-blue-700 text-white rounded-lg px-6 py-2.5 font-medium transition-colors cursor-pointer">
                   Got it!
                 </button>
              </div>
           </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-base/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <form onSubmit={handleAdminLogin} className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl">
              <h3 className="font-bold text-xl text-primary mb-4">Admin Authentication</h3>
              <p className="text-sm text-muted mb-4">Please enter the operations password to proceed. (Password: admin123)</p>
              <input 
                type="password" 
                autoFocus
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-base border border-border rounded-lg px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent mb-6"
              />
              <div className="flex gap-3">
                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-elevated text-muted hover:text-primary rounded-lg py-2.5 font-medium transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 bg-accent hover:bg-blue-700 text-white rounded-lg py-2.5 font-medium transition-colors">Login</button>
              </div>
           </form>
        </div>
      )}

    </div>
  );
}
