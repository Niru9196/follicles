import React from 'react';

const items = [
  'Trichoscopic Diagnosis',
  'Postpartum Hair Loss',
  'Androgenetic Alopecia',
  'Alopecia Areata',
  'Scalp Microbiome Analysis',
  'Laser Hair Therapy',
  'Nutrient Infusion Protocols',
  'Virtual Consultations',
];

export default function MarqueeBar() {
  const repeated = [...items, ...items];
  return (
    <div className="bg-evergreen border-y border-white/10 py-4 overflow-hidden">
      <div className="marquee-track">
        {repeated?.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-8 text-birch/60 text-xs font-medium tracking-[0.15em] uppercase">
            <span className="w-1 h-1 rounded-full bg-gold inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}