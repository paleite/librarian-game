"use client";

import { secretDefinitions, type SecretKeyId } from "@/game/content/secrets";
import { secretWorldTransforms } from "@/game/layout/secret-transforms";
import { useGameStore } from "@/game/state/game-store";

const COLOR_BY_KEY: Record<SecretKeyId, string> = {
  "crimson-octagon": "#b32f3a",
  "golden-diamond": "#d9a52d",
  "emerald-club": "#2f9b63",
  "azure-star": "#367fb9",
};

const transformByKey = new Map(
  secretWorldTransforms.map((definition) => [definition.keyId, definition]),
);

export function SecretObjects() {
  const collectedKeyIds = useGameStore((state) => state.collectedKeyIds);
  const unlockedMinorMagicIds = useGameStore(
    (state) => state.unlockedMinorMagicIds,
  );
  const collectSecretKey = useGameStore((state) => state.collectSecretKey);
  const openSecretChest = useGameStore((state) => state.openSecretChest);

  return (
    <>
      {secretDefinitions.map((secret) => {
        const transforms = transformByKey.get(secret.keyId);

        if (!transforms) {
          return null;
        }

        const hasKey = collectedKeyIds.includes(secret.keyId);
        const unlocked = unlockedMinorMagicIds.includes(secret.rewardId);
        const color = COLOR_BY_KEY[secret.keyId];

        return (
          <group key={secret.keyId}>
            {!hasKey ? (
              <mesh
                position={transforms.keyTransform.position}
                rotation={transforms.keyTransform.rotation}
                userData={{
                  mobileInteract: () => collectSecretKey(secret.keyId),
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  collectSecretKey(secret.keyId);
                }}
              >
                <octahedronGeometry args={[0.18, 0]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.4}
                  metalness={0.35}
                  roughness={0.35}
                />
              </mesh>
            ) : null}

            <mesh
              position={transforms.chestTransform.position}
              rotation={transforms.chestTransform.rotation}
              scale={[0.72, 0.42, 0.52]}
              userData={{
                mobileInteract: () => openSecretChest(secret.keyId),
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                openSecretChest(secret.keyId);
              }}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color={unlocked ? "#2d261f" : color}
                emissive={hasKey && !unlocked ? color : "#000000"}
                emissiveIntensity={hasKey && !unlocked ? 0.22 : 0}
                metalness={0.25}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
