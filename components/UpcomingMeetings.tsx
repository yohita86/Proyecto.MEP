"use client";

import { meetings } from "@/data/meetings";

const days: Record<string, number> = {
  domingo: 0,
  lunes: 1,
  martes: 2,
  miércoles: 3,
  jueves: 4,
  viernes: 5,
  sábado: 6,
};

export default function UpcomingMeetings() {
  const now = new Date();

  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const upcomingMeetings = meetings
    .map((meeting) => {
      const meetingDay = days[meeting.day];

      const [hour, minute] = meeting.time.split(":").map(Number);
      const meetingTime = hour * 60 + minute;

      let daysUntil = meetingDay - currentDay;

      if (
        daysUntil < 0 ||
        (daysUntil === 0 && meetingTime <= currentTime)
      ) {
        daysUntil += 7;
      }

      return {
        ...meeting,
        daysUntil,
        meetingTime,
      };
    })
    .sort((a, b) => {
      if (a.daysUntil !== b.daysUntil) {
        return a.daysUntil - b.daysUntil;
      }

      return a.meetingTime - b.meetingTime;
    });

  const nextMeeting = upcomingMeetings[0];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            Agenda MEP
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Lo próximo en MEP
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Encontrá nuestra próxima reunión y compartí este momento con nosotros.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Próxima reunión
              </p>

              <h3 className="mt-3 text-3xl font-bold text-gray-950">
                {nextMeeting.name}
              </h3>

              <p className="mt-4 text-lg text-gray-700">
                {nextMeeting.day} · {nextMeeting.time}
                {nextMeeting.endTime && ` a ${nextMeeting.endTime}`} hs
              </p>
            </div>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border">
              <span className="text-2xl">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}