"use client";

import { RigidBody } from "@react-three/rapier";

function EntranceCrest() {
  return (
    <group position={[0, 2.55, 39.25]}>
      <mesh rotation={[0, 0, Math.PI / 4]} scale={[0.72, 0.72, 0.16]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#7f5b31"
          metalness={0.18}
          roughness={0.48}
        />
      </mesh>
      <mesh position={[0, 0, 0.12]} scale={[0.54, 0.54, 0.08]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#9c713e"
          metalness={0.28}
          roughness={0.38}
        />
      </mesh>
    </group>
  );
}

function StairVase() {
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={[4.55, 1.02, 35.6]}
    >
      <group>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.34, 0.44, 0.8, 18]} />
          <meshStandardMaterial color="#d9d3c3" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.58, 0]}>
          <torusGeometry args={[0.31, 0.055, 10, 24]} />
          <meshStandardMaterial color="#eee8db" roughness={0.38} />
        </mesh>
      </group>
    </RigidBody>
  );
}

function ScaleTable() {
  return (
    <group>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[-2.65, 0.7, 22.6]}
      >
        <mesh scale={[2.5, 0.16, 1.45]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5b3821" roughness={0.82} />
        </mesh>
      </RigidBody>

      <group position={[-2.65, 1.02, 22.6]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.055, 0.07, 0.46, 12]} />
          <meshStandardMaterial color="#9a7b46" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.95, 10]} />
          <meshStandardMaterial color="#9a7b46" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[-0.42, 0.2, 0]}>
          <cylinderGeometry args={[0.28, 0.34, 0.06, 18]} />
          <meshStandardMaterial color="#b1965d" metalness={0.42} roughness={0.4} />
        </mesh>
        <mesh position={[0.42, 0.2, 0]}>
          <cylinderGeometry args={[0.28, 0.34, 0.06, 18]} />
          <meshStandardMaterial color="#b1965d" metalness={0.42} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

function EmeraldBenchPile() {
  const pileBooks = Array.from({ length: 14 }, (_, index) => ({
    x: -3.8 + ((index % 4) - 1.5) * 0.22,
    y: 1.04 + Math.floor(index / 4) * 0.065,
    z: 22.7 + ((index * 7) % 5 - 2) * 0.07,
    yaw: ((index * 37) % 100) / 100 - 0.5,
  }));

  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" position={[-3.8, 0.62, 22.7]}>
        <mesh scale={[1.9, 0.25, 0.78]} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#5a3923" roughness={0.84} />
        </mesh>
      </RigidBody>

      {pileBooks.map((book, index) => (
        <mesh
          castShadow
          key={index}
          position={[book.x, book.y, book.z]}
          rotation={[0.05, book.yaw, index % 2 === 0 ? 0.04 : -0.03]}
          scale={[0.34, 0.055, 0.22]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={index % 3 === 0 ? "#6d4a31" : index % 3 === 1 ? "#4b536d" : "#775849"}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export function LibraryLandmarks() {
  return (
    <>
      <EntranceCrest />
      <StairVase />
      <ScaleTable />
      <EmeraldBenchPile />
    </>
  );
}
