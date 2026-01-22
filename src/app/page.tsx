import Quiz from '@/components/Quiz';

export default function Home() {
  return (
    <main
      className="
        relative
        min-h-screen
        bg-[url('/quiz-background.jpg')]
        bg-cover //cover
        bg-center
        bg-no-repeat
        bg-fixed
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* Оверлей для лучшей читаемости */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Карточка квиза */}
      <div className="
        relative z-10
        max-w-2xl w-full
        bg-white/85
        backdrop-blur-lg
        rounded-3xl
        shadow-2xl
        border border-white/20
        overflow-hidden
      ">
        <Quiz />
      </div>
    </main>
  );
}
