import { useState, useMemo } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998');
  const [classCount, setClassCount] = useState(1);
  const [speed, setSpeed] = useState("oddiy");
  const [isYuridik, setIsYuridik] = useState(true);
  const [hasEkspert, setHasEkspert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const BHM = 375000;
  const PATENT_XIZMATI = 3000000;
  const TEZ_ARIZA_SHARTNOMA = 5040000;
  const BASE_STEP1_YURIDIK = 2250000;
  const BASE_STEP2_YURIDIK = 4350000;
  const BASE_STEP1_JISMONIY = 1500000;
  const BASE_STEP2_JISMONIY = 2550000;

  const validClassCount = Math.max(1, Math.min(45, parseInt(classCount) || 1));

  const step1 = isYuridik
    ? BASE_STEP1_YURIDIK + (validClassCount - 1) * 0.5 * BHM
    : BASE_STEP1_JISMONIY + (validClassCount - 1) * 0.5 * BHM;

  const step2Increment = isYuridik ? 1500000 : BHM;
  const step2 = isYuridik
    ? BASE_STEP2_YURIDIK + (validClassCount - 1) * step2Increment
    : BASE_STEP2_JISMONIY + (validClassCount - 1) * step2Increment;

  const ekspertTekshiruv = hasEkspert
    ? 500000 + (validClassCount - 1) * 350000
    : 0;

  const davlatBojJami = step1 + step2 + (speed === "tez" ? TEZ_ARIZA_SHARTNOMA : 0);
  const total = davlatBojJami + PATENT_XIZMATI + ekspertTekshiruv;

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Ismingizni kiriting");
    if (!/^\+998\d{9}$/.test(phone)) return alert("To‘g‘ri raqam kiriting");
    setLoading(true);

    const text = \`🧾 Yangi patent arizasi\n👤 Ism: \${name}\n📞 Tel: \${phone}\n👥 Turi: \${isYuridik ? 'Yuridik' : 'Jismoniy'}\n🔢 Klasslar: \${validClassCount}\n⚡ Rejim: \${speed === 'tez' ? 'Tezlashtirilgan (1,5 oy)' : 'Oddiy (7 oy)'}\n🧠 Ekspert: \${hasEkspert ? 'Bor' : 'Yo‘q'}\n💰 Umumiy to‘lov: \${total.toLocaleString()} so‘m\`;

    try {
      await fetch(`https://api.telegram.org/bot<token>/sendMessage`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: "<chat_id>", text })
      });
      setSuccess(true);
    } catch (e) {
      alert("Xatolik yuz berdi");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Jon.Branding – Patent kalkulyatori</h2>
      {!success ? (
        <>
          <input placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)} /><br />
          <input placeholder="+998901234567" value={phone} onChange={e => {
            const v = e.target.value;
            if (/^\+998\d{0,9}$/.test(v)) setPhone(v);
          }} /><br />
          <input type="number" value={classCount} min="1" max="45" onChange={e => setClassCount(e.target.value)} /><br />
          <button onClick={() => setIsYuridik(!isYuridik)}>Turi: {isYuridik ? "Yuridik" : "Jismoniy"}</button>
          <button onClick={() => setHasEkspert(!hasEkspert)}>Ekspert: {hasEkspert ? "Bor" : "Yo‘q"}</button>
          <button onClick={() => setSpeed(speed === "oddiy" ? "tez" : "oddiy")}>Rejim: {speed}</button>
          <h3>Umumiy to‘lov: {total.toLocaleString()} so‘m</h3>
          <button disabled={loading} onClick={handleSubmit}>
            {loading ? "Jo‘natilmoqda..." : "Patentlashga buyurtma berish"}
          </button>
        </>
      ) : (
        <>
          <h4>✅ Buyurtma qabul qilindi</h4>
          <button onClick={() => setSuccess(false)}>Yana birini yuborish</button>
        </>
      )}
    </div>
  );
}