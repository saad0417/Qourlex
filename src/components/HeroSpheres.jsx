import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/* ---------------------------------------------------------------------------
 * Tunables. Every number the look depends on lives here.
 * ------------------------------------------------------------------------ */
const CONFIG = {
  camera: { fov: 50, position: [0, 0, 10], near: 0.1, far: 100 },

  desktop: {
    count: 155,          // shell needs this many to read as a solid cluster
    segments: 20,        // visually identical to 28 at the size these render
    cursor: true,
    environment: true,
  },
  mobile: {
    count: 28,
    segments: 16,
    cursor: false,       // ambient float only
    environment: false,  // lights only, no reflection probe
  },

  cluster: {
    shellRadius: 2.0,
    radiusJitter: 0.1,   // per-ball wobble on the shell radius
    // Kept inside the 0.15-0.5 brief, but narrowed: the full range mixes
    // pea-sized balls with ones three times wider and the shell stops reading
    // as one object.
    minBall: 0.27,
    maxBall: 0.45,
  },

  // Where the cluster sits, as a fraction of the frustum half-width at z = 0.
  // Desktop puts it right of centre and leaves the left half for the headline;
  // narrow viewports centre it behind the text.
  offsetFraction: { desktop: 0.44, centred: 0 },

  cursorField: {
    radius: 2.6,
    strength: 1.45,
    // The cursor is projected to this depth, in front of the cluster centre, so
    // the balls facing the camera are the ones that part and the core shows.
    depth: 1.5,
    // Spec asks for a per-frame lerp of 0.06; expressed frame-rate independent.
    lerp: 0.06,
    pointerLerp: 0.12,
  },

  ambient: { bobSpeed: 0.75, bobAmount: 0.11, rotationPerSecond: 0.001 * 60 },

  palette: ['#4F46E5', '#7C3AED'],
  emissive: '#3B1D8F',
  emissiveIntensity: 0.28,
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

/* Builds the shell. Fibonacci distribution spreads the balls evenly with no
   seams or polar clumping; the jitter keeps it from looking mathematical. */
function buildSpheres(count, seed) {
  const random = makeRandom(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
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
      ballRadius:
        CONFIG.cluster.minBall +
        random() * (CONFIG.cluster.maxBall - CONFIG.cluster.minBall),
      color: colorA.clone().lerp(colorB, random()),
      phase: random() * Math.PI * 2,
    });
  }
  return items;
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
    const spheres = buildSpheres(count, 0x5eed1234);
    spheresRef.current = spheres;

    const mesh = meshRef.current;
    if (!mesh) return;
    spheres.forEach((s, i) => mesh.setColorAt(i, s.color));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cursorWorld = useMemo(() => new THREE.Vector3(), []);
  const cursorLocal = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  // Frustum half-extents at the cluster's depth, used to place the cluster and
  // to convert the pointer into world units.
  const halfHeight = Math.tan((CONFIG.camera.fov / 2) * DEG2RAD) * camera.position.z;
  const halfWidth = halfHeight * (viewport.aspect || 1);
  const offsetX = halfWidth * offsetFraction;

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    const spheres = spheresRef.current;
    if (!mesh || !group || !spheres) return;

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
    // The group turns, so the cursor has to come with it into local space.
    cursorLocal.copy(cursorWorld);
    group.worldToLocal(cursorLocal);

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
        const dist = s.target.distanceTo(cursorLocal);
        if (dist < CONFIG.cursorField.radius) {
          // Closer means a harder push, smoothed so the rim of the effect has
          // no visible edge.
          const falloff = 1 - dist / CONFIG.cursorField.radius;
          const push = falloff * falloff * CONFIG.cursorField.strength * pointer.amount;
          direction.subVectors(s.target, cursorLocal);
          if (direction.lengthSq() < 1e-8) direction.set(0, 0, 1);
          direction.normalize();
          s.target.addScaledVector(direction, push);
        }
      }

      // Everything drifts, nothing snaps — including the way home.
      s.current.lerp(s.target, ease);

      dummy.position.copy(s.current);
      dummy.scale.setScalar(s.ballRadius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[offsetX, 0, 0]}>
      {/* Glowing core, revealed wherever the cursor parts the shell. Sized to
          stay behind the shell so it reads as one contained orb rather than
          white light leaking through every gap. */}
      <mesh>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshBasicMaterial color="#C7D2FE" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color="#818CF8"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#A5B4FC" intensity={5} distance={8} decay={2} />

      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, profile.segments, profile.segments]} />
        <meshStandardMaterial
          metalness={0.3}
          roughness={0.2}
          emissive={CONFIG.emissive}
          emissiveIntensity={CONFIG.emissiveIntensity}
          envMapIntensity={profile.environment ? 1.1 : 0}
        />
      </instancedMesh>
    </group>
  );
}

/* ------------------------------------------------------------------------ */

function Scene({ pointerRef, profile, offsetFraction, reducedMotion }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Key light from the top right, which is where the video's highlights sit. */}
      <directionalLight position={[6, 6, 5]} intensity={1.2} />
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
              intensity={2.4}
              position={[5, 5, 4]}
              scale={[10, 10, 1]}
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
  const [profile, setProfile] = useState(null);
  const [offsetFraction, setOffsetFraction] = useState(CONFIG.offsetFraction.desktop);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Pointer state lives in a ref so mousemove never triggers a React render;
  // the frame loop reads and writes it directly. The ref object itself is what
  // gets passed down — never its contents, which would be a read during render.
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, amount: 0, targetAmount: 0 });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    // Below the lg breakpoint the headline is centred, so the cluster centres too.
    const splitQuery = window.matchMedia('(min-width: 1024px)');

    const apply = () => {
      setProfile(mobileQuery.matches ? CONFIG.mobile : CONFIG.desktop);
      setOffsetFraction(
        splitQuery.matches ? CONFIG.offsetFraction.desktop : CONFIG.offsetFraction.centred
      );
      setReducedMotion(motionQuery.matches);
    };
    apply();

    motionQuery.addEventListener('change', apply);
    mobileQuery.addEventListener('change', apply);
    splitQuery.addEventListener('change', apply);
    return () => {
      motionQuery.removeEventListener('change', apply);
      mobileQuery.removeEventListener('change', apply);
      splitQuery.removeEventListener('change', apply);
    };
  }, []);

  const cursorEnabled = !!profile?.cursor && !reducedMotion;

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

  // Nothing renders until the media queries have been read, which keeps the
  // scene from mounting once at the wrong size and rebuilding.
  if (!profile) return <div ref={wrapperRef} className="hero-spheres" aria-hidden="true" />;

  return (
    <div ref={wrapperRef} className="hero-spheres" aria-hidden="true">
      <div className="hero-spheres__glow" />
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={CONFIG.camera}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <Scene
          profile={profile}
          pointerRef={pointerRef}
          offsetFraction={offsetFraction}
          reducedMotion={reducedMotion}
        />
      </Canvas>
      {/* Below the split breakpoint the copy sits on top of the cluster, so a
          scrim goes over the canvas to keep the headline legible. */}
      <div className="hero-spheres__scrim" />
    </div>
  );
};

export default HeroSpheres;
