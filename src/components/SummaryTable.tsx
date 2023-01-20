import { generateDayFromYearBeginning } from "../utils/generate-days-from-year";
import * as Popover from "@radix-ui/react-popover";
import { ProgressBar } from "./ProgressBar";
import clsx from "clsx";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";

const WeekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const summaryDates = generateDayFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amoutOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {WeekDays.map((day, index) => (
          <DayComp day={day} key={day.toString()} />
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((day, index) => (
          <HabitDay
            key={day.toString()}
            amount={5}
            completed={Math.round(Math.random() * 5)}
          />
        ))}

        {amoutOfDaysToFill > 0 &&
          Array.from({ length: amoutOfDaysToFill }).map((day, index) => (
            <div
              key={index}
              className="w-10 h-10 bg-zinc-900 border-2 rounded-lg border-zinc-800 cursor-not-allowed opacity-40"
            ></div>
          ))}
      </div>
    </div>
  );
}

type DayProps = {
  day: string;
};
const DayComp = (props: DayProps) => {
  return (
    <div className="text-zinc-400 font-bold text-xl h-10 w-10 flex items-center justify-center">
      {props.day}
    </div>
  );
};

interface HabitDayProps {
  amount: number;
  completed: number;
}

const HabitDay = ({ amount, completed }: HabitDayProps) => {
  const completedPercentage = Math.round((completed / amount) * 100);

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx("w-10 h-10 border-2 rounded-lg", {
          "bg-violet-500 border-violet-400": completedPercentage >= 80,
          "bg-violet-600 border-violet-500":
            completedPercentage >= 60 && completedPercentage < 80,
          "bg-violet-700 border-violet-600":
            completedPercentage >= 40 && completedPercentage < 60,
          "bg-violet-800 border-violet-600":
            completedPercentage >= 20 && completedPercentage < 40,
          "bg-violet-900 border-radius-700":
            completedPercentage > 0 && completedPercentage < 20,
          "bg-zinc-900 border-zinc-800": completedPercentage === 0,
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col ">
          <span className="font-semibold text-zinc-400">Segunda-Feira</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            17/01
          </span>
          <ProgressBar progress={completedPercentage} />

          <div className="flex flex-col gap-3 mt-6">
            <Checkbox.Root className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>
              <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                Beber 2L de Agua por dia
              </span>
            </Checkbox.Root>
          </div>
          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
