export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mini SNS</h1>
        <p className="text-gray-600 mb-8">로그인 후 시작하세요</p>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            로그인
          </a>
          <a
            href="/register"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}
