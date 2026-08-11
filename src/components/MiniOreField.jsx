import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MiniFieldInstanced({ count = 18 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.28, 0), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0.15 }),
    [],
  );

  const placements = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 2.4;
      const y = (Math.random() - 0.5) * 1.6;
      const s = 0.6 + Math.random() * 0.9;
      arr.push({ a, r, y, s, rx: Math.random() * 2, rz: Math.random() * 2 });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scroll =
      typeof window !== "undefined"
        ? window.scrollY /
          Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1,
          )
        : 0;
    if (!meshRef.current) return;
    for (let i = 0; i < placements.length; i++) {
      const p = placements[i];
      const ang = p.a + t * 0.08 + scroll * (i % 3 === 0 ? 2.1 : 1.2);
      const x = Math.cos(ang) * p.r + Math.sin(t * 0.14 + i) * 0.28;
      const z = Math.sin(ang) * p.r + Math.cos(t * 0.11 + i) * 0.28;
      dummy.position.set(x, p.y + Math.sin(t * 0.6 + i) * 0.08, z);
      dummy.rotation.set(
        p.rx + t * 0.4 * (i % 2 ? 1 : -1),
        t * 0.6 + p.rz,
        p.rx * 0.5 + t * 0.2,
      );
      dummy.scale.setScalar(p.s * (1 + Math.sin(t * 0.9 + i) * 0.06));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      const color = new THREE.Color().setHSL(
        0.06 + (i / placements.length) * 0.08,
        0.34,
        0.45 + (i % 2) * 0.06,
      );
      meshRef.current.setColorAt && meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor &&
      (meshRef.current.instanceColor.needsUpdate = true);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, mat, count]}
      castShadow
      receiveShadow
    ></instancedMesh>
  );
}

export default function MiniOreField({ className = "", style = {} }) {
  return (
    <div className={className} style={{ ...style, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0.2, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={0.8}
          color="#ffd9b8"
        />
        <directionalLight
          position={[-4, -2, -3]}
          intensity={0.6}
          color="#58d3c8"
        />
        <MiniFieldInstanced count={18} />
      </Canvas>
    </div>
  );
}
