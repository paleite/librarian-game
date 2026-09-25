"use client";

import { playSecretCue } from "@/game/audio/sfx";
import {
  secretDefinitions,
  type SecretKeyId,
  type SecretRewardPresentation,
} from "@/game/content/secrets";
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

function displayKeyName(keyId: SecretKeyId): string {
  return keyId
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function rewardTitle(presentation: SecretRewardPresentation): string {
  if (presentation === "letter") {
    return "Principal's Letter";
  }

  if (presentation === "blue-potion") {
    return "Blue Capacity Potion";
  }

  return "Green Capacity Potion";
}

function RewardObject({
  presentation,
  color,
  onCollect,
}: {
  presentation: SecretRewardPresentation;
  color: string;
  onCollect: () => void;
}) {
  if (presentation === "letter") {
    return (
      <mesh
        position={[0, 0.34, -0.16]}
        rotation={[-0.18, 0.08, 0]}
        scale={[0.42, 0.035, 0.3]}
        userData={{
          getInteractionInfo: () => ({
            title: "Principal's Letter",
            action: "Read letter",
          }),
          mobileInteract: onCollect,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onCollect();
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#e7dcc0" roughness={0.78} />
      </mesh>
    );
  }

  const potionColor =
    presentation === "blue-potion" ? "#4f7fd4" : "#58a96c";

  return (
    <group position={[0, 0.4, -0.12]}>
      <mesh
        userData={{
          getInteractionInfo: () => ({
            title: rewardTitle(presentation),
            action: "Drink potion",
          }),
          mobileInteract: onCollect,
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
          onCollect();
        }}
      >
        <cylinderGeometry args={[0.095, 0.13, 0.28, 14]} />
        <meshStandardMaterial
          color={potionColor}
          emissive={potionColor}
          emissiveIntensity={0.2}
          transparent
          opacity={0.82}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.065, 0.075, 0.09, 12]} />
        <meshStandardMaterial color="#7b5b39" roughness={0.7} />
      </mesh>
      <pointLight color={color} intensity={0.35} distance={1.4} />
    </group>
  );
}

export function SecretObjects() {
  const collectedKeyIds = useGameStore((state) => state.collectedKeyIds);
  const openedSecretChestIds = useGameStore(
    (state) => state.openedSecretChestIds,
  );
  const unlockedMinorMagicIds = useGameStore(
    (state) => state.unlockedMinorMagicIds,
  );
  const collectSecretKey = useGameStore((state) => state.collectSecretKey);
  const openSecretChest = useGameStore((state) => state.openSecretChest);
  const collectSecretReward = useGameStore(
    (state) => state.collectSecretReward,
  );

  return (
    <>
      {secretDefinitions.map((secret) => {
        const transforms = transformByKey.get(secret.keyId);

        if (!transforms) {
          return null;
        }

        const hasKey = collectedKeyIds.includes(secret.keyId);
        const opened = openedSecretChestIds.includes(secret.keyId);
        const unlocked = unlockedMinorMagicIds.includes(secret.rewardId);
        const color = COLOR_BY_KEY[secret.keyId];
        const keyName = displayKeyName(secret.keyId);

        const collectKey = () => {
          collectSecretKey(secret.keyId);
          playSecretCue();
        };

        const openChest = () => {
          if (!hasKey || opened) {
            return;
          }

          openSecretChest(secret.keyId);
          playSecretCue();
        };

        const collectReward = () => {
          if (!opened || unlocked) {
            return;
          }

          collectSecretReward(secret.keyId);
          playSecretCue();
        };

        return (
          <group key={secret.keyId}>
            {!hasKey ? (
              <mesh
                position={transforms.keyTransform.position}
                rotation={transforms.keyTransform.rotation}
                userData={{
                  getInteractionInfo: () => ({
                    title: keyName,
                    action: "Collect key",
                  }),
                  mobileInteract: collectKey,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  collectKey();
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

            <group
              position={transforms.chestTransform.position}
              rotation={transforms.chestTransform.rotation}
            >
              <mesh
                position={[0, -0.02, 0]}
                scale={[0.72, 0.34, 0.52]}
                userData={{
                  getInteractionInfo: () => ({
                    title: `${keyName} Chest`,
                    subtitle: opened
                      ? unlocked
                        ? "Reward collected"
                        : "Chest opened"
                      : hasKey
                        ? "Matching key acquired"
                        : "Requires matching key",
                    action: hasKey && !opened ? "Open chest" : undefined,
                  }),
                  mobileInteract: openChest,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  openChest();
                }}
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={opened ? "#2d261f" : color}
                  emissive={hasKey && !opened ? color : "#000000"}
                  emissiveIntensity={hasKey && !opened ? 0.22 : 0}
                  metalness={0.25}
                  roughness={0.5}
                />
              </mesh>

              <mesh
                position={[
                  0,
                  opened ? 0.35 : 0.18,
                  opened ? 0.21 : 0,
                ]}
                rotation={[
                  opened ? -1.08 : 0,
                  0,
                  0,
                ]}
                scale={[0.72, 0.16, 0.52]}
              >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={opened ? "#493524" : color}
                  roughness={0.55}
                  metalness={0.2}
                />
              </mesh>

              {opened && !unlocked ? (
                <RewardObject
                  presentation={secret.rewardPresentation}
                  color={color}
                  onCollect={collectReward}
                />
              ) : null}
            </group>
          </group>
        );
      })}
    </>
  );
}
