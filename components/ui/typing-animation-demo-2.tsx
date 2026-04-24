import { TypingAnimation } from "./typing-animation";

export function TypingAnimationDemo2() {
  return (
    <TypingAnimation
      words={["Concert 🎤", "Football ⚽", "Volley Ball 🏀", "Game 🎮"]}
      loop
    />
  );
}