// import React, { useState } from "react";
// import {
//   CharacterStatsDisplay,
//   skillLabels,
// } from "@/components/CharacterStatsDisplay";
// import { useCharacterStore } from "@/store/character";
// import { useHistoryStore } from "@/store/history";
// import LogoPortal from "@/components/LogoPortal";
// import DiceRollDisplay from '@/components/DiceRollDisplay';
// import { systemMessage } from '@/prompts/gameContinueMessage';

// export default function GameScreen() {
//   const character = useCharacterStore((state) => state.character);
//   console.log('character: ', character);
//   const setCharacter = useCharacterStore((state) => state.setCharacter);

//   const messages = useHistoryStore((state) => state.messages);
//   const pendingChecks = useHistoryStore((state) => state.pendingChecks);
//   const addMessage = useHistoryStore((state) => state.addMessage);
//   const setPendingChecks = useHistoryStore((state) => state.setPendingChecks);
//   const [roll, setRoll] = useState(-1)
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!character) return;

//     const cleanedInput = input.replace(/\[\[.*?\]\]/g, "").trim();
//     addMessage({ type: "user", text: cleanedInput });
//     setInput("");

//     console.log('pendingChecks: ', pendingChecks);
//     if (pendingChecks && pendingChecks.skill && pendingCheck.skill !== null) {
//       const skillValue = character.skills[pendingCheck.skill] || 0;
//       const roll = Math.floor(Math.random() * 20) + 1;
//       setRoll(roll)
//       const success = roll <= skillValue;
//       const resultText = `Бросок на ${skillLabels[`${pendingCheck.skill}`]}: ${roll} против ${skillValue} — ${success ? "успех" : "неудача"}.`;

//       addMessage({ type: "master", text: resultText });
//       setPendingChecks(null);
//       return;
//     }
//     if (!input.trim() || !character) return;

//     setLoading(true);
//     const seedNumber = Math.floor(Math.random() * 10000) + 1;

//     const seedResult = await fetch("/api/grokSeed", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ number: seedNumber }),
//     });

//     const seedText = await seedResult.text();

//     const lastMessages = messages.slice(-5).map((m) => ({
//       role: m.type === "user" ? "user" : "assistant",
//       content: m.text,
//     }));

//     console.log(systemMessage(character, seedText))
//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         messages: [
//           systemMessage(character, seedText),
//           ...lastMessages,
//           { role: "user", content: cleanedInput },
//         ],
//       }),
//     });

//     const { reply } = await res.json();
//     const rawText = reply.content;
//     console.log('rawText: ', rawText);

//     const match = rawText.match(/\[\[skill:(.+?)\]\]/i);
//     console.log('match: ', match);
//     // let processedText = rawText;
//     if (match) {
//       const skillName = match[1];
//       console.log('match: ', match);
//       // processedText = rawText.replace(match[0], "").trim();
//       setPendingCheck({ skill: skillName });
//     }

//     addMessage({ type: "master", text: rawText });
//     setLoading(false);
//   };

//   const useItem = (item: string) => {
//     if (!character) return;
//     const newInventory = character.inventory.filter((i) => i !== item);
//     setCharacter({ ...character, inventory: newInventory });
//     addMessage({ type: "user", text: `Вы используете предмет: ${item}` });
//   };

//   if (!character)
//     return <p className="text-center text-white">Персонаж не создан.</p>;
//   const proceedAfterRoll = () => {
//   setRoll(-1)
// }
//   return (
//     <div className="p-4 max-w-4xl mx-auto text-white space-y-4">
//       <CharacterStatsDisplay character={character} />

//       <div className="bg-gray-900 rounded p-4 space-y-2">
//         <h2 className="text-xl font-semibold mb-2">История</h2>
//         <div className="max-h-64 overflow-y-auto text-sm space-y-1">
//           {messages.map((entry, i) => (
//             <p
//               key={i}
//               className={
//                 entry.type === "user" ? "text-blue-300" : "text-yellow-300"
//               }
//             >
//               {entry.type === "user" ? `Вы: ${entry.text}` : entry.text}
//             </p>
//           ))}
//         </div>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           rows={3}
//           className="w-full mt-2 p-2 rounded bg-gray-700 text-white"
//           placeholder="Опиши своё действие..."
//         />

//         <button onClick={handleSubmit} className="mt-2 button">
//           {pendingCheck ? `Проверить навык: ${skillLabels[`${pendingCheck.skill}`]}` : "Отправить"}
//         </button>
//       </div>

//       <div className="bg-gray-800 rounded p-4">
//         <h2 className="text-xl font-semibold mb-2">Инвентарь</h2>
//         <div className="flex flex-wrap gap-2">
//           {character.inventory.map((item, i) => (
//             <button
//               key={i}
//               onClick={() => useItem(item)}
//               className="px-2 py-1 text-sm rounded border border-yellow-500 hover:bg-yellow-900"
//             >
//               {item}
//             </button>
//           ))}
//         </div>
//       </div>
//       <LogoPortal open={loading} />
//       {roll > 0 && <DiceRollDisplay target={6} rolledNumber={roll} proceed={proceedAfterRoll} />}
//     </div>
//   );
// }
import React, { useState } from "react";
import {
  CharacterStatsDisplay,
  skillLabels,
} from "@/components/CharacterStatsDisplay";
import { useCharacterStore } from "@/store/character";
import { Action, Check, useHistoryStore } from "@/store/history";
import LogoPortal from "@/components/LogoPortal";
import DiceRollDisplay from "@/components/DiceRollDisplay";
import { systemMessage } from "@/prompts/gameContinueMessage";

export default function GameScreen() {
  const character = useCharacterStore((state) => state.character);
  const setCharacter = useCharacterStore((state) => state.setCharacter);

  const messages = useHistoryStore((state) => state.messages);
  const pendingChecks = useHistoryStore((state) => state.pendingChecks) || [];
  const addMessage = useHistoryStore((state) => state.addMessage);
  const setPendingChecks = useHistoryStore((state) => state.setPendingChecks);
  const [roll, setRoll] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [currentCheck, setCurrentCheck] = useState<Check | null>(null);
  const gameLength = useHistoryStore.getState().messages.length;
  const handleSkillCheck = (skill: string, target: number) => {
    setCurrentCheck({
      skill,
      target,
    } as unknown as Check);
    if (!character) return;
    const skillValue = character.skills[skill] || 0;
    console.log("skillValue: ", skillValue);
    // const roll = Math.floor(Math.random() * 20) + 1;
    setRoll(skillValue);
    const success = skillValue >= target;
    const resultText = `Бросок на ${
      skillLabels[skill]
    }: ${skillValue} против ${target} — ${success ? "успех" : "неудача"}.`;

    addMessage({ type: "user", text: resultText });
    const remainingChecks = pendingChecks.filter(
      (check) => check.skill !== skill
    );
    setPendingChecks(remainingChecks.length > 0 ? remainingChecks : []);
    // handleSubmit()
  };

  const handleSubmit = async () => {
    if (!character) return;

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

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          systemMessage(character, seedText, seedNumber, gameLength),
          ...lastMessages,
          { role: "user", content: "продолжить" },
        ],
      }),
    });

    const { reply } = await res.json();
    const rawText = reply.content;

    const matches = [...rawText.matchAll(/\[\[skill:(.+?):(\d+)\]\]/gi)];
    const processedText = rawText
      .replace(/\[\[skill:(.+?):(\d+)\]\]/gi, "")
      .trim();

    const extractedChecks = matches.map((m) => ({
      skill: m[1],
      value: parseInt(m[2], 10),
    }));
    setPendingChecks(extractedChecks);
    const actionMatches = [
      ...rawText.matchAll(/\[\[suggest:\s*(.*?)\s*\]\]/gi),
    ];
    const parsedActions = actionMatches.map(
      (m) => ({ type: "suggest", value: m[1] } as Action)
    );
    useHistoryStore.getState().setActions(parsedActions);
    addMessage({ type: "master", text: processedText });
    setLoading(false);
  };
  const handleSubmitAction = async (action: Action) => {
    if (!character) return;
    addMessage({ type: "user", text: `${action.value}` });
    const clearActions = useHistoryStore.getState().clearActions;
    clearActions();
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

    //     const systemMessage = {
    //       role: "system",
    //       content: `Вот текущий персонаж пользователя: ${JSON.stringify(character)}.
    //       Пользователь будет использовать навыки и предметы для взаимодействий, а ты будешь отвечать в стиле мастера D&D. Кратко и атмосферно.
    //       Для создания уникального контента используй эти наработки. "${seedText}". используй подсказки для создания взаимодействий, если они есть. social: Обман, убеждение, запугивание (хараизма)

    // exploration: Поиск, история, восприятие (интеллект, мудрость)

    // physical: Прыжки, ловкость, кража (ловкость)

    // combat: Нападение, борьба, защита (сила, телосложение)

    // usage: Применение магии, предметов, лечения (мудрость, интеллект)

    // drama: Этический или тяжёлый выбор (без проверки)
    //       Не используй персонажей из наработки. создавай новых персонажей основываясь на персонаже пользователя.
    //       Если требуется проверка навыка, в конце текста укажи это в формате [[skill:название_навыка (используй только такие названия: ${Object.keys(character.skills).join(', ')}):цель (число от 1 до 18)]].
    //       если проверки навыка нет то Предложи **две опции** (в стиле: "Попробовать...", "Осторожно...") — без номеров и кавычек. опции должны выглядеть так: [[suggest:Попробовать...]] [[suggest:Осторожно...]]
    //       `,
    //     };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          systemMessage(character, seedText, seedNumber, gameLength),
          ...lastMessages,
          {
            role: "user",
            content: "Выполняю действие: " + JSON.stringify(action),
          },
        ],
      }),
    });

    const { reply } = await res.json();
    const rawText = reply.content;

    const matches = [...rawText.matchAll(/\[\[skill:(.+?):(\d+)\]\]/gi)];
    const processedText = rawText
      .replace(/\[\[skill:(.+?):(\d+)\]\]/gi, "")
      .trim();
    const actionMatches = [
      ...rawText.matchAll(/\[\[suggest:\s*(.*?)\s*\]\]/gi),
    ];
    const parsedActions = actionMatches.map(
      (m) => ({ type: "suggest", value: m[1] } as Action)
    );
    useHistoryStore.getState().setActions(parsedActions);
    const extractedChecks = matches.map((m) => ({
      skill: m[1],
      value: parseInt(m[2], 10),
    }));
    setPendingChecks(extractedChecks);

    addMessage({ type: "master", text: processedText });
    setLoading(false);
  };

  const useItem = (item: string) => {
    if (!character) return;
    const newInventory = character.inventory.filter((i) => i !== item);
    setCharacter({ ...character, inventory: newInventory });
    addMessage({ type: "user", text: `Использован предмет: ${item}` });
    handleSubmit();
  };

  if (!character)
    return <p className="text-center text-white">Персонаж не создан.</p>;

  const proceedAfterRoll = () => {
    setRoll(-1);
    handleSubmit();
  };

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

        {pendingChecks &&
          Array.isArray(pendingChecks) &&
          pendingChecks.map((check, i) => (
            <button
              key={i}
              onClick={() => handleSkillCheck(check.skill, check.value)}
              className="mt-2 button"
            >
              Проверить навык: {skillLabels[check.skill]} (цель: {check.value})
            </button>
          ))}
      </div>
      <div className="bg-gray-800 rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Действия</h2>
        <div className="flex flex-wrap gap-2">
          {useHistoryStore.getState().actions.map((action, i) => (
            <button
              key={i}
              // onClick={() => useItem(item)}
              onClick={() => handleSubmitAction(action)}
              className={
                " px-2 py-1 text-sm rounded border border-yellow-500 hover:bg-yellow-900 " +
                (action.type === "suggest"
                  ? "border-blue-300!"
                  : action.type === "use_item"
                  ? "border-red-300!"
                  : "border-green-300!")
              }
            >
              {action.value}
            </button>
          ))}
        </div>
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
      {roll > 0 && (
        <DiceRollDisplay
          target={currentCheck?.value}
          rolledNumber={roll}
          proceed={proceedAfterRoll}
        />
      )}
    </div>
  );
}
