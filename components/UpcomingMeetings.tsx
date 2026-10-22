import { createClient } from "@/lib/supabase/server";

const days: Record<number, string> = {
  0: "domingo",
  1: "lunes",
  2: "martes",
  3: "miércoles",
  4: "jueves",
  5: "viernes",
  6: "sábado",
};

export default async function UpcomingMeetings() {
  const supabase = await createClient();

  const { data: meetings, error } = await supabase
    .from("upcoming_meetings")
    .select("id, name, day_of_week, start_time, end_time")
    .eq("is_active", true)
    .order("sort_order")
    .order("day_of_week")
    .order("start_time");

  if (error) {
    console.error("Error al cargar las próximas reuniones:", error);
    return null;
  }

  if (!meetings || meetings.length === 0) {
    return null;
  }

  // Obtener el día y la hora actuales de Argentina.
  const now = new Date();

  const argentinaDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const weekdayNames: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const currentWeekday =
    argentinaDate.find((part) => part.type === "weekday")?.value ??
    "Sunday";

  const currentDay = weekdayNames[currentWeekday];

  const currentHour = Number(
    argentinaDate.find((part) => part.type === "hour")?.value ?? 0
  );

  const currentMinute = Number(
    argentinaDate.find((part) => part.type === "minute")?.value ?? 0
  );

  const currentTime = currentHour * 60 + currentMinute;

  const upcomingMeetings = meetings
    .map((meeting) => {
      const meetingDay = meeting.day_of_week;

      const [hour, minute] = meeting.start_time
        .split(":")
        .map(Number);

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
        day: days[meetingDay],
        time: meeting.start_time.slice(0, 5),
        endTime: meeting.end_time
          ? meeting.end_time.slice(0, 5)
          : null,
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
      className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] bg-[#101010] px-6 py-24 text-white sm:py-28"
    >
      {/* Iluminación ambiental discreta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(30,90,105,0.10), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16">
          {/* Presentación */}
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              <span className="h-px w-8 bg-amber-400/70" />
              Agenda MEP
            </p>

            <h2 className="mt-6 max-w-md text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Lo próximo{" "}
              <span className="text-white/55">en MEP.</span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-white/60 sm:text-lg">
              Encontrá nuestra próxima reunión y compartí este momento con
              nosotros.
            </p>

            <div className="mt-8 h-px w-20 bg-gradient-to-r from-amber-400/70 to-transparent" />
          </div>

          {/* Tarjeta de próxima reunión */}
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#171717] p-7 transition duration-300 hover:border-amber-400/25 sm:p-10 md:p-11">
            {/* Acento superior */}
            <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent sm:left-10 sm:right-10" />

            {/* Brillo de fondo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-60 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.09), transparent 70%)",
              }}
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/90">
                Próxima reunión
              </p>

              <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {nextMeeting.name}
              </h3>

              <div className="mt-8 border-t border-white/[0.09] pt-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/[0.08] text-amber-400">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="5" width="18" height="16" rx="2" />
                        <path d="M16 3v4M8 3v4M3 11h18" />
                      </svg>
                    </span>

                    <p className="text-lg font-semibold capitalize text-white">
                      {nextMeeting.day}
                    </p>
                  </div>

                  <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-white/70">
                      <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>

                    <p className="text-base text-white/65 sm:text-lg">
                      {nextMeeting.time}
                      {nextMeeting.endTime && ` a ${nextMeeting.endTime}`} hs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
