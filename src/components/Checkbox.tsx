import * as CheckBox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { useState } from "react";
import { api } from "../lib/axios";

interface AppCheckbox {
  title: string;
  checked: boolean;
  canChange: boolean;
  id: string;
  setCompleted: React.Dispatch<React.SetStateAction<string[]>>;
}
export function AppCheckBox(props: AppCheckbox) {
  const [checked, setChecked] = useState(props.checked);

  return (
    <CheckBox.Root
      className="flex items-center gap-3 group"
      checked={checked}
      onClick={async () => {
        if (!props.canChange) {
          return;
        } else {
          await api.patch(`habits/${props.id}/toggle`);
          setChecked((prev) => !prev);

          if (!checked) {
            props.setCompleted((prev) => [...prev, props.id]);
          } else {
            props.setCompleted((prev) =>
              prev.filter((habit) => habit != props.id)
            );
          }
        }
      }}
    >
      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
        <CheckBox.Indicator>
          <Check size={20} className="text-white" />
        </CheckBox.Indicator>
      </div>
      <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
        {props.title}
      </span>
    </CheckBox.Root>
  );
}
