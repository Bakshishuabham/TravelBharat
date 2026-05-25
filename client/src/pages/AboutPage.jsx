import { Shield, Target, Map } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function AboutPage() {
  useDocumentTitle('About');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="section-title text-4xl md:text-5xl">About TravelBharat</h1>
          <p className="section-subtitle mt-4 text-lg">
            Your Digital Travel Encyclopedia of India
          </p>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/70 leading-relaxed text-lg">
            TravelBharat was built to solve a simple problem: the lack of a single, structured, and comprehensive platform for discovering Indian tourist destinations. Our mission is to provide accurate, state-wise, and city-wise information that helps travelers, students, and researchers explore the incredible diversity of India's heritage, nature, and culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-saffron-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Map className="w-6 h-6 text-saffron-500" />
            </div>
            <h3 className="font-semibold text-white mb-2">Centralized Data</h3>
            <p className="text-white/60 text-sm">Every state, union territory, and major city organized logically in one place.</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Verified Information</h3>
            <p className="text-white/60 text-sm">Carefully curated details regarding timings, entry fees, and historical significance.</p>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Focus on Discovery</h3>
            <p className="text-white/60 text-sm">Promoting both famous landmarks and lesser-known hidden gems to encourage domestic tourism.</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/50 text-sm">
            Developed as part of the Unified Mentor Fullstack Internship Program.
          </p>
        </div>
      </div>
    </div>
  );
}
