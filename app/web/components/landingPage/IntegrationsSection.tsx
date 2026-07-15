"use client";

import { motion } from "motion/react";

const integrations = [
  {
    name: "Slack",
    icon: (
      <svg viewBox="0 0 2447.6 2452.5" className="h-14 w-14 object-contain">
        <g clipRule="evenodd" fillRule="evenodd">
          <path
            d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z"
            fill="#FFFFFF"
            className="transition-colors duration-300 group-hover:fill-[#36c5f0]"
          />
          <path
            d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z"
            fill="#FFFFFF"
            className="transition-colors duration-300 group-hover:fill-[#2eb67d]"
          />
          <path
            d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z"
            fill="#FFFFFF"
            className="transition-colors duration-300 group-hover:fill-[#ecb22e]"
          />
          <path
            d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"
            fill="#FFFFFF"
            className="transition-colors duration-300 group-hover:fill-[#e01e5a]"
          />
        </g>
      </svg>
    ),
  },
  {
    name: "OpenAI",
    icon: (
      <svg viewBox="0 0 24 24" className="h-14 w-14" fillRule="evenodd" clipRule="evenodd">
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          clipRule="evenodd"
          className="transition-colors duration-300 group-hover:fill-[#10a37f]"
          d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"
        />
      </svg>
    ),
  },
  {
    name: "Groq",
    icon: (
      <svg viewBox="0 0 512 512" className="h-14 w-14" fillRule="evenodd" clipRule="evenodd">
        <path
          fill="#FFFFFF"
          fillRule="evenodd"
          clipRule="evenodd"
          className="transition-colors duration-300 group-hover:fill-[#f43e01]"
          d="M256.867 16.007c-92.47-.84-167.997 71.999-168.861 162.741-.84 90.767 73.319 164.926 165.789 165.766h58.08V282.93h-55.008c-57.767.672-105.118-44.784-105.79-101.519-.696-56.687 45.623-103.15 103.39-103.822h2.4c57.767 0 104.59 45.96 104.758 102.67v151.318c0 56.207-46.655 101.998-103.75 102.694a104.988 104.988 0 01-72.79-30.047l-44.424 43.63c30.983 30.432 72.599 47.712 116.038 48.144h2.208c91.27-1.344 164.59-73.99 165.093-163.581V176.42c-2.232-89.302-76.39-160.413-167.133-160.413z"
        />
      </svg>
    ),
  },
  {
    name: "Gmail",
    icon: (
      <svg viewBox="0 0 32 32" className="h-14 w-14 object-contain">
        <path
          d="M16.58,19.1068l-12.69-8.0757A3,3,0,0,1,7.1109,5.97l9.31,5.9243L24.78,6.0428A3,3,0,0,1,28.22,10.9579Z"
          fill="#FFFFFF"
          className="transition-colors duration-300 group-hover:fill-[#ea4435]"
        />
        <path
          d="M25.5,5.5h4a0,0,0,0,1,0,0v18a3,3,0,0,1-3,3h0a3,3,0,0,1-3-3V7.5a2,2,0,0,1,2-2Z"
          fill="#FFFFFF"
          className="transition-colors duration-300 group-hover:fill-[#00ac47]"
          transform="translate(53.0001 32.0007) rotate(180)"
        />
        <path
          d="M29.4562,8.0656c-.0088-.06-.0081-.1213-.0206-.1812-.0192-.0918-.0549-.1766-.0823-.2652a2.9312,2.9312,0,0,0-.0958-.2993c-.02-.0475-.0508-.0892-.0735-.1354A2.9838,2.9838,0,0,0,28.9686,6.8c-.04-.0581-.09-.1076-.1342-.1626a3.0282,3.0282,0,0,0-.2455-.2849c-.0665-.0647-.1423-.1188-.2146-.1771a3.02,3.02,0,0,0-.24-.1857c-.0793-.0518-.1661-.0917-.25-.1359-.0884-.0461-.175-.0963-.267-.1331-.0889-.0358-.1837-.0586-.2766-.0859s-.1853-.06-.2807-.0777a3.0543,3.0543,0,0,0-.357-.036c-.0759-.0053-.1511-.0186-.2273-.018a2.9778,2.9778,0,0,0-.4219.0425c-.0563.0084-.113.0077-.1689.0193a33.211,33.211,0,0,0-.5645.178c-.0515.022-.0966.0547-.1465.0795A2.901,2.901,0,0,0,23.5,8.5v5.762l4.72-3.3043a2.8878,2.8878,0,0,0,1.2359-2.8923Z"
          fill="#FFFFFF"
          className="transition-colors duration-300 group-hover:fill-[#ffba00]"
        />
        <path
          d="M5.5,5.5h0a3,3,0,0,1,3,3v18a0,0,0,0,1,0,0h-4a2,2,0,0,1-2-2V8.5a3,3,0,0,1,3-3Z"
          fill="#FFFFFF"
          className="transition-colors duration-300 group-hover:fill-[#4285f4]"
        />
      </svg>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section id="integrations" className="relative pt-36 pb-12 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2>
            <div className="m-0 text-[clamp(22px,3.2vw,38px)] font-light text-white/55 tracking-[-0.01em] leading-[1.3] font-display">
              Plug AI into your own data &
            </div>
            <div className="mt-0.5 text-[clamp(28px,4vw,52px)] font-bold text-[#FAFAFA] tracking-[-0.02em] leading-[1.2] font-display">
              connect the tools you already use
            </div>
          </h2>

          <p className="mt-3.5 text-[18px] font-medium text-white/35 max-w-140 mx-auto leading-[1.6] tracking-[0.01em] font-body">
            Use pre-built nodes for common apps. Custom API connections for everything else.
          </p>
        </motion.div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="h-56 rounded-2xl border border-white/[0.06] flex flex-col items-center justify-center bg-white/[0.02] transition-colors duration-300 hover:border-blue-500/20"
            >
              <div className="mb-6 flex items-center justify-center h-16 w-16">{item.icon}</div>
              <h3 className="text-[#FAFAFA] text-[18px] font-bold font-body">{item.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
