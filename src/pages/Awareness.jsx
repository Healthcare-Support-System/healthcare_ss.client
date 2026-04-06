import React from "react";

const Awareness = () => {
  const commonCancers = [
    {
      title: "Breast Cancer",
      subtitle: "Most common among women in Sri Lanka",
      stat: "5,485 cases",
      note: "Breast cancer is one of the leading cancers in Sri Lanka and early detection greatly improves treatment outcomes.",
      icon: "🎗️",
    },
    {
      title: "Oral Cancer",
      subtitle: "Very common among men in Sri Lanka",
      stat: "2,687 cases",
      note: "Lip, tongue, and mouth cancers are among the leading cancers in Sri Lankan men, especially with tobacco, betel, and alcohol risk factors.",
      icon: "👄",
    },
    {
      title: "Colorectal Cancer",
      subtitle: "Common in both men and women",
      stat: "3rd leading in Sri Lanka",
      note: "Colon and rectum cancers are a growing concern in Sri Lanka and should not be ignored if symptoms appear.",
      icon: "🩺",
    },
  ];

  const warningSigns = [
    "A lump in the breast, neck, mouth, or any other part of the body",
    "A mouth ulcer or white/red patch that does not heal",
    "Unusual bleeding or discharge",
    "A change in bowel habits, blood in stool, or long-term constipation",
    "Persistent cough, breathing trouble, or coughing blood",
    "Sudden unexplained weight loss or long-lasting tiredness",
    "Difficulty swallowing or a long-lasting change in voice",
  ];

  const checkMethods = [
    {
      title: "Breast Check",
      description:
        "Clinical breast examination, breast clinic review, and mammography when needed.",
      icon: "🩷",
    },
    {
      title: "Cervical Check",
      description:
        "Pap smear or HPV-related screening based on Sri Lankan national guidance.",
      icon: "🧪",
    },
    {
      title: "Oral Check",
      description:
        "A doctor or trained health worker examines the mouth, tongue, cheeks, and throat for abnormal changes.",
      icon: "👨‍⚕️",
    },
    {
      title: "Specialist Referral",
      description:
        "If signs are suspicious, patients may be referred for imaging, biopsy, or specialist clinic review.",
      icon: "🏥",
    },
  ];

  const places = [
    "Cancer Early Detection Centre (CEDC), Narahenpita",
    "Apeksha Hospital / National Cancer Institute, Maharagama",
    "Well Woman Clinics (through local MOH areas)",
    "Government breast clinics and mammography centres",
    "Provincial and district cancer treatment hospitals across Sri Lanka",
  ];

  return (
    <div className="min-h-screen bg-[#f7f5fc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#5E548E] via-[#6D5FA3] to-[#8A79B8] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-white"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-medium mb-5">
              Sri Lanka Cancer Awareness
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Know the signs. Get checked early. Protect your life.
            </h1>
            <p className="text-purple-100 text-base md:text-lg leading-relaxed max-w-2xl">
              Cancer awareness is not only about learning the disease. It is
              about understanding common cancers in Sri Lanka, noticing warning
              signs early, and knowing where to go for screening and medical
              advice.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <p className="text-sm text-gray-500 mb-2">Sri Lanka Cancer Data</p>
            <h3 className="text-3xl font-bold text-[#5E548E]">37,753</h3>
            <p className="text-gray-600 mt-2">
              new cancer cases reported in Sri Lanka in 2021.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <p className="text-sm text-gray-500 mb-2">Important Message</p>
            <h3 className="text-2xl font-bold text-[#5E548E]">Early detection matters</h3>
            <p className="text-gray-600 mt-2">
              Many cancers can be treated better when found early.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <p className="text-sm text-gray-500 mb-2">Where to Start</p>
            <h3 className="text-2xl font-bold text-[#5E548E]">Check symptoms early</h3>
            <p className="text-gray-600 mt-2">
              Do not wait too long if something unusual continues.
            </p>
          </div>
        </div>
      </section>

      {/* Common cancers */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5E548E] mb-3">
            Common cancers in Sri Lanka
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            These are some of the cancers people should especially be aware of
            in the Sri Lankan context.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {commonCancers.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-md border border-purple-100 hover:shadow-xl transition duration-300"
            >
              <div className="text-5xl mb-5">{item.icon}</div>
              <p className="text-sm font-medium text-purple-500 mb-2">
                {item.subtitle}
              </p>
              <h3 className="text-2xl font-bold text-[#5E548E] mb-2">
                {item.title}
              </h3>
              <div className="inline-block bg-purple-100 text-[#5E548E] font-semibold px-4 py-2 rounded-full text-sm mb-4">
                {item.stat}
              </div>
              <p className="text-gray-600 leading-relaxed">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warning signs */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
          <div className="bg-gradient-to-br from-[#ede7f6] to-[#f8f4ff] rounded-3xl p-8 border border-purple-100 shadow-sm">
            <h2 className="text-3xl font-bold text-[#5E548E] mb-5">
              When should you check for cancer?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              You should get checked as soon as possible if you notice a warning
              sign that does not go away, keeps getting worse, or feels unusual
              for your body.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Even if it is not cancer, it is always safer to get medical advice
              early rather than waiting.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-[#5E548E] mb-5">
              Common warning signs
            </h3>
            <div className="space-y-4">
              {warningSigns.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-[#f7f5fc] border border-purple-100 rounded-2xl p-4"
                >
                  <span className="text-[#5E548E] text-xl font-bold mt-0.5">
                    ✓
                  </span>
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Check methods */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5E548E] mb-3">
            How doctors check for cancer
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            The check depends on symptoms, age, and the type of cancer being
            suspected.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {checkMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md border border-purple-100 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{method.icon}</div>
              <h3 className="text-xl font-bold text-[#5E548E] mb-3">
                {method.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sri Lanka places */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#5E548E] mb-5">
              Where can you check in Sri Lanka?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sri Lanka has government cancer early-detection and treatment
              services. You can start at a nearby government clinic, Well Woman
              Clinic, cancer clinic, or a major hospital.
            </p>

            <div className="space-y-4">
              {places.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-purple-100 bg-[#f7f5fc]"
                >
                  <span className="text-xl">📍</span>
                  <span className="text-gray-700 font-medium">{place}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#5E548E] to-[#7B6FA8] text-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">
              Useful awareness points
            </h3>
            <ul className="space-y-4 text-purple-100 leading-relaxed">
              <li>
                • Cancer can happen at many ages, but risk generally increases
                as people get older.
              </li>
              <li>
                • Do not ignore a symptom just because it is painless.
              </li>
              <li>
                • People with smoking, alcohol, or betel chewing habits should
                be especially careful about oral cancer.
              </li>
              <li>
                • Women should not ignore breast lumps, nipple changes, or
                unusual bleeding.
              </li>
              <li>
                • Screening and early medical advice can save lives.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA style info section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#f1edf9] border border-purple-100 rounded-3xl p-8 md:p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-[#5E548E] mb-4">
            Do not wait for symptoms to become serious
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Awareness is about taking action at the right time. If you notice
            unusual body changes, visit a doctor or screening centre early.
            Quick attention can make a big difference.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Awareness;