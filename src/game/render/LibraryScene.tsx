import { RigidBody } from "@react-three/rapier";

const HALL_WIDTH = 18;
const HALL_LENGTH = 84;
const SECOND_FLOOR_Y = 4.6;
const WALL_HEIGHT = 9.4;
const STAIR_STEPS = 18;

function Staircase({ x }: { x: number }) {
  return (
    <group>
      {Array.from({ length: STAIR_STEPS }, (_, index) => {
        const progress = index / (STAIR_STEPS - 1);
        const height = 0.16 + progress * SECOND_FLOOR_Y;
        const z = 38 - progress * 9.6;

        return (
          <RigidBody
            colliders="cuboid"
            key={index}
            position={[x, height / 2, z]}
            type="fixed"
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[3.15, height, 0.72]} />
              <meshStandardMaterial color="#714a2d" roughness={0.78} />
            </mesh>
          </RigidBody>
        );
      })}
    </group>
  );
}

function BalconyFloor({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <RigidBody colliders="cuboid" position={position} type="fixed">
      <mesh receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#39291f" roughness={0.88} />
      </mesh>
    </RigidBody>
  );
}

function BalconyRail({
  x,
  z,
  length,
}: {
  x: number;
  z: number;
  length: number;
}) {
  return (
    <RigidBody
      colliders="cuboid"
      position={[x, SECOND_FLOOR_Y + 0.62, z]}
      type="fixed"
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.16, 1.24, length]} />
        <meshStandardMaterial color="#604026" roughness={0.76} />
      </mesh>
    </RigidBody>
  );
}

function ReadingTable({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <RigidBody colliders="cuboid" type="fixed">
        <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
          <boxGeometry args={[5.6, 0.18, 1.85]} />
          <meshStandardMaterial color="#654128" roughness={0.76} />
        </mesh>
      </RigidBody>

      {[
        [-2.35, 0.43, -0.65],
        [2.35, 0.43, -0.65],
        [-2.35, 0.43, 0.65],
        [2.35, 0.43, 0.65],
      ].map((leg, index) => (
        <mesh
          castShadow
          key={index}
          position={leg as [number, number, number]}
          scale={[0.22, 0.86, 0.22]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4c2f1d" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

export function LibraryScene() {
  return (
    <>
      <RigidBody colliders="cuboid" type="fixed">
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, 0.5, HALL_LENGTH]} />
          <meshStandardMaterial color="#3a2d22" roughness={0.92} />
        </mesh>
      </RigidBody>

      {/* Source-like second-floor perimeter balcony: open atrium in the middle. */}
      <BalconyFloor
        position={[-7, SECOND_FLOOR_Y - 0.18, -4]}
        size={[4, 0.36, 68]}
      />
      <BalconyFloor
        position={[7, SECOND_FLOOR_Y - 0.18, -4]}
        size={[4, 0.36, 68]}
      />
      <BalconyFloor
        position={[0, SECOND_FLOOR_Y - 0.18, -38]}
        size={[18, 0.36, 8]}
      />
      <BalconyFloor
        position={[0, SECOND_FLOOR_Y - 0.18, 28]}
        size={[18, 0.36, 8]}
      />

      <BalconyRail x={-4.92} z={-4} length={60} />
      <BalconyRail x={4.92} z={-4} length={60} />

      <RigidBody
        colliders="cuboid"
        position={[-HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]}
        type="fixed"
      >
        <mesh receiveShadow>
          <boxGeometry args={[0.5, WALL_HEIGHT, HALL_LENGTH]} />
          <meshStandardMaterial color="#251b15" roughness={0.86} />
        </mesh>
      </RigidBody>

      <RigidBody
        colliders="cuboid"
        position={[HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]}
        type="fixed"
      >
        <mesh receiveShadow>
          <boxGeometry args={[0.5, WALL_HEIGHT, HALL_LENGTH]} />
          <meshStandardMaterial color="#251b15" roughness={0.86} />
        </mesh>
      </RigidBody>

      <RigidBody
        colliders="cuboid"
        position={[0, WALL_HEIGHT / 2, -HALL_LENGTH / 2]}
        type="fixed"
      >
        <mesh receiveShadow>
          <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
          <meshStandardMaterial color="#251b15" roughness={0.86} />
        </mesh>
      </RigidBody>

      <RigidBody colliders="cuboid" type="fixed">
        <mesh position={[0, WALL_HEIGHT + 0.2, 0]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, 0.4, HALL_LENGTH]} />
          <meshStandardMaterial color="#19120e" roughness={0.9} />
        </mesh>
      </RigidBody>

      <Staircase x={-6.25} />
      <Staircase x={6.25} />

      <ReadingTable position={[0, 0, 10]} />
      <ReadingTable position={[0, 0, -7]} />
      <ReadingTable position={[0, 0, -24]} />
    </>
  );
}
