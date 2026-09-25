import { RigidBody } from "@react-three/rapier";

const shelfZPositions = [-5.5, -2.75, 0, 2.75, 5.5] as const;

export function LibraryScene() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[18, 0.5, 18]} />
          <meshStandardMaterial color="#3a2d22" roughness={0.9} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 3, -9]} receiveShadow>
          <boxGeometry args={[18, 6, 0.5]} />
          <meshStandardMaterial color="#241b15" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-9, 3, 0]} receiveShadow>
          <boxGeometry args={[0.5, 6, 18]} />
          <meshStandardMaterial color="#241b15" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[9, 3, 0]} receiveShadow>
          <boxGeometry args={[0.5, 6, 18]} />
          <meshStandardMaterial color="#241b15" />
        </mesh>
      </RigidBody>

      {shelfZPositions.map((zPosition, index) => (
        <RigidBody
          key={zPosition}
          type="fixed"
          colliders="cuboid"
          position={[index % 2 === 0 ? -4.5 : 4.5, 1.4, zPosition]}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.5, 2.8, 0.7]} />
            <meshStandardMaterial color="#5a3d28" roughness={0.8} />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
