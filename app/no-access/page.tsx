'use client';

import { useRouter } from 'next/navigation';

export default function NoAccessPage() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'access_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#ff9000]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#ff9000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Toegang Vereist
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Je hebt een geldige access code nodig om dit platform te gebruiken
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          <div className="bg-[#1a1a1a]/50 rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="text-white font-medium mb-1">Contact via Snapchat</h3>
                <p className="text-gray-400 text-sm">Stuur een bericht om een code aan te vragen</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="text-white font-medium mb-1">Betaling Voltooien</h3>
                <p className="text-gray-400 text-sm">Volg de betaalinstructies</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="text-white font-medium mb-1">Code Ontvangen</h3>
                <p className="text-gray-400 text-sm">Je ontvangt een unieke 12-karakter code</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a]/50 rounded-xl p-4 border border-[#2a2a2a]">
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 bg-[#ff9000] rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="text-white font-medium mb-1">Inloggen</h3>
                <p className="text-gray-400 text-sm">Voer je code in op de login pagina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="https://snapchat.com/add/YOUR_SNAPCHAT"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#FFFC00] hover:bg-[#FFFC00]/90 text-black font-semibold py-4 px-6 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>
            </svg>
            Contact via Snapchat
          </a>
          
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#ff9000] hover:bg-[#ff9000]/90 text-black font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Ik heb al een code
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full text-gray-400 hover:text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Terug naar login
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Problemen? Neem contact op via Snapchat
          </p>
        </div>
      </div>
    </div>
  );
}
