import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();
  
  const links = [
    { href: '/', label: '📊 Dashboard', icon: '📊' },
    { href: '/analysis', label: '🤖 AI Analysis', icon: '🤖' },
    { href: '/stats', label: '📈 Market Stats', icon: '📈' },
  ];

  return (
    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent cursor-pointer">
              CRYPTOCA16
            </span>
          </Link>

          <div className="flex gap-2">
            {links.map(link => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                    router.pathname === link.href
                      ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.icon} {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
