"use client";
/* eslint-disable react-hooks/immutability -- uniforms and the scroll/pointer bridge are mutated every frame on purpose, outside React renders. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { CITIES, QUESTIONS, latLonToVec, loadLandMask, sampleLand, type LandMask } from "./data";

/** Mutable state shared with the DOM layer: written by scroll/pointer handlers, read every frame. */
export type Bridge = {
  progress: number;
  pointer: { x: number; y: number };
  labels: (HTMLSpanElement | null)[];
  /** Prompt box position in NDC (-1..1); arcs end here. */
  target: { x: number; y: number };
};

type Tier = { land: number; arcs: number; ambient: number; seg: number; maxDpr: number; bloom: number };
const DESKTOP: Tier = { land: 64000, arcs: 280, ambient: 3600, seg: 48, maxDpr: 2, bloom: 1.15 };
const MOBILE: Tier = { land: 42000, arcs: 96, ambient: 1400, seg: 36, maxDpr: 1.5, bloom: 0.9 };

const ACCENT = new THREE.Color("#ff4f1a");
const NEUTRAL = new THREE.Color("#ece9df");
const BG = "#0c0c0b";
/* ?capture=1 steps the scene by a fixed 1/30 s per advance() so recordings are smooth on slow renderers. */
const CAPTURE = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture");

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ---------- shaders ---------- */

const landVert = /* glsl */ `
  attribute float aRand;
  uniform float uDpr;
  uniform float uSize;
  varying float vFacing;
  varying float vRand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize((modelViewMatrix * vec4(position, 0.0)).xyz);
    vFacing = clamp(n.z, 0.0, 1.0);
    vRand = aRand;
    gl_PointSize = uSize * uDpr * (0.75 + 0.5 * aRand) * (2.4 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const landFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDim;
  varying float vFacing;
  varying float vRand;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d) * (0.22 + 0.78 * pow(vFacing, 0.7)) * (0.7 + 0.3 * vRand) * uDim;
    gl_FragColor = vec4(uColor * (0.6 + 0.5 * vFacing), a);
  }
`;

const atmoVert = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  uniform float uBack;
  varying vec3 vN;
  void main() {
    float f = uBack > 0.5 ? pow(clamp(-vN.z, 0.0, 1.0), uPower) : pow(1.0 - clamp(vN.z, 0.0, 1.0), uPower);
    gl_FragColor = vec4(uColor * f * uStrength, f * uStrength);
  }
`;

/* Arcs: each line vertex knows its arc's start (globe-local), its t along the arc, and its timing.
   The cubic is evaluated on the GPU so arcs follow the rotating globe and end at the prompt box. */
const arcVert = /* glsl */ `
  attribute vec3 aStart;
  attribute float aT;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aAccent;
  attribute float aRand;
  uniform mat4 uGlobe;
  uniform vec3 uTarget;
  uniform vec3 uCam;
  uniform float uTime;
  uniform float uDensity;
  uniform float uConverge;
  uniform float uCollapse;
  varying float vAlpha;
  varying float vAccent;
  vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
    float u = 1.0 - t;
    return u*u*u*a + 3.0*u*u*t*b + 3.0*u*t*t*c + t*t*t*d;
  }
  void main() {
    vec3 s = (uGlobe * vec4(aStart, 1.0)).xyz;
    vec3 n = normalize(s - (uGlobe * vec4(0.0, 0.0, 0.0, 1.0)).xyz);
    float lift = 0.55 + 0.6 * aRand;
    vec3 c1 = s + n * lift;
    vec3 c2 = uTarget + vec3(0.0, 0.85 + 0.7 * aRand, -0.1) + (s - uTarget) * 0.3;
    float speed = aSpeed * (1.0 + uConverge * 1.6);
    float head = fract(uTime * speed + aPhase) * 1.4;
    float len = mix(0.26, 0.16, uConverge);
    float tail = smoothstep(head - len, head, aT) * step(aT, head);
    vec3 p = mix(bez(s, c1, c2, uTarget, aT), uTarget, uCollapse * uCollapse);
    float facing = smoothstep(-0.05, 0.35, dot(n, normalize(uCam - s)));
    float arrive = 1.0 - smoothstep(0.92, 1.0, aT);
    vAlpha = tail * facing * step(aRand, uDensity) * arrive * (1.0 - uCollapse);
    vAccent = aAccent;
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  }
`;
const arcFrag = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uNeutral;
  varying float vAlpha;
  varying float vAccent;
  void main() {
    if (vAlpha < 0.01) discard;
    vec3 col = vAccent > 0.5 ? uAccent * 2.2 : uNeutral * 1.1;
    gl_FragColor = vec4(col, vAlpha * (vAccent > 0.5 ? 1.0 : 0.55));
  }
`;

/* Pings: a flash where each arc launches, plus rare ambient twinkles across the land. */
const pingVert = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aAccent;
  attribute float aRand;
  attribute float aMode;
  uniform float uTime;
  uniform float uDpr;
  uniform float uDensity;
  uniform float uConverge;
  varying float vGlow;
  varying float vAccent;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position * 1.004, 1.0);
    vec3 n = normalize((modelViewMatrix * vec4(position, 0.0)).xyz);
    float g;
    if (aMode < 0.5) {
      float head = fract(uTime * aSpeed * (1.0 + uConverge * 1.6) + aPhase) * 1.4;
      g = (1.0 - smoothstep(0.0, 0.14, head)) * step(aRand, uDensity);
    } else {
      g = pow(max(0.0, sin(uTime * aSpeed * 6.0 + aPhase * 40.0)), 40.0);
    }
    vGlow = g * smoothstep(0.05, 0.4, n.z);
    vAccent = aAccent;
    gl_PointSize = (2.0 + (aMode < 0.5 ? 10.0 : 6.0) * g) * uDpr * (2.4 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const pingFrag = /* glsl */ `
  uniform vec3 uAccent;
  uniform vec3 uNeutral;
  varying float vGlow;
  varying float vAccent;
  void main() {
    if (vGlow < 0.02) discard;
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 col = vAccent > 0.5 ? uAccent * 2.6 : uNeutral * 1.1;
    gl_FragColor = vec4(col, a * vGlow);
  }
`;

/* ---------- scene ---------- */

function useMask() {
  const [mask, setMask] = useState<LandMask | null>(null);
  useEffect(() => {
    let live = true;
    loadLandMask().then((m) => live && setMask(m));
    return () => {
      live = false;
    };
  }, []);
  return mask;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Globe({ bridge, tier, mask, reduced }: { bridge: Bridge; tier: Tier; mask: LandMask; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const dpr = useThree((s) => s.viewport.dpr);

  const land = useMemo(() => sampleLand(mask, tier.land), [mask, tier.land]);

  const landGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(land.positions, 3));
    const r = rand(7);
    g.setAttribute("aRand", new THREE.BufferAttribute(Float32Array.from({ length: land.positions.length / 3 }, r), 1));
    return g;
  }, [land]);

  /* Arc starts: mostly tech hubs (jittered), the rest anywhere on land. */
  const starts = useMemo(() => {
    const r = rand(11);
    const out: { pos: Float32Array; ll: [number, number] }[] = [];
    for (let k = 0; k < tier.arcs; k++) {
      let lat: number;
      let lon: number;
      if (r() < 0.62) {
        const c = CITIES[Math.floor(r() * CITIES.length)];
        lat = c[0] + (r() - 0.5) * 3;
        lon = c[1] + (r() - 0.5) * 3;
      } else {
        [lat, lon] = land.latLon[Math.floor(r() * land.latLon.length)];
      }
      const pos = new Float32Array(3);
      latLonToVec(lat, lon, pos, 0);
      out.push({ pos, ll: [lat, lon] });
    }
    return out;
  }, [tier.arcs, land]);

  const arcs = useMemo(() => {
    const r = rand(23);
    const n = tier.arcs * tier.seg * 2;
    const aStart = new Float32Array(n * 3);
    const aT = new Float32Array(n);
    const aPhase = new Float32Array(n);
    const aSpeed = new Float32Array(n);
    const aAccent = new Float32Array(n);
    const aRand = new Float32Array(n);
    const meta: { phase: number; speed: number; accent: number; rnd: number }[] = [];
    let v = 0;
    starts.forEach((s) => {
      const phase = r();
      const speed = 0.07 + r() * 0.08;
      const accent = r() < 0.38 ? 1 : 0;
      const rnd = r();
      meta.push({ phase, speed, accent, rnd });
      for (let i = 0; i < tier.seg; i++) {
        for (const t of [i / tier.seg, (i + 1) / tier.seg]) {
          aStart.set(s.pos, v * 3);
          aT[v] = t;
          aPhase[v] = phase;
          aSpeed[v] = speed;
          aAccent[v] = accent;
          aRand[v] = rnd;
          v++;
        }
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(aStart, 3));
    g.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
    g.setAttribute("aAccent", new THREE.BufferAttribute(aAccent, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return { geo: g, meta };
  }, [starts, tier.seg, tier.arcs]);

  const pings = useMemo(() => {
    const r = rand(31);
    const total = starts.length + tier.ambient;
    const pos = new Float32Array(total * 3);
    const aPhase = new Float32Array(total);
    const aSpeed = new Float32Array(total);
    const aAccent = new Float32Array(total);
    const aRand = new Float32Array(total);
    const aMode = new Float32Array(total);
    starts.forEach((s, k) => {
      pos.set(s.pos, k * 3);
      aPhase[k] = arcs.meta[k].phase;
      aSpeed[k] = arcs.meta[k].speed;
      aAccent[k] = arcs.meta[k].accent;
      aRand[k] = arcs.meta[k].rnd;
    });
    for (let k = starts.length; k < total; k++) {
      const p = Math.floor(r() * (land.positions.length / 3));
      pos.set(land.positions.subarray(p * 3, p * 3 + 3), k * 3);
      aPhase[k] = r();
      aSpeed[k] = 0.05 + r() * 0.1;
      aAccent[k] = r() < 0.3 ? 1 : 0;
      aMode[k] = 1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
    g.setAttribute("aAccent", new THREE.BufferAttribute(aAccent, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(aRand, 1));
    g.setAttribute("aMode", new THREE.BufferAttribute(aMode, 1));
    return g;
  }, [starts, arcs.meta, land, tier.ambient]);

  const uniforms = useMemo(
    () => ({
      land: { uDpr: { value: 1 }, uSize: { value: tier === MOBILE ? 2.4 : 2.0 }, uColor: { value: NEUTRAL.clone() }, uDim: { value: 1 } },
      arc: {
        uGlobe: { value: new THREE.Matrix4() },
        uTarget: { value: new THREE.Vector3() },
        uCam: { value: new THREE.Vector3() },
        uTime: { value: 0 },
        uDensity: { value: 0.55 },
        uConverge: { value: 0 },
        uCollapse: { value: 0 },
        uAccent: { value: ACCENT },
        uNeutral: { value: NEUTRAL },
      },
      ping: {
        uTime: { value: 0 },
        uDpr: { value: 1 },
        uDensity: { value: 0.55 },
        uConverge: { value: 0 },
        uAccent: { value: ACCENT },
        uNeutral: { value: NEUTRAL },
      },
    }),
    [tier],
  );

  /* Materials are built here (not as JSX props) so the uniform objects mutated each frame are the ones on the GPU. */
  const mats = useMemo(() => {
    const common = { transparent: true, depthWrite: false };
    return {
      land: new THREE.ShaderMaterial({ vertexShader: landVert, fragmentShader: landFrag, uniforms: uniforms.land, ...common }),
      ping: new THREE.ShaderMaterial({ vertexShader: pingVert, fragmentShader: pingFrag, uniforms: uniforms.ping, blending: THREE.AdditiveBlending, ...common }),
      arc: new THREE.ShaderMaterial({ vertexShader: arcVert, fragmentShader: arcFrag, uniforms: uniforms.arc, blending: THREE.AdditiveBlending, ...common }),
    };
  }, [uniforms]);
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    const t = setTimeout(invalidate, 120);
    return () => clearTimeout(t);
  }, [invalidate, mask]);

  const tmp = useMemo(() => ({ v: new THREE.Vector3(), w: new THREE.Vector3(), ndc: new THREE.Vector3() }), []);
  const labelState = useRef<{ until: number; pos: THREE.Vector3 }[]>([]);
  const nextLabel = useRef(1.2);
  const clock = useRef(reduced ? 9 : 0);

  useFrame((state, delta) => {
    const dt = reduced ? 0 : CAPTURE ? 1 / 30 : Math.min(delta, 1 / 20);
    clock.current += dt;
    const time = clock.current;
    const p = reduced ? 0.35 : bridge.progress;

    /* Camera dolly and parallax. */
    const cam = camera as THREE.PerspectiveCamera;
    /* Fit the globe (plus halo) to the narrower axis, then dolly in. */
    const half = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * Math.min(1, cam.aspect);
    const fit = 1.32 / half;
    const z = THREE.MathUtils.lerp(fit, fit * 0.7, smooth(0.05, 0.75, p));
    cam.position.z += (z - cam.position.z) * (reduced ? 1 : 0.08);
    cam.position.y += (0.1 + 0.25 * smooth(0.05, 0.75, p) - cam.position.y) * (reduced ? 1 : 0.08);
    cam.lookAt(0, 0.05, 0);
    cam.updateMatrixWorld();

    if (group.current) {
      const g = group.current;
      g.rotation.x += (0.32 + bridge.pointer.y * 0.12 - g.rotation.x) * 0.05;
      g.rotation.y += (bridge.pointer.x * 0.25 - g.rotation.y) * 0.05;
    }
    if (spin.current) spin.current.rotation.y = -1.9 + time * 0.045 * (1 + smooth(0.3, 0.8, p) * 0.6);
    spin.current?.updateMatrixWorld(true);

    /* Prompt box target: fixed NDC point projected at a depth in front of the globe. */
    const fov = THREE.MathUtils.degToRad(cam.fov);
    const depth = cam.position.z - 1.15;
    const hh = Math.tan(fov / 2) * depth;
    tmp.v.set(bridge.target.x * hh * cam.aspect, bridge.target.y * hh, -depth).applyMatrix4(cam.matrixWorld);

    const converge = smooth(0.25, 0.7, p);
    const collapse = smooth(0.78, 0.98, p);
    const density = 0.55 + 0.45 * converge;
    const a = mats.arc.uniforms as typeof uniforms.arc;
    a.uGlobe.value.copy(spin.current!.matrixWorld);
    a.uTarget.value.copy(tmp.v);
    a.uCam.value.copy(cam.position);
    a.uTime.value = time;
    a.uDensity.value = density;
    a.uConverge.value = converge;
    a.uCollapse.value = collapse;
    const pu = mats.ping.uniforms as typeof uniforms.ping;
    pu.uTime.value = time;
    pu.uDpr.value = dpr;
    pu.uDensity.value = density;
    pu.uConverge.value = converge;
    const lu = mats.land.uniforms as typeof uniforms.land;
    lu.uDpr.value = dpr;
    lu.uDim.value = 1 - collapse * 0.35;

    /* Floating question labels near front-facing launches. */
    if (!reduced) {
      const els = bridge.labels;
      if (time > nextLabel.current && collapse < 0.1) {
        nextLabel.current = time + (size.width < 640 ? 2.2 : 1.3) + Math.random();
        const slot = labelState.current.findIndex((l, k) => !l || l.until < time || !els[k]) ;
        const k = slot === -1 ? labelState.current.length : slot;
        if (k < els.length && els[k]) {
          for (let tries = 0; tries < 12; tries++) {
            const s = starts[Math.floor(Math.random() * starts.length)];
            tmp.w.set(s.pos[0], s.pos[1], s.pos[2]).applyMatrix4(spin.current!.matrixWorld);
            const facing = tmp.w.clone().normalize().dot(tmp.ndc.copy(cam.position).sub(tmp.w).normalize());
            tmp.ndc.copy(tmp.w).project(cam);
            if (facing > 0.45 && tmp.ndc.y > bridge.target.y + 0.38 && Math.abs(tmp.ndc.x) < 0.7 && tmp.ndc.y < 0.78) {
              labelState.current[k] = { until: time + 3, pos: new THREE.Vector3(s.pos[0], s.pos[1], s.pos[2]) };
              const el = els[k]!;
              el.textContent = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
              el.classList.remove("globe-label-on");
              void el.offsetWidth;
              el.classList.add("globe-label-on");
              break;
            }
          }
        }
      }
      labelState.current.forEach((l, k) => {
        const el = els[k];
        if (!l || !el) return;
        tmp.w.copy(l.pos).applyMatrix4(spin.current!.matrixWorld).project(cam);
        const half = el.offsetWidth / 2 + 10;
        const x = Math.min(size.width - half, Math.max(half, ((tmp.w.x + 1) / 2) * size.width));
        el.style.transform = `translate(${x}px, ${((1 - tmp.w.y) / 2) * size.height}px)`;
      });
    }
  });

  return (
    <group ref={group}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[0.985, 96, 96]} />
          <meshBasicMaterial color="#121211" />
        </mesh>
        <points geometry={landGeo} material={mats.land} />
        <points geometry={pings} material={mats.ping} />
      </group>
      {/* Fresnel rim on the face and a soft halo behind. */}
      <mesh>
        <sphereGeometry args={[1.0, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={{ uColor: { value: new THREE.Color("#ffb08a") }, uPower: { value: 3.2 }, uStrength: { value: 0.55 }, uBack: { value: 0 } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={1.2}>
        <sphereGeometry args={[1.0, 96, 96]} />
        <shaderMaterial
          vertexShader={atmoVert}
          fragmentShader={atmoFrag}
          uniforms={{ uColor: { value: new THREE.Color("#ff8a5c") }, uPower: { value: 1.6 }, uStrength: { value: 0.75 }, uBack: { value: 1 } }}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <lineSegments geometry={arcs.geo} material={mats.arc} frustumCulled={false} />
    </group>
  );
}

function CaptureHook() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    (window as unknown as { __globeAdvance?: () => void }).__globeAdvance = () => advance(performance.now());
  }, [advance]);
  return null;
}

/** Steps the pixel ratio down when frames run long and back up when there is headroom. */
function AdaptiveDpr({ max }: { max: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ t: 0, n: 0, dpr: Math.min(max, typeof window === "undefined" ? 1 : window.devicePixelRatio) });
  useFrame((_, delta) => {
    const a = acc.current;
    a.t += delta;
    a.n++;
    if (a.t < 1) return;
    const ms = (a.t / a.n) * 1000;
    const next = ms > 20 ? Math.max(1, a.dpr - 0.25) : ms < 13 ? Math.min(max, a.dpr + 0.25) : a.dpr;
    if (next !== a.dpr) {
      a.dpr = next;
      setDpr(next);
    }
    a.t = 0;
    a.n = 0;
  });
  return null;
}

export default function GlobeScene({
  bridge,
  mobile,
  reduced,
  active,
}: {
  bridge: Bridge;
  mobile: boolean;
  reduced: boolean;
  active: boolean;
}) {
  const mask = useMask();
  const tier = mobile ? MOBILE : DESKTOP;
  const startDpr = Math.min(tier.maxDpr, typeof window === "undefined" ? 1 : window.devicePixelRatio);
  return (
    <Canvas
      dpr={startDpr}
      frameloop={reduced ? "demand" : CAPTURE ? "never" : active ? "always" : "never"}
      camera={{ fov: 35, position: [0, 0.1, mobile ? 8 : 4.6], near: 0.1, far: 50 }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      className="!absolute inset-0"
    >
      <color attach="background" args={[BG]} />
      {mask && <Globe bridge={bridge} tier={tier} mask={mask} reduced={reduced} />}
      {!reduced && !CAPTURE && <AdaptiveDpr max={tier.maxDpr} />}
      {CAPTURE && <CaptureHook />}
      <EffectComposer multisampling={0}>
        <Bloom intensity={tier.bloom} luminanceThreshold={0.55} luminanceSmoothing={0.25} mipmapBlur radius={0.72} />
      </EffectComposer>
    </Canvas>
  );
}
