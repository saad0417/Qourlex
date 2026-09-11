import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/* ---------------------------------------------------------------------------
 * Tunables. Every number the look depends on lives here.
 * ------------------------------------------------------------------------ */
const CONFIG = {
  camera: { fov: 50, position: [0, 0, 10], near: 0.1, far: 100 },

  // The cluster is rendered only in the split layout. Below that the copy sits
  // on the frosted panel, and a cluster behind it pushed so much colour through
  // the blur that the panel read as a solid blue block. There the panel gets
  // the gradient wash on its own, and the phone skips WebGL entirely.
  desktop: {
    count: 155,
    segments: 20,
    cursor: true,
    environment: true,
  },

  // The balls are sized to pack tightly, close to touching, the way the
  // reference cluster does. They are kept from merging into each other by
  // solving the contacts every frame rather than by shrinking them: see
  // relaxContacts below. Sizes are fractions of the nearest-neighbour arc,
  // which on a Fibonacci shell of radius R with N points is roughly
  // R * sqrt(8*PI / (N * sqrt(3))).
  cluster: {
    shellRadius: 2.05,
    radiusJitter: 0.05,  // per-ball wobble on the shell radius
    minSpacingFraction: 0.44,
    maxSpacingFraction: 0.58,
  },

  // Contact solving. Overlapping pairs are pushed apart along the line of
  // centres, each taking half the correction — the positional-correction step
  // of a position-based dynamics solver. A couple of passes is plenty because
  // the rest layout is already relaxed at build time.
  contacts: {
    buildIterations: 40,
    frameIterations: 2,
    // How firmly a pair is separated. Below 1 the correction is under-relaxed,
    // which stops neighbours trading pushes and buzzing against each other.
    stiffness: 0.65,
    // Pairs further apart than this at rest can never collide, so they are left
    // out of the neighbour list entirely.
    neighbourMargin: 1.35,
  },

  // Where the cluster sits, as a fraction of the frustum half-width at z = 0.
  // Desktop puts it right of centre and leaves the left half for the headline;
  // narrow viewports centre it behind the text.
  offsetFraction: 0.44,

  cursorField: {
    // Sized against the core: the tunnel has to clear the orb (0.6) plus the
    // emblem's half-width, with margin, before the mark reads cleanly. The
    // shell is packed tight now and the contact solver lets crowded-out balls
    // push back, so the field has to be strong enough to win against that.
    radius: 3.0,
    strength: 2.6,
    // Only the XY of this matters now; the cluster centre keeps the tunnel
    // square to the view axis.
    depth: 0,
    // Spec asks for a per-frame lerp of 0.06; expressed frame-rate independent.
    lerp: 0.06,
    pointerLerp: 0.12,
  },

  // Bob amplitude is small on purpose: two neighbours bobbing out of phase close
  // twice this much of the gap between them.
  ambient: { bobSpeed: 0.75, bobAmount: 0.05, rotationPerSecond: 0.001 * 60 },

  // A touch softer than the original showroom finish. The specular highlight is
  // deliberately still there — this is a small step back from roughness 0.2,
  // not a matte surface.
  material: {
    metalness: 0.26,
    roughness: 0.29,
    envMapIntensity: 0.9,
  },

  // The lit orb the shell opens around, and the brand mark that sits on it.
  core: {
    radius: 0.6,
    glowScale: 3.2,     // sprite diameter, in world units
    // Measured from the rendered artwork: once centred on its centroid, the
    // furthest ink (the tail tip) sits at 0.621 of the plane's width. 0.79
    // therefore puts it 0.49 out against an orb radius of 0.6, leaving an even
    // 18% of the radius clear all round instead of crowding the rim.
    logoSize: 0.79,
  },

  palette: ['#4F46E5', '#7C3AED'],
  emissive: '#3A1C93',
  emissiveIntensity: 0.32,
};

const DEG2RAD = Math.PI / 180;

/* Frame-rate independent form of "lerp by f every frame at 60fps". */
const damp = (f, dt) => 1 - Math.pow(1 - f, dt * 60);

/* Deterministic PRNG (mulberry32). The cluster is built inside a useMemo, and
   React is free to throw a memo away and recompute it — with Math.random that
   would silently reshuffle every ball. Seeding makes the layout reproducible
   and keeps the render pure. */
const makeRandom = (seed) => {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

/* ---------------------------------------------------------------------------
 * The Qourlex mark, drawn to a canvas so it can sit on the core as a texture.
 * Geometry is the same 128-unit box as the SVG in Logo.jsx, traced from the
 * supplied artwork: the Q ring, its diagonal tail, and the five voice bars.
 * Colours are inverted against the light core so the mark reads as ink on a lit
 * orb rather than white on white.
 * ------------------------------------------------------------------------ */
const LOGO_TEXTURE_SIZE = 512;

/* Centre of mass of the mark's ink, in the 128-unit artwork box. */
const LOGO_INK_CENTROID = { x: 63.18, y: 67.2 };

const LOGO_BARS = [
  { cx: 36.5, height: 12.1 },
  { cx: 48.4, height: 29.5 },
  { cx: 60.2, height: 48.3 },
  { cx: 72.2, height: 29.5 },
  { cx: 84.0, height: 12.1 },
];

function createLogoTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = LOGO_TEXTURE_SIZE;
  canvas.height = LOGO_TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Centred on the ink's CENTROID, not its bounding box. The Q's tail carries
  // real mass low and right, so a box-centred mark measures as symmetric but
  // reads as sitting low inside a circle. Measured off the rendered artwork:
  // the centroid lands at (63.18, 67.2) in the 128 box, 3.2 units below centre.
  const unit = LOGO_TEXTURE_SIZE / 132;
  ctx.translate(LOGO_TEXTURE_SIZE / 2, LOGO_TEXTURE_SIZE / 2);
  ctx.scale(unit, unit);
  ctx.translate(-LOGO_INK_CENTROID.x, -LOGO_INK_CENTROID.y);

  const INK = '#1E1B4B';

  // Q ring
  ctx.beginPath();
  ctx.arc(60.4, 64, 47.5, 0, Math.PI * 2);
  ctx.lineWidth = 19.5;
  ctx.strokeStyle = INK;
  ctx.stroke();

  // Diagonal tail
  ctx.beginPath();
  ctx.moveTo(67.4, 88);
  ctx.lineTo(96.6, 88);
  ctx.lineTo(125.2, 121.3);
  ctx.lineTo(97.1, 121.3);
  ctx.closePath();
  ctx.fillStyle = INK;
  ctx.fill();

  // Voice waveform, on the same diagonal gradient the SVG uses
  const wave = ctx.createLinearGradient(30, 40, 92, 90);
  wave.addColorStop(0, '#4338CA');
  wave.addColorStop(0.55, '#3730A3');
  wave.addColorStop(1, '#5B21B6');
  ctx.fillStyle = wave;

  const barWidth = 7.6;
  for (const bar of LOGO_BARS) {
    const x = bar.cx - barWidth / 2;
    const y = 64.4 - bar.height / 2;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, bar.height, barWidth / 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/* A radial falloff, used as a sprite behind the orb. A bare sphere with a basic
   material silhouettes as a flat disc; this is what makes it read as lit. */
function createGlowTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const c = size / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  // Pure bright core radiating out past the sphere rim (~0.38 of radius)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.24, 'rgba(238, 242, 255, 0.98)');
  gradient.addColorStop(0.38, 'rgba(215, 225, 255, 0.92)'); // Right at the sphere rim
  gradient.addColorStop(0.50, 'rgba(180, 195, 255, 0.72)'); // Radiant luminous halo just outside the sphere
  gradient.addColorStop(0.66, 'rgba(129, 140, 248, 0.42)'); // Electric indigo/blue glow into the balls
  gradient.addColorStop(0.82, 'rgba(99, 102, 241, 0.16)'); // Soft outer tail
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* The lit core, with the mark on it. Deliberately outside the rotating group:
   the shell turns, the emblem stays square to the viewer. */
function CoreOrb() {
  const glowRef = useRef(null);
  const emblemRef = useRef(null);
  const logoTexture = useMemo(() => createLogoTexture(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  useEffect(() => () => {
    logoTexture?.dispose();
    glowTexture?.dispose();
  }, [logoTexture, glowTexture]);

  useFrame((state) => {
    if (glowRef.current) {
      // A slow gentle breath, so the orb reads as lit rather than painted on.
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.1) * 0.06;
      glowRef.current.scale.setScalar(CONFIG.core.glowScale * pulse);
    }

    // Aim the emblem at the camera. This is a lookAt rather than drei's
    // <Billboard>, which copies the camera's rotation instead: with that, the
    // emblem's forward offset runs along world +Z rather than along the view
    // ray, and because the cluster sits off-axis to the right that offset
    // projects the mark sideways off the orb. Measured at 1440x900 it landed
    // 19px right of the orb centre, a third of the orb's radius. Orienting to
    // the camera puts the offset on the view ray, where it does not move the
    // mark on screen at all.
    if (emblemRef.current) emblemRef.current.lookAt(state.camera.position);
  });

  return (
    <group>
      {glowTexture && (
        <sprite ref={glowRef} scale={CONFIG.core.glowScale} position={[0, 0, 0]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      )}

      <mesh>
        <sphereGeometry args={[CONFIG.core.radius, 48, 48]} />
        <meshBasicMaterial color="#EBF0FF" toneMapped={false} />
      </mesh>

      {logoTexture && (
        <group ref={emblemRef}>
          <mesh position={[0, 0, CONFIG.core.radius + 0.012]}>
            <planeGeometry args={[CONFIG.core.logoSize, CONFIG.core.logoSize]} />
            <meshBasicMaterial
              map={logoTexture}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      <pointLight color="#C7D2FE" intensity={4.8} distance={8.5} decay={2} />
    </group>
  );
}

/* Builds the shell. Fibonacci distribution spreads the balls evenly with no
   seams or polar clumping; the jitter keeps it from looking mathematical. */
function buildSpheres(count, seed) {
  const random = makeRandom(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));

  // Mean centre-to-centre distance between neighbouring points on the shell.
  const neighbourGap =
    CONFIG.cluster.shellRadius *
    Math.sqrt((8 * Math.PI) / (Math.max(count, 4) * Math.sqrt(3)));
  const minBall = neighbourGap * CONFIG.cluster.minSpacingFraction;
  const maxBall = neighbourGap * CONFIG.cluster.maxSpacingFraction;
  const colorA = new THREE.Color(CONFIG.palette[0]);
  const colorB = new THREE.Color(CONFIG.palette[1]);
  const items = [];

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;

    const shell =
      CONFIG.cluster.shellRadius +
      (random() - 0.5) * 2 * CONFIG.cluster.radiusJitter;

    const base = new THREE.Vector3(
      Math.cos(theta) * ringRadius * shell,
      y * shell,
      Math.sin(theta) * ringRadius * shell
    );

    items.push({
      base,
      current: base.clone(),
      target: new THREE.Vector3(),
      ballRadius: minBall + random() * (maxBall - minBall),
      color: colorA.clone().lerp(colorB, random()),
      phase: random() * Math.PI * 2,
      shell,
    });
  }

  // Settle the layout so nothing starts out interpenetrating, re-seating each
  // ball on its own shell radius after every pass so the cluster keeps its
  // spherical form instead of inflating into a blob.
  const pairs = buildContactPairs(items);
  for (let pass = 0; pass < CONFIG.contacts.buildIterations; pass++) {
    const moved = relaxContacts(items, pairs, 'base', 1);
    for (const item of items) item.base.setLength(item.shell);
    if (moved < 1e-4) break;
  }
  for (const item of items) item.current.copy(item.base);

  return { items, pairs };
}

/* Every pair close enough at rest that it could ever come into contact. Built
   once; the shell topology does not change, so the list stays valid. */
function buildContactPairs(items) {
  const pairs = [];
  const reach =
    2 * Math.max(...items.map((i) => i.ballRadius)) * CONFIG.contacts.neighbourMargin;
  const reachSq = reach * reach;

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (items[i].base.distanceToSquared(items[j].base) < reachSq) {
        pairs.push(i, j, items[i].ballRadius + items[j].ballRadius);
      }
    }
  }
  return Float64Array.from(pairs);
}

/* One positional-correction pass. Any pair closer than the sum of its radii is
   separated along the line of centres, each ball taking half. Returns the
   largest correction applied, so the build loop can stop once it settles. */
const CONTACT_DELTA = new THREE.Vector3();

/* Frame-loop scratch. Allocated once at module scope rather than per component:
   these are written and read entirely within a single synchronous frame
   callback, so there is nothing to keep between frames and nothing for React to
   own. Only one cluster is ever mounted. */
const SCRATCH = {
  dummy: new THREE.Object3D(),
  cursorWorld: new THREE.Vector3(),
  ballWorld: new THREE.Vector3(),
  groupInverse: new THREE.Matrix4(),
};

function relaxContacts(items, pairs, field, stiffness) {
  let largest = 0;

  for (let p = 0; p < pairs.length; p += 3) {
    const a = items[pairs[p]][field];
    const b = items[pairs[p + 1]][field];
    const minDistance = pairs[p + 2];

    CONTACT_DELTA.subVectors(b, a);
    const distSq = CONTACT_DELTA.lengthSq();
    if (distSq >= minDistance * minDistance || distSq < 1e-12) continue;

    const dist = Math.sqrt(distSq);
    const push = ((minDistance - dist) / dist) * 0.5 * stiffness;
    CONTACT_DELTA.multiplyScalar(push);

    a.sub(CONTACT_DELTA);
    b.add(CONTACT_DELTA);

    const magnitude = CONTACT_DELTA.length();
    if (magnitude > largest) largest = magnitude;
  }

  return largest;
}

/* ---------------------------------------------------------------------------
 * The cluster: one InstancedMesh, so 140 glossy balls cost a single draw call.
 * ------------------------------------------------------------------------ */
function SphereCluster({ pointerRef, profile, offsetFraction, reducedMotion }) {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const { viewport, camera } = useThree();

  const count = profile.count;

  // The sphere records are mutable per-instance state that the frame loop
  // rewrites every tick, so they belong in a ref rather than a memo. Colours
  // are uploaded here too, once, because they never change afterwards.
  const spheresRef = useRef(null);
  useLayoutEffect(() => {
    const cluster = buildSpheres(count, 0x5eed1234);
    spheresRef.current = cluster;

    const mesh = meshRef.current;
    if (!mesh) return;
    cluster.items.forEach((s, i) => mesh.setColorAt(i, s.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count]);


  // Frustum half-extents at the cluster's depth, used to place the cluster and
  // to convert the pointer into world units.
  const halfHeight = Math.tan((CONFIG.camera.fov / 2) * DEG2RAD) * camera.position.z;
  const halfWidth = halfHeight * (viewport.aspect || 1);
  const offsetX = halfWidth * offsetFraction;

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    const cluster = spheresRef.current;
    if (!mesh || !group || !cluster) return;
    const { items: spheres, pairs } = cluster;
    const { dummy, cursorWorld, ballWorld, groupInverse } = SCRATCH;

    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;

    if (!reducedMotion) {
      group.rotation.y += CONFIG.ambient.rotationPerSecond * delta;
    }

    // Pointer eases toward its target first, which is what makes the parting
    // feel like it has weight instead of snapping to the cursor.
    const pointer = pointerRef.current;
    pointer.x += (pointer.targetX - pointer.x) * damp(CONFIG.cursorField.pointerLerp, delta);
    pointer.y += (pointer.targetY - pointer.y) * damp(CONFIG.cursorField.pointerLerp, delta);
    pointer.amount += (pointer.targetAmount - pointer.amount) * damp(0.05, delta);

    cursorWorld.set(
      pointer.x * halfWidth,
      pointer.y * halfHeight,
      CONFIG.cursorField.depth
    );

    // The cursor field is defined against the screen, so it has to be applied
    // in world space. Doing it in the group's local space looked right at rest
    // but drifted as the shell turned: a quarter turn puts local X along the
    // view axis, so the "sideways" push became a push toward the camera and
    // the tunnel stopped opening. Ball positions are therefore lifted to world
    // space for the test, pushed there, and mapped back.
    group.updateWorldMatrix(true, false);
    groupInverse.copy(group.matrixWorld).invert();

    const ease = damp(CONFIG.cursorField.lerp, delta);
    const interacting = pointer.amount > 0.001;

    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];
      s.target.copy(s.base);

      if (!reducedMotion) {
        s.target.y +=
          Math.sin(time * CONFIG.ambient.bobSpeed + s.phase + i * 0.35) *
          CONFIG.ambient.bobAmount;
      }

      if (interacting) {
        // The field is a cylinder along the view axis, not a sphere around a
        // point. Measuring in 3D pushed the balls sitting directly in front of
        // the core straight at the camera, so they kept covering it; measuring
        // in XY and pushing in XY parts them sideways and opens a clean tunnel
        // through to the orb, which is the whole point of the interaction.
        ballWorld.copy(s.target).applyMatrix4(group.matrixWorld);

        const dx = ballWorld.x - cursorWorld.x;
        const dy = ballWorld.y - cursorWorld.y;
        const dist = Math.hypot(dx, dy);

        if (dist < CONFIG.cursorField.radius) {
          // Closer means a harder push, eased so the rim has no visible edge.
          const falloff = 1 - dist / CONFIG.cursorField.radius;
          const push = falloff * falloff * CONFIG.cursorField.strength * pointer.amount;
          // Balls sitting exactly on the axis need a direction to leave along.
          const inv = dist > 1e-4 ? 1 / dist : 0;
          const dirX = inv ? dx * inv : Math.cos(s.phase);
          const dirY = inv ? dy * inv : Math.sin(s.phase);

          ballWorld.x += dirX * push;
          ballWorld.y += dirY * push;
          s.target.copy(ballWorld).applyMatrix4(groupInverse);
        }
      }

      // Everything drifts, nothing snaps — including the way home.
      s.current.lerp(s.target, ease);
    }

    // Solve the contacts on the positions that are about to be drawn, so what
    // ends up on screen is guaranteed free of interpenetration. Balls shoved by
    // the cursor shove their neighbours in turn, which is what makes the shell
    // part like a physical thing rather than a set of independent points.
    for (let pass = 0; pass < CONFIG.contacts.frameIterations; pass++) {
      relaxContacts(spheres, pairs, 'current', CONFIG.contacts.stiffness);
    }

    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];
      dummy.position.copy(s.current);
      dummy.scale.setScalar(s.ballRadius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={[offsetX, 0, 0]}>
      <CoreOrb />

      {/* Only the shell turns. */}
      <group ref={groupRef}>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, count]}
          frustumCulled={false}
        >
          <sphereGeometry args={[1, profile.segments, profile.segments]} />
          <meshStandardMaterial
            metalness={CONFIG.material.metalness}
            roughness={CONFIG.material.roughness}
            emissive={CONFIG.emissive}
            emissiveIntensity={CONFIG.emissiveIntensity}
            envMapIntensity={profile.environment ? CONFIG.material.envMapIntensity : 0}
          />
        </instancedMesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------------ */

function Scene({ pointerRef, profile, offsetFraction, reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Key light from the top right, which is where the video's highlights sit. */}
      <directionalLight position={[6, 6, 5]} intensity={1.12} />
      {/* Coloured fill so the shadow side reads violet rather than black. */}
      <pointLight position={[-5, -2, 4]} color="#7C3AED" intensity={22} distance={22} />

      <SphereCluster
        profile={profile}
        pointerRef={pointerRef}
        offsetFraction={offsetFraction}
        reducedMotion={reducedMotion}
      />

      {profile.environment && (
        <Suspense fallback={null}>
          {/* A studio probe built from lightformers rather than drei's "city"
              preset: the presets stream a multi-megabyte HDR from a third-party
              CDN on every visit, which is a poor trade for a hero background.
              These give the same glossy reflections with nothing to download. */}
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={1.75}
              position={[5, 5, 4]}
              scale={[12, 12, 1]}
              color="#ffffff"
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[-6, 1, 3]}
              scale={[8, 8, 1]}
              color="#8B5CF6"
            />
            <Lightformer
              form="circle"
              intensity={1.8}
              position={[0, -5, 3]}
              scale={[6, 6, 1]}
              color="#4F46E5"
            />
            <Lightformer
              form="rect"
              intensity={0.9}
              position={[0, 3, -6]}
              scale={[12, 6, 1]}
              color="#1E1B4B"
            />
          </Environment>
        </Suspense>
      )}
    </>
  );
}

/* ------------------------------------------------------------------------ */

export const HeroSpheres = () => {
  const wrapperRef = useRef(null);
  const [showCluster, setShowCluster] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // Pointer state lives in a ref so mousemove never triggers a React render;
  // the frame loop reads and writes it directly. The ref object itself is what
  // gets passed down — never its contents, which would be a read during render.
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, amount: 0, targetAmount: 0 });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // The split layout is also the only place the cluster is drawn.
    const splitQuery = window.matchMedia('(min-width: 1024px)');

    const apply = () => {
      setShowCluster(splitQuery.matches);
      setReducedMotion(motionQuery.matches);
    };
    apply();

    motionQuery.addEventListener('change', apply);
    splitQuery.addEventListener('change', apply);
    return () => {
      motionQuery.removeEventListener('change', apply);
      splitQuery.removeEventListener('change', apply);
    };
  }, []);

  const cursorEnabled = showCluster && !reducedMotion && onScreen;

  // The hero is the only thing this scene is for, so it should not keep
  // rendering at 60fps while the reader is somewhere else on the page. Left
  // running it competes for frame time with the scroll and the ScrollTrigger
  // reveals for the whole length of the site.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!cursorEnabled) {
      pointerRef.current.targetAmount = 0;
      return undefined;
    }
    // The canvas is pointer-events: none so buttons stay clickable, so the
    // cursor is tracked on the window and mapped into the hero's box.
    const handleMove = (event) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;

      const pointer = pointerRef.current;
      if (inside) {
        pointer.targetX = nx;
        pointer.targetY = ny;
      }
      pointer.targetAmount = inside ? 1 : 0;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [cursorEnabled]);

  return (
    <div ref={wrapperRef} className="hero-spheres" aria-hidden="true">
      <div className="hero-spheres__glow" />
      {showCluster && (
        <Canvas
          dpr={[1, 1.5]}
          /* 'demand' rather than 'never' for reduced motion: never would leave
             the hero blank, demand draws the scene once and then stops. */
          frameloop={!onScreen ? 'never' : reducedMotion ? 'demand' : 'always'}
          camera={CONFIG.camera}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'none' }}
        >
          <Scene
            profile={CONFIG.desktop}
            pointerRef={pointerRef}
            offsetFraction={CONFIG.offsetFraction}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      )}
      <div className="hero-spheres__scrim" />
    </div>
  );
};

export default HeroSpheres;
