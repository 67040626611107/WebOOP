import PopcatButton from '@/components/PopcatButton';
import Leaderboard from '@/components/Leaderboard';
import UsernameForm from '@/components/UsernameForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            🐱 POPCAT GAME
          </h1>
          <p className="text-xl text-gray-700">
            Click the cat as fast as you can!
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Game */}
          <div className="flex flex-col gap-8">
            <UsernameForm />
            <div className="bg-white rounded-2xl shadow-xl p-12 flex justify-center">
              <PopcatButton />
            </div>
          </div>

          {/* Right Side - Leaderboard */}
          <div className="lg:sticky lg:top-8">
            <Leaderboard />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Built with Next.js, TypeScript, MongoDB & Elysia
          </p>
          <p className="text-xs mt-2">
            Featuring OOP Principles: Encapsulation, Inheritance, Polymorphism, Abstraction & Composition
          </p>
        </footer>
      </div>
    </main>
  );
}
