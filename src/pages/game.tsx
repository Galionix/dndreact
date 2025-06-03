import React, { useState } from "react";
import {
  CharacterStatsDisplay,
  skillLabels,
} from "@/components/CharacterStatsDisplay";
import { useCharacterStore } from "@/store/character";
import { useHistoryStore } from "@/store/history";
import LogoPortal from "@/components/LogoPortal";

export default function GameScreen() {
  const character = useCharacterStore((state) => state.character);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  const messages = useHistoryStore((state) => state.messages);
  const pendingCheck = useHistoryStore((state) => state.pendingCheck);
  const addMessage = useHistoryStore((state) => state.addMessage);
  const setPendingCheck = useHistoryStore((state) => state.setPendingCheck);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim() || !character) return;

    const cleanedInput = input.replace(/\[\[.*?\]\]/g, "");
    addMessage({ type: "user", text: cleanedInput });
    setInput("");

    if (pendingCheck && pendingCheck.skill && pendingCheck.skill !== null) {
      const skillValue = character.skills[pendingCheck.skill] || 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      const success = roll <= skillValue;
      const resultText = `Бросок на ${skillLabels[`${pendingCheck.skill}`]}: ${roll} против ${skillValue} — ${success ? "успех" : "неудача"}.`;

      addMessage({ type: "master", text: resultText });
      setPendingCheck(null);
      return;
    }

    setLoading(true);
    const seedNumber = Math.floor(Math.random() * 10000) + 1;

    const seedResult = await fetch("/api/grokSeed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: seedNumber }),
    });

    const seedText = await seedResult.text();

    const lastMessages = messages.slice(-5).map((m) => ({
      role: m.type === "user" ? "user" : "assistant",
      content: m.text,
    }));

    const systemMessage = {
      role: "system",
      content: `Вот текущий персонаж пользователя: ${JSON.stringify(character)}.
      Пользователь будет описывать действия, а ты будешь отвечать в стиле мастера D&D. Кратко и атмосферно.
      Для создания уникального контента используй эти наработки. "${seedText}"
      Не используй персонажей из наработки. создавай новых персонажей основываясь на персонаже пользователя.
      Если требуется проверка навыка, в конце текста укажи это в формате [[skill:название_навыка]].`,
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          systemMessage,
          ...lastMessages,
          { role: "user", content: cleanedInput },
        ],
      }),
    });

    const { reply } = await res.json();
    const rawText = reply.content;

    const match = rawText.match(/\[\[skill:(.+?)\]\]/i);
    let processedText = rawText;
    if (match) {
      const skillName = match[1];
      processedText = rawText.replace(match[0], "").trim();
      setPendingCheck({ skill: skillName });
    }

    addMessage({ type: "master", text: processedText });
    setLoading(false);
  };

  const useItem = (item: string) => {
    if (!character) return;
    const newInventory = character.inventory.filter((i) => i !== item);
    setCharacter({ ...character, inventory: newInventory });
    addMessage({ type: "user", text: `Вы используете предмет: ${item}` });
  };

  if (!character)
    return <p className="text-center text-white">Персонаж не создан.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto text-white space-y-4">
      <CharacterStatsDisplay character={character} />

      <div className="bg-gray-900 rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2">История</h2>
        <div className="max-h-64 overflow-y-auto text-sm space-y-1">
          {messages.map((entry, i) => (
            <p
              key={i}
              className={
                entry.type === "user" ? "text-blue-300" : "text-yellow-300"
              }
            >
              {entry.type === "user" ? `Вы: ${entry.text}` : entry.text}
            </p>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
          placeholder="Опиши своё действие..."
        />

        <button onClick={handleSubmit} className="mt-2 button">
          {pendingCheck ? `Проверить навык: ${skillLabels[`${pendingCheck.skill}`]}` : "Отправить"}
        </button>
      </div>

      <div className="bg-gray-800 rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Инвентарь</h2>
        <div className="flex flex-wrap gap-2">
          {character.inventory.map((item, i) => (
            <button
              key={i}
              onClick={() => useItem(item)}
              className="px-2 py-1 text-sm rounded border border-yellow-500 hover:bg-yellow-900"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <LogoPortal open={loading} />
    </div>
  );
}
