import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent, useVelocity, useAnimationFrame, useInView, animate } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const PATH = 'M0-100C6-40 40-6 100 0 40 6 6 40 0 100-6 40-40 6-100 0-40-6-6-40 0-100Z'
const Star = ({ fill = 'currentColor', ...p }) => <svg viewBox="-100 -100 200 200" {...p}><path d={PATH} fill={fill} /></svg>

const SERVICES = [
  ['Marketing', 'Posicionamento, conteúdo e redes sociais para sua marca ser ouvida.', ['Estratégia', 'Social media', 'Conteúdo', 'Vídeo']],
  ['Finanças', 'Organização financeira simples para o negócio crescer com segurança.', ['Fluxo de caixa', 'Planejamento', 'Indicadores']],
  ['Sites', 'Landing pages e sites rápidos, animados e feitos para converter.', ['UX/UI', 'Landing pages', 'Responsivo', 'SEO']],
  ['Sistemas', 'Dashboards, automações e sistemas sob medida para o seu dia a dia.', ['Dashboards', 'Automação', 'Integrações']],
]
const TEAM = [
  ['Sophia', 'Fundadora', 'Criadora e Desenvolvedora Full Stack'],
  ['Chrystian', 'CMO', 'Chief Marketing Officer'],
  ['Raquel', 'CFO', 'Chief Financial Officer'],
]
const WHY = [['Energia jovem', 'Ideias novas, sem medo de testar e inovar.'], ['Design limpo', 'Layouts modernos que guiam e geram confiança.'], ['Time único', 'Marketing, finanças, sites e sistemas juntos.'], ['Feito pra crescer', 'Começamos pequenos e crescemos com você.']]
const STEPS = [['Descoberta', 'Entendemos seu negócio e seu público.'], ['Estratégia', 'Traçamos o plano sob medida.'], ['Execução', 'Criamos, desenvolvemos e colocamos no ar.'], ['Evolução', 'Medimos, ajustamos e melhoramos.']]
const FAQ = [
  ['Quem está por trás da Louder?', 'A Louder foi fundada por Sophia (criadora e desenvolvedora full stack), Chrystian (CMO) e Raquel (CFO). Somos uma empresa nova, com muita energia e capricho em cada projeto.'],
  ['O que a Louder oferece?', 'Marketing, finanças, criação de sites e desenvolvimento de sistemas para pequenas empresas e novos negócios.'],
  ['Quanto tempo leva um projeto?', 'Uma landing page costuma levar de 2 a 3 semanas. Combinamos o prazo com você antes de começar.'],
  ['Como pedir um orçamento?', 'É só preencher o formulário de contato. Respondemos com uma proposta personalizada.'],
]

const Words = ({ text, hl = [], className = '', tag = 'h2' }) => {
  const T = motion[tag]
  return (
    <T className={`big ${className}`} initial="h" whileInView="s" viewport={{ once: true, margin: '-10%' }} transition={{ staggerChildren: 0.06 }}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i}><motion.span className={`wi ${hl.includes(w.replace(/[.,!?]/g, '')) ? 'acc' : ''}`} variants={{ h: { y: '110%' }, s: { y: 0 } }} transition={{ duration: 0.9, ease }}>{w}</motion.span>{' '}</span>
      ))}
    </T>
  )
}
const Reveal = ({ children, delay = 0, ...p }) => <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10%' }} transition={{ duration: 0.9, ease, delay }} {...p}>{children}</motion.div>
const spot = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px') }

function Preloader({ done }) {
  const [n, setN] = useState(0)
  useEffect(() => { const c = animate(0, 100, { duration: 1.8, ease: 'easeInOut', onUpdate: (v) => setN(Math.round(v)), onComplete: done }); return () => c.stop() }, [])
  return (
    <motion.div className="pre" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, ease: 'linear' }}><Star width="90" height="90" style={{ color: '#DFFF00' }} /></motion.div>
      <b>{n}%</b>
    </motion.div>
  )
}

function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 35 }), sy = useSpring(y, { stiffness: 500, damping: 35 })
  const [big, setBig] = useState(false)
  useEffect(() => { const m = (e) => { x.set(e.clientX - 7); y.set(e.clientY - 7); setBig(!!e.target.closest?.('a,button,.hov')) }; addEventListener('mousemove', m); return () => removeEventListener('mousemove', m) }, [])
  return <motion.div className="cur" style={{ x: sx, y: sy }} animate={{ scale: big ? 3.2 : 1 }} />
}

function Mag({ children, className = 'cta', ...p }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 15 }), sy = useSpring(y, { stiffness: 300, damping: 15 })
  return <motion.a className={className} style={{ x: sx, y: sy }} whileTap={{ scale: 0.94 }}
    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.5) }}
    onMouseLeave={() => { x.set(0); y.set(0) }} {...p}>{children}</motion.a>
}

function Particles() {
  const items = useMemo(() => Array.from({ length: 18 }, (_, i) => ({ s: 8 + Math.random() * 26, l: Math.random() * 100, t: Math.random() * 100, d: 6 + Math.random() * 8, dl: Math.random() * 5, ne: i % 3 === 0 })), [])
  return <div className="parts">{items.map((p, i) => <motion.div key={i} style={{ position: 'absolute', left: p.l + '%', top: p.t + '%', width: p.s, height: p.s, color: p.ne ? '#DFFF00' : '#7C3AED' }}
    animate={{ y: [0, -250], rotate: [0, 180], opacity: [0, 0.45, 0] }} transition={{ duration: p.d, delay: p.dl, repeat: Infinity, ease: 'linear' }}><Star width="100%" height="100%" /></motion.div>)}</div>
}

function Nav() {
  const { scrollY } = useScroll(); const [hide, setHide] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setHide(v > scrollY.getPrevious() && v > 200))
  return (
    <motion.nav animate={{ y: hide ? -110 : 0 }} transition={{ duration: 0.4, ease }}>
      <a href="#hero" className="logo">LOUDER<span style={{ color: '#DFFF00' }}>✦</span></a>
      <div className="links mono">{[['servicos', 'Serviços'], ['equipe', 'Equipe'], ['processo', 'Processo'], ['faq', 'FAQ'], ['contato', 'Contato']].map(([id, t]) => <a key={id} href={'#' + id}>/ {t}</a>)}</div>
      <Mag href="https://wa.me/5511989521208" target="_blank" rel="noreferrer">Vamos conversar</Mag>
    </motion.nav>
  )
}

function Hero({ ready }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const tx = useTransform(scrollYProgress, [0, 1], [0, -120])
  const intro = (d) => ({ initial: { opacity: 0, y: 40 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, delay: d, ease } })
  return (
    <section id="hero" ref={ref}>
      <motion.span className="mono" style={{ position: 'absolute', top: 110, color: '#8a8a94' }} {...intro(0.2)}>Marketing / Finanças / Sites / Sistemas</motion.span>
      <motion.h1 className="big title" style={{ x: tx }} aria-label="LOUDER">
        {'LOUDER'.split('').map((l, i) => <span className="lm" key={i}><motion.i initial={{ y: '110%' }} animate={ready ? { y: 0 } : {}} transition={{ delay: i * 0.07, duration: 0.9, ease }} whileHover={{ color: ['#fff', '#DFFF00', '#7C3AED', '#fff'], transition: { duration: 0.8 } }}>{l}</motion.i></span>)}<sup>®</sup>
      </motion.h1>
      <div className="hrow">
        <motion.p {...intro(0.7)}>Uma empresa jovem, com ideias que fazem sua marca ser <b style={{ color: '#DFFF00', fontWeight: 500 }}>ouvida</b>.</motion.p>
        <motion.div className="tags mono" {...intro(0.85)}>{['Marketing', 'Finanças', 'Sites', 'Sistemas'].map((t, i) => <span key={t}>(0{i + 1}) {t}</span>)}</motion.div>
      </div>
    </section>
  )
}

function Star3D({ ready }) {
  const { scrollYProgress: sp } = useScroll()
  const p = useSpring(sp, { stiffness: 60, damping: 20 })
  const x = useTransform(p, [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1], ['26vw', '26vw', '-30vw', '30vw', '-30vw', '28vw', '0vw'])
  const y = useTransform(p, [0, 0.5, 1], ['-8vh', '0vh', '-12vh'])
  const sc = useTransform(p, [0, 0.12, 0.3, 0.95, 1], [1, 0.9, 0.55, 0.55, 0.8])
  const spin = useTransform(p, [0, 1], [0, 1800]), idle = useMotionValue(0)
  useAnimationFrame((t) => idle.set(t * 0.02))
  const ry = useTransform([spin, idle], ([a, b]) => a + b)
  const tilt = useTransform(p, [0, 1], [0, 80])
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 }), my = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  useEffect(() => { const m = (e) => { mx.set((e.clientX / innerWidth - 0.5) * 24); my.set((e.clientY / innerHeight - 0.5) * -24) }; addEventListener('mousemove', m); return () => removeEventListener('mousemove', m) }, [])
  const rx = useTransform([my, tilt], ([a, b]) => a + Math.sin(b / 12) * 18)
  const layers = Array.from({ length: 17 }, (_, i) => { const t = (i / 16) * 2 - 1; return { z: t * 80, s: 1 - Math.abs(t) * 0.6, front: Math.abs(t) > 0.9 || i === 8, t } })
  return (
    <div className="s3d">
      <motion.div className="s3a" initial={{ scale: 0 }} animate={ready ? { scale: 1 } : {}} transition={{ duration: 1.6, ease }}>
        <motion.div className="s3b" style={{ x, y, scale: sc }}>
          <div className="s3glow" />
          <motion.div className="s3c" style={{ rotateY: ry, rotateX: rx, rotateZ: mx }}>
            {layers.map((l, i) => (
              <svg key={i} viewBox="-100 -100 200 200" style={{ transform: `translateZ(${l.z}px) scale(${l.s})` }}>
                <path d={PATH} fill={l.front ? 'url(#g)' : '#5b21b6'} fillOpacity={l.front ? 1 : 0.3} stroke="#DFFF00" strokeOpacity={l.front ? 0.7 : 0.35} strokeWidth=".7" />
              </svg>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Marquee() {
  const base = useMotionValue(0), { scrollY } = useScroll()
  const sv = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const f = useTransform(sv, (v) => 1 + Math.min(Math.abs(v) / 300, 5))
  useAnimationFrame((_, d) => base.set(base.get() - d * 0.01 * f.get()))
  const x = useTransform(base, (v) => `${(((v % 50) + 50) % 50) - 50}%`)
  const set = ['Marketing', 'Finanças', 'Sites', 'Sistemas', 'Louder']
  return <div className="marq"><motion.div className="track" style={{ x }}>{[0, 1, 2, 3].map((k) => set.map((w) => <span key={k + w}>{w}<Star /></span>))}</motion.div></div>
}

function Service({ n, t, d, chips }) {
  return (
    <motion.div className="svc spot hov" whileHover="h" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} onMouseMove={spot}>
      <span className="mono acc">// 0{n}</span>
      <motion.h3 className="big" variants={{ h: { x: 14, color: '#DFFF00' } }}>{t}</motion.h3>
      <div><p>{d}</p><div className="chips mono">{chips.map((c, i) => <motion.span key={c} variants={{ h: { y: [0, -8, 0], borderColor: '#DFFF00', transition: { delay: i * 0.05 } } }}>{c}</motion.span>)}</div></div>
    </motion.div>
  )
}

function Tilt({ t, d }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 }), ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  return (
    <motion.div className="tilt spot hov" variants={{ h: { opacity: 0, scale: 0.9 }, s: { opacity: 1, scale: 1 } }} style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      onMouseMove={(e) => { spot(e); const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * 14); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14) }}
      onMouseLeave={() => { rx.set(0); ry.set(0) }}>
      <span className="mono acc">✦</span><div><h4>{t}</h4><p>{d}</p></div>
    </motion.div>
  )
}

function Count({ to }) {
  const ref = useRef(null), inv = useInView(ref, { once: true }), [v, setV] = useState(0)
  useEffect(() => { if (inv) { const c = animate(0, to, { duration: 2, ease, onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop() } }, [inv])
  return <span ref={ref}>{v}</span>
}

function Steps() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  return (
    <div className="steps" ref={ref}>
      <div className="line"><motion.i className="fill" style={{ scaleX: scrollYProgress }} /></div>
      {STEPS.map(([t, d], i) => <Reveal key={t} delay={i * 0.12} className="step"><span className="mono">Fase 0{i + 1}</span><h4>{t}</h4><p>{d}</p></Reveal>)}
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(null)
  return (
    <div className="faq">{FAQ.map(([q, a], i) => (
      <Reveal key={q} className="q" delay={i * 0.08}>
        <button onClick={() => setOpen(open === i ? null : i)}><span>{q}</span><motion.span className="pl" animate={{ rotate: open === i ? 45 : 0 }}>+</motion.span></button>
        <AnimatePresence initial={false}>{open === i && <motion.div className="a" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease }}><p>{a}</p></motion.div>}</AnimatePresence>
      </Reveal>
    ))}</div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [sent, setSent] = useState(false)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  function enviar(e) {
    e.preventDefault()
    const f = new FormData(e.target)
    const texto = `Olá, Louder! Vim pelo site.\n\n*Nome:* ${f.get('nome')}\n*E-mail:* ${f.get('email')}\n*Projeto:* ${f.get('mensagem')}`
    window.open(`https://wa.me/5511989521208?text=${encodeURIComponent(texto)}`, '_blank')
    setSent(true)
  }

  const foot = useRef(null)
  const { scrollYProgress: fp } = useScroll({ target: foot, offset: ['start end', 'end end'] })
  const fy = useTransform(fp, [0, 1], [120, 0]), fo = useTransform(fp, [0, 1], [0.2, 1])
  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden' }, [ready])

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7C3AED" /><stop offset=".55" stopColor="#a78bfa" /><stop offset="1" stopColor="#DFFF00" /></linearGradient></defs></svg>
      <AnimatePresence>{!ready && <Preloader done={() => setReady(true)} />}</AnimatePresence>
      <motion.div className="bar" style={{ scaleX: bar }} /><Cursor /><Particles /><Star3D ready={ready} /><Nav />
      <Hero ready={ready} /><Marquee />

      <section className="sec about" id="sobre">
        <span className="eyebrow mono">// Sobre a Louder</span>
        <Words className="h2" text="Ideias que geram movimento. Grandes ideias precisam de uma voz alta." hl={['movimento']} />
        <Reveal><p>Somos uma empresa iniciante fundada por Sophia, Chrystian e Raquel. Unimos marketing, finanças, sites e sistemas com criatividade, energia e muita vontade de entregar resultado.</p></Reveal>
      </section>

      <section className="sec" id="servicos">
        <span className="eyebrow mono">// Serviços</span>
        <div>{SERVICES.map(([t, d, c], i) => <Service key={t} n={i + 1} t={t} d={d} chips={c} />)}</div>
      </section>

      <section className="sec" id="equipe">
        <span className="eyebrow mono">// Nossa equipe</span>
        <Words className="h2" text="Uma equipe. Uma voz alta." hl={['alta']} />
        <p className="mono" style={{ color: '#8a8a94', marginTop: 20 }}>Arraste os cards ✦</p>
        <div className="team">{TEAM.map(([n, role, desc], i) => (
          <motion.div key={n} className="card hov" drag dragSnapToOrigin dragElastic={0.4} whileDrag={{ scale: 1.06, rotate: 4, cursor: 'grabbing' }}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.15, ease }} whileHover={{ y: -8 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }} className="av"><Star width="100%" height="100%" /></motion.div>
            <div><span className="mono acc">{role}</span><h4>{n}</h4><p>{desc}</p></div>
          </motion.div>))}</div>
      </section>

      <section className="sec" id="porque">
        <span className="eyebrow mono">// Por que a Louder</span>
        <Words className="h2" text="Capricho, criatividade e compromisso em cada projeto." hl={['criatividade']} />
        <motion.div className="grid4" initial="h" whileInView="s" viewport={{ once: true, margin: '-10%' }} transition={{ staggerChildren: 0.12 }}>{WHY.map(([t, d]) => <Tilt key={t} t={t} d={d} />)}</motion.div>
        <div className="stats">
          <div className="stat"><b><Count to={3} /></b><span className="mono">Pessoas no time</span></div>
          <div className="stat"><b><Count to={4} /></b><span className="mono">Áreas de atuação</span></div>
        </div>
      </section>

      <section className="sec" id="processo">
        <span className="eyebrow mono">// Processo</span>
        <Words className="h2" text="Como transformamos sua ideia em resultado." hl={['resultado']} />
        <Steps />
      </section>

      <section className="sec" id="faq">
        <span className="eyebrow mono">// FAQ</span>
        <Words className="h2" text="Antes de começar, o que você precisa saber." />
        <Faq />
      </section>

      <section className="sec" id="contato">
        <span className="eyebrow mono">// Contato</span>
        <Words className="h2" text="Hora de fazer sua marca ser ouvida." hl={['ouvida']} />
        <AnimatePresence mode="wait">
          {sent ? <motion.p key="ok" className="mono acc" style={{ marginTop: 40 }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>✦ Abrimos o WhatsApp para você. É só apertar enviar!</motion.p> :
            <motion.form key="f" exit={{ opacity: 0, y: -20 }} onSubmit={enviar}>
              <input required name="nome" placeholder="Nome *" />
              <input required name="email" type="email" placeholder="E-mail *" />
              <textarea required name="mensagem" rows={3} placeholder="Conte sobre seu projeto *" />
              <motion.button className="cta" style={{ justifySelf: 'start' }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>Enviar pelo WhatsApp ↗</motion.button>
            </motion.form>}
        </AnimatePresence>
      </section>

      <footer ref={foot}>
        <div className="frow mono"><span>contato@louder.com.br</span><span>Instagram / LinkedIn</span><span>© 2026 Louder. Todos os direitos reservados.</span></div>
        <motion.h2 className="big fbig" style={{ y: fy, opacity: fo }}>LOUDER®</motion.h2>
      </footer>
    </>
  )
}