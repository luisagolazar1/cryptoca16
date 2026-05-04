import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-black/50 backdrop-blur border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8 h-16">
          <Link href="/" className="font-bold text-xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CRYPTOCA16
          </Link>

          <div className="flex items-center gap-6 ml-auto">
            <Link
              href="/"
              className={`transition-all font-semibold ${
                isActive('/')
                  ? 'text-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Dashboard
            </Link>

            <Link
              href="/advanced"
              className={`transition-all font-semibold ${
                isActive('/advanced')
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🔬 Avanzado
            </Link>

            <Link
              href="/analysis"
              className={`transition-all font-semibold ${
                isActive('/analysis')
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              📈 Análisis
            </Link>

            <a
              href="https://github.com/luisagolazar1/cryptoca16"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-all"
            >
              ⭐ GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
