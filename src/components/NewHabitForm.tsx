import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function createNewHabit(event: FormEvent) {
    event.preventDefault();

    if (!title || weekDays.length == 0) {
      return;
    }

    console.log(title);
    console.log(weekDays);
  }

  function handleToggleWeekDay(index: number) {
    if (weekDays.includes(index)) {
      setWeekDays((prev) => prev.filter((val) => val !== index));
    } else {
      setWeekDays((prev) => [...prev, index]);
    }
  }

  return (
    <form className="w-full flex flex-col mt-6" onSubmit={createNewHabit}>
      <label htmlFor="title" className="font-semibold leading-tight ">
        Qual seu compromentimento?
      </label>

      <input
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        id="title"
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        placeholder="ex.: Fazer 10 flexões, dormir bem, etc..."
        autoFocus
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((day, index) => (
          <Checkbox.Root
            className="flex items-center gap-3 group"
            key={day}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight">
              {day}
            </span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 flex rounded-lg p-4 items-center gap-3 font-semibold bg-green-600 hover:bg-green-500"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  );
}
