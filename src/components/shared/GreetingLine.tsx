"use client";

interface GreetingLineProps {
  name: string;
}

export function GreetingLine({ name }: GreetingLineProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <p className="text-lg font-semibold text-gray-700 font-heading mb-1">
      {greeting}, {name}
    </p>
  );
}
