import { RigidBody } from "@react-three/rapier";

const HALL_WIDTH = 18;
const HALL_LENGTH = 84;
const SECOND_FLOOR_Y = 4.6;
const WALL_HEIGHT = 9.4;
const STAIR_STEPS = 16;

function Staircase() {
  return (
    <group>
      {Array.from({ length: STAIR_STEPS }, (_, index) => {
        const progress = index / (STAIR_STEPS - 1);
        const y = 0.14 + progress * SECOND_FLOOR_Y;
        const z = 39 - progress * 10;

        return (
          <RigidBody
            key={index}
            type="fixed"
            colliders="cuboid"
            position={[0, y / 2, z]}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.4, y, 0.75]} />
              <meshStandardMaterial color="#69472e" roughness={0.82} />
            </mesh>
          </RigidBody>
        );
      })}
    </group>
  );
}

export function LibraryScene() {
  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, 0.5, HALL_LENGTH]} />
          <meshStandardMaterial color="#3a2d22" roughness={0.92} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, SECOND_FLOOR_Y - 0.18, -5.5]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, 0.36, 73]} />
          <meshStandardMaterial color="#33271f" roughness={0.9} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, WALL_HEIGHT, HALL_LENGTH]} />
          <meshStandardMaterial color="#241b15" roughness={0.88} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[HALL_WIDTH / 2, WALL_HEIGHT / 2, 0]} receiveShadow>
          <boxGeometry args={[0.5, WALL_HEIGHT, HALL_LENGTH]} />
          <meshStandardMaterial color="#241b15" roughness={0.88} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, WALL_HEIGHT / 2, -HALL_LENGTH / 2]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, WALL_HEIGHT, 0.5]} />
          <meshStandardMaterial color="#241b15" roughness={0.88} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, WALL_HEIGHT + 0.2, 0]} receiveShadow>
          <boxGeometry args={[HALL_WIDTH, 0.4, HALL_LENGTH]} />
          <meshStandardMaterial color="#19120e" roughness={0.9} />
        </mesh>
      </RigidBody>

      <Staircase />

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-3.8, 0.55, 8]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.1, 7.2]} />
          <meshStandardMaterial color="#4b3324" roughness={0.78} />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[3.8, 0.55, -7]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.1, 7.2]} />
          <meshStandardMaterial color="#4b3324" roughness={0.78} />
        </mesh>
      </RigidBody>
    </>
  );
}
