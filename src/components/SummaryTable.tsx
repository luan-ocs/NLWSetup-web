import { generateDayFromYearBeginning } from "../utils/generate-days-from-year";
import * as Popover from "@radix-ui/react-popover";
import { ProgressBar } from "./ProgressBar";
import clsx from "clsx";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AppCheckBox } from "./Checkbox";

const WeekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const summaryDates = generateDayFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7;
const amoutOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  completed: number;
  amount: number;
};

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    handleSummary();
  }, []);

  const handleSummary = async () => {
    const responseHttp = await api.get("summary");
    setSummary(responseHttp.data);
  };

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {WeekDays.map((day, index) => (
          <DayComp day={day} key={`${day}-${index}`} />
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((day, index) => {
          const apiDay = summary.find((dayApi) =>
            dayjs(dayApi.date).isSame(day)
          );

          return (
            <HabitDay
              key={day.toString()}
              amount={apiDay?.amount}
              completed={apiDay?.completed}
              date={day}
            />
          );
        })}

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
  amount?: number;
  completed?: number;
  date: Date;
}

interface Habit {
  title: string;
  id: string;
}

interface HabitResponse {
  possiblehabits: Habit[];
  completedHabits: string[];
}

const HabitDay = ({ amount = 0, completed = 0, date }: HabitDayProps) => {
  const weekDay = dayjs(date).format("dddd");
  const dayAndMonth = dayjs(date).format("DD/MM");

  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitsCompleted, setCompleted] = useState<string[]>([]);

  let percentage = amount ? (completed * 100) / amount : 0;

  const [completedPercentage, setPercentage] = useState(percentage);

  useEffect(() => {
    setPercentage((habitsCompleted.length * 100) / amount);
  }, [habitsCompleted]);

  const handlePopData = async () => {
    const resData = await api.get(`day?date=${date}`);

    const habitReponse = resData.data as HabitResponse;

    setHabits(habitReponse.possiblehabits);
    setCompleted(
      habitReponse.completedHabits ? habitReponse.completedHabits : []
    );
  };

  const today = dayjs(new Date());

  const colorPercentage = Number.isNaN(completedPercentage)
    ? percentage
    : completedPercentage;

  return (
    <Popover.Root
      onOpenChange={(open) => {
        if (open) {
          handlePopData();
        }
      }}
    >
      <Popover.Trigger
        className={clsx("w-10 h-10 border-2 rounded-lg", {
          "bg-violet-500 border-violet-400": colorPercentage >= 80,
          "bg-violet-600 border-violet-500":
            colorPercentage >= 60 && colorPercentage < 80,
          "bg-violet-700 border-violet-600":
            colorPercentage >= 40 && colorPercentage < 60,
          "bg-violet-800 border-violet-600":
            colorPercentage >= 20 && colorPercentage < 40,
          "bg-violet-900 border-radius-700":
            colorPercentage > 0 && colorPercentage < 20,
          "bg-zinc-900 border-zinc-800": colorPercentage === 0,
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col ">
          <span className="font-semibold text-zinc-400"> {weekDay}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>
          <ProgressBar progress={colorPercentage} />

          <div className="flex flex-col gap-3 mt-6">
            {habits.map((habit) => {
              return (
                <AppCheckBox
                  title={habit.title}
                  id={habit.id}
                  key={habit.id}
                  canChange={today.isSame(date, "day")}
                  checked={habitsCompleted.includes(habit.id)}
                  setCompleted={setCompleted}
                />
              );
            })}
          </div>
          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
