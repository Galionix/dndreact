import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="relative w-full h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* затемнённый фон с градиентом */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-90 z-0" />

      {/* логотип и заголовок */}
      <div className="z-10 flex flex-col items-center gap-6 text-center px-4">
        <Image src="/logo.png" alt="Logo" width={128} height={128} priority />
        <h1 className="text-4xl font-bold tracking-wide">Chronicles of Emberfall</h1>
        <p className="text-gray-400 max-w-md">
          Тёмное интерактивное приключение, где каждый выбор определяет судьбу.
        </p>

        {/* кнопки */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push('/game')}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded shadow"
          >
            Продолжить
          </button>
          <button
            onClick={() => router.push('/create-character')}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded shadow"
          >
            Новая игра
          </button>
        </div>
      </div>
    </div>
  )
}