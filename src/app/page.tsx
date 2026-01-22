import Quiz from '@/components/Quiz';

export default function Home() {
  return (
    <main
      className="
        relative
        min-h-screen
        bg-[url('/quiz-background.jpg')]   // ← твой фон
        bg-cover
        bg-center
        bg-no-repeat
        bg-fixed
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* Тёмный оверлей — всегда */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Более сильный оверлей именно на мобильных (телефонах) */}
      <div className="absolute inset-0 md:hidden bg-black/65" />

      {/* Контент квиза */}
      <div
        className="
          relative z-10
          w-full max-w-2xl
          bg-white/90           // чуть более непрозрачный фон карточки
          backdrop-blur-md
          rounded-2xl
          shadow-2xl
          border border-white/20
          overflow-hidden
          text-gray-900         // тёмный текст для лучшей читаемости
        "
      >
        <Quiz />
      </div>
    </main>
  );
}
