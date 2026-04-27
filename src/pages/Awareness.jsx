import React from "react";
import preventionTipsImage from "../assets/cancer-prevention-tips.jpg";
import cancerTypesImage from "../assets/cancer-types.jpg";

const IconRibbon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z" />
    <path d="M9 12.5 6.5 21 12 17.8 17.5 21 15 12.5" />
  </svg>
);

const IconShield = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </svg>
);

const IconPulse = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 6-4-12-3 6H2" />
  </svg>
);

const IconLeaf = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 20c6 0 12-5 12-14-9 0-14 6-14 12 0 1 .2 1.4.4 2" />
    <path d="M6 20c1.6-3.5 4.7-6.6 9-9" />
  </svg>
);

const IconDoctor = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
    <path d="M18 10v4" />
    <path d="M16 12h4" />
  </svg>
);

const IconLocation = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Awareness = () => {
  const keyStats = [
    {
      label: "New cancer cases",
      value: "37,753",
      note: "reported in Sri Lanka in 2021",
    },
    {
      label: "Early action",
      value: "Best chance",
      note: "Many cancers respond better when found at an early stage.",
    },
    {
      label: "Prevention focus",
      value: "Healthy habits",
      note: "Tobacco avoidance, screening, diet, and activity lower risk.",
    },
  ];

  const priorityCancers = [
    {
      title: "Breast Cancer",
      subtitle: "A leading cancer among women in Sri Lanka",
      stat: "5,485 cases",
      note:
        "A new lump, nipple change, or breast skin change should be checked early. Prompt review can lead to earlier diagnosis and better treatment options.",
      icon: <IconRibbon />,
    },
    {
      title: "Oral Cancer",
      subtitle: "A major concern among Sri Lankan men",
      stat: "2,687 cases",
      note:
        "Smoking, chewing tobacco, betel chewing, and alcohol can raise risk. Mouth ulcers, red or white patches, and trouble swallowing should not be ignored.",
      icon: <IconShield />,
    },
    {
      title: "Colorectal Cancer",
      subtitle: "Increasingly seen in both men and women",
      stat: "3rd leading",
      note:
        "Long-term bowel changes, bleeding, or ongoing abdominal discomfort deserve medical advice, especially if symptoms are new or persistent.",
      icon: <IconPulse />,
    },
  ];

  const warningSigns = [
    "A lump in the breast, neck, mouth, or any other part of the body",
    "A mouth ulcer or red or white patch that does not heal",
    "Unusual bleeding, discharge, or blood in stool",
    "A lasting change in bowel habits or unexplained constipation",
    "Persistent cough, breathing difficulty, or coughing blood",
    "Sudden weight loss, unusual tiredness, or ongoing weakness",
    "Difficulty swallowing or a voice change that lasts for weeks",
    "Skin changes, changing moles, or wounds that do not heal",
  ];

  const preventionHabits = [
    "Avoid tobacco in every form and reduce alcohol use.",
    "Choose fruits, vegetables, whole grains, and balanced meals.",
    "Stay active with regular weekly exercise.",
    "Protect your skin from strong sun with shade and sunscreen.",
    "Keep up with recommended screenings and routine checkups.",
    "Seek medical advice early when something feels unusual.",
  ];

  const screeningPath = [
    {
      title: "Notice a symptom",
      description:
        "Pay attention to changes that stay, worsen, or keep coming back.",
      icon: <IconPulse />,
    },
    {
      title: "Visit a clinic or doctor",
      description:
        "A health professional can assess the symptom and guide the next step.",
      icon: <IconDoctor />,
    },
    {
      title: "Get the right test",
      description:
        "This may include a clinical exam, mammogram, Pap smear, imaging, or biopsy.",
      icon: <IconShield />,
    },
    {
      title: "Follow through early",
      description:
        "Do not delay follow-up appointments, referrals, or treatment advice.",
      icon: <IconLeaf />,
    },
  ];

  const places = [
    "Cancer Early Detection Centre (CEDC), Narahenpita",
    "Apeksha Hospital / National Cancer Institute, Maharagama",
    "Well Woman Clinics through local MOH areas",
    "Government breast clinics and mammography centres",
    "Provincial and district cancer treatment hospitals across Sri Lanka",
  ];

  const fastFacts = [
    "Cancer risk can rise with age, but warning signs at any age still matter.",
    "A painless symptom can still be serious and deserves attention.",
    "Oral cancer risk is higher with smoking, alcohol, and betel chewing habits.",
    "Breast lumps, nipple changes, and unusual bleeding should be checked quickly.",
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-800">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(229,152,155,0.28),_transparent_28%),linear-gradient(135deg,#5E548E_0%,#4A4272_100%)] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-8 top-12 h-28 w-28 rounded-full border border-white/40" />
          <div className="absolute right-10 top-20 h-44 w-44 rounded-full border border-white/20" />
          <div className="absolute bottom-10 left-1/3 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur">
              Sri Lanka Cancer Awareness
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
              Learn the warning signs, lower the risk, and act before cancer
              gets the chance to grow.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-rose-50 md:text-lg">
              Awareness saves time, choices, and lives. This page brings
              together prevention guidance, cancer types, warning signs, and
              screening pathways to help families in Sri Lanka respond earlier
              and more confidently.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {keyStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-white/20 bg-white/12 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm text-[#FDF5F7]">{stat.label}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#FDF5F7]/90">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] bg-white/10 blur-xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <img
                src={preventionTipsImage}
                alt="Illustrated cancer prevention tips"
                className="h-full w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-8 max-w-7xl px-6 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#F0E5E8] bg-white p-7 shadow-[0_24px_70px_-35px_rgba(94,84,142,0.18)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF5F7] text-[#5E548E]">
                <IconLeaf />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E5989B]">
                  Prevention First
                </p>
                <h2 className="text-2xl font-bold text-[#5E548E]">
                  Everyday choices can reduce risk
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {preventionHabits.map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-2xl bg-[#FDF5F7] p-4"
                >
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#E5989B] shadow-sm">
                    <IconCheck />
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[#F0E5E8] bg-[#4A4272] p-4 shadow-[0_24px_70px_-35px_rgba(94,84,142,0.35)]">
            <img
              src={cancerTypesImage}
              alt="Illustrated chart of different cancer types"
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5989B]">
            Priority Awareness
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#5E548E] md:text-4xl">
            Common cancers people in Sri Lanka should know about
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The goal is not fear. The goal is recognition. Knowing what is more
            common helps people notice symptoms faster and seek the right care
            sooner.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {priorityCancers.map((item) => (
            <div
              key={item.title}
              className="group rounded-[2rem] border border-[#F0E5E8] bg-white p-7 shadow-[0_18px_45px_-30px_rgba(94,84,142,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-28px_rgba(94,84,142,0.28)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF5F7] text-[#5E548E]">
                {item.icon}
              </div>
              <p className="mt-5 text-sm font-semibold text-[#E5989B]">
                {item.subtitle}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-[#5E548E]">
                {item.title}
              </h3>
              <div className="mt-4 inline-flex rounded-full bg-[#FDF5F7] px-4 py-2 text-sm font-semibold text-[#B5838D]">
                {item.stat}
              </div>
              <p className="mt-4 leading-7 text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(160deg,#FFF9F5_0%,#FDF5F7_100%)] p-8 shadow-[0_18px_45px_-34px_rgba(181,131,141,0.2)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B5838D]">
              Act Early
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#5E548E]">
              When should you get checked?
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-700">
              Get medical advice if a symptom does not go away, keeps returning,
              or clearly feels unusual for your body. Early review does not mean
              panic. It means you are giving yourself more options.
            </p>

            <div className="mt-8 space-y-4">
              {fastFacts.map((fact) => (
                <div
                  key={fact}
                  className="rounded-2xl border border-white/70 bg-white/80 p-4 text-sm leading-6 text-slate-700"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#5E548E]">
              Common warning signs
            </h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {warningSigns.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#F0E5E8] bg-[#FDF5F7] p-4"
                >
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#E5989B]">
                    <IconCheck />
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5989B]">
            Screening Journey
          </p>
          <h2 className="mt-3 text-3xl font-black text-[#5E548E] md:text-4xl">
            How doctors usually move from concern to diagnosis
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600">
            The exact path depends on symptoms, age, and risk factors. What
            matters most is starting that path early.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {screeningPath.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-[2rem] border border-[#F0E5E8] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(94,84,142,0.18)]"
            >
              <span className="absolute right-5 top-5 text-sm font-bold text-[#B5838D]">
                0{index + 1}
              </span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF5F7] text-[#5E548E]">
                {step.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#5E548E]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FFF9F5] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#B5838D]">
              Sri Lanka Support
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#5E548E] md:text-4xl">
              Where can you go for screening and advice?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              You can begin with a nearby government clinic, a Well Woman
              Clinic, a cancer early detection centre, or a major hospital.
              Starting the conversation early is often the hardest step and the
              most important one.
            </p>

            <div className="mt-8 space-y-4">
              {places.map((place) => (
                <div
                  key={place}
                  className="flex items-center gap-3 rounded-2xl border border-[#F0E5E8] bg-white p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDF5F7] text-[#5E548E]">
                    <IconLocation />
                  </span>
                  <span className="font-medium text-slate-700">{place}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(145deg,#5E548E_0%,#4A4272_100%)] p-8 text-white shadow-[0_24px_60px_-30px_rgba(94,84,142,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FDF5F7]">
              Remember
            </p>
            <h3 className="mt-3 text-3xl font-black leading-tight">
              Awareness becomes powerful when it leads to action.
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-rose-50">
              <p>
                Screening is not only for people who already feel very ill.
                Sometimes the most important cancers are found before symptoms
                become severe.
              </p>
              <p>
                Families can help by encouraging loved ones to speak up about
                new symptoms and keeping clinic appointments instead of waiting
                for problems to disappear on their own.
              </p>
              <p>
                A short visit today can prevent a much harder journey later.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-[#F0E5E8] bg-white shadow-[0_18px_45px_-35px_rgba(94,84,142,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[linear-gradient(160deg,#FDF5F7_0%,#FFF9F5_100%)] p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#E5989B]">
                Final Message
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#5E548E] md:text-4xl">
                Do not wait for symptoms to become serious
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-700">
                Cancer awareness is not just information on a page. It is a
                reminder to protect your health, notice changes early, and seek
                care without delay. One conversation, one checkup, or one
                screening can change the outcome.
              </p>
            </div>

            <div className="grid gap-4 p-8 md:grid-cols-2 md:p-10">
              <div className="rounded-2xl bg-[#FDF5F7] p-5">
                <h3 className="text-lg font-bold text-[#5E548E]">
                  Protect yourself
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Reduce tobacco and alcohol, move your body, and make regular
                  screening part of your health routine.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-5">
                <h3 className="text-lg font-bold text-[#B5838D]">
                  Protect your family
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Share warning signs with loved ones and encourage them to get
                  checked if symptoms do not settle.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FDF5F7] p-5">
                <h3 className="text-lg font-bold text-[#E5989B]">
                  Protect your future
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Earlier diagnosis often means more treatment choices and a
                  better chance of recovery.
                </p>
              </div>
              <div className="rounded-2xl bg-[#FFF9F5] p-5">
                <h3 className="text-lg font-bold text-[#5E548E]">
                  Start now
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If something feels unusual, book that clinic visit now rather
                  than later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awareness;
