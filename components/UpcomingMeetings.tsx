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
    <section
      id="horarios"
      className="scroll-mt-24 flex min-h-[55vh] items-center bg-stone-100 px-6 py-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Agenda MEP
            </p>

            <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-tight text-gray-950 md:text-5xl">
              Lo próximo en MEP.
            </h2>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-600">
              Encontrá nuestra próxima reunión y compartí este momento con
              nosotros.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Próxima reunión
            </p>

            <h3 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              {nextMeeting.name}
            </h3>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-lg font-semibold text-gray-950">
                {nextMeeting.day}
              </p>

              <span className="h-1 w-1 rounded-full bg-gray-300" />

              <p className="text-lg text-gray-500">
                {nextMeeting.time}
                {nextMeeting.endTime && ` a ${nextMeeting.endTime}`} hs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}