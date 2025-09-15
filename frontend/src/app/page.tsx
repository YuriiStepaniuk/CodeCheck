import Link from 'next/link';

export default function Home() {
  return (
    <div className="mt-12 flex flex-col justify-center items-center text-center h-full px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Welcome to Code Helper App!
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Please login to get started.
      </p>

      <div className="flex space-x-4">
        <Link
          href="/login"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
