"use client";

import { RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

import { shelfRows } from "@/game/layout/shelf-rows";
import { shelfRowTransforms } from "@/game/layout/shelf-row-transforms";

const BOARD_DEPTH = 0.48;
const BOARD_THICKNESS = 0.075;
const BACK_DEPTH = 0.085;
const BOOK_CLEARANCE = 0.08;

const rowById = new Map(shelfRows.map((row) => [row.id, row]));

interface SectionCase {
  sectionCode: string;
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
}

function buildSectionCases(): SectionCase[] {
  const grouped = new Map<string, typeof shelfRowTransforms>();

  for (const rowTransform of shelfRowTransforms) {
    const row = rowById.get(rowTransform.rowId);

    if (!row) {
      continue;
    }

    grouped.set(row.sectionCode, [
      ...(grouped.get(row.sectionCode) ?? []),
      rowTransform,
    ]);
  }

  return [...grouped.entries()].map(([sectionCode, rows]) => {
    const yaw = rows[0].transform.rotation[1];
    const origin = new THREE.Vector3(...rows[0].transform.position);
    const inverseRotation = new THREE.Matrix4().makeRotationY(-yaw);
    const localPoints = rows.map((row) =>
      new THREE.Vector3(...row.transform.position)
        .sub(origin)
        .applyMatrix4(inverseRotation),
    );

    const minX = Math.min(...localPoints.map((point) => point.x));
    const maxX = Math.max(...localPoints.map((point) => point.x));
    const minY = Math.min(...localPoints.map((point) => point.y));
    const maxY = Math.max(...localPoints.map((point) => point.y));
    const maxRowWidth = Math.max(
      ...rows.map((row) => Math.max(0.9, row.capacity * 0.24)),
    );
    const width = Math.max(maxRowWidth, maxX - minX + maxRowWidth);
    const height = maxY - minY + 0.7;
    const localCenter = new THREE.Vector3(
      (minX + maxX) / 2,
      (minY + maxY) / 2 + 0.17,
      0.14,
    ).applyMatrix4(new THREE.Matrix4().makeRotationY(yaw));

    return {
      sectionCode,
      position: [
        origin.x + localCenter.x,
        origin.y + localCenter.y,
        origin.z + localCenter.z,
      ],
      rotationY: yaw,
      width,
      height,
    };
  });
}

const sectionCases = buildSectionCases();

export function ShelfFurniture() {
  const boardMeshRef = useRef<THREE.InstancedMesh>(null);
  const backMeshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const boards = boardMeshRef.current;
    const backs = backMeshRef.current;

    if (!boards || !backs) {
      return;
    }

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    for (let index = 0; index < shelfRowTransforms.length; index += 1) {
      const rowTransform = shelfRowTransforms[index];
      const width = Math.max(0.9, rowTransform.capacity * 0.24);
      const yaw = rowTransform.transform.rotation[1];

      euler.set(0, yaw, 0);
      quaternion.setFromEuler(euler);

      position.set(
        rowTransform.transform.position[0],
        rowTransform.transform.position[1] - BOOK_CLEARANCE,
        rowTransform.transform.position[2],
      );
      scale.set(width, BOARD_THICKNESS, BOARD_DEPTH);
      matrix.compose(position, quaternion, scale);
      boards.setMatrixAt(index, matrix);

      const backOffset = new THREE.Vector3(0, 0.19, 0.22).applyEuler(euler);
      position.set(
        rowTransform.transform.position[0] + backOffset.x,
        rowTransform.transform.position[1] + backOffset.y,
        rowTransform.transform.position[2] + backOffset.z,
      );
      scale.set(width, 0.42, BACK_DEPTH);
      matrix.compose(position, quaternion, scale);
      backs.setMatrixAt(index, matrix);
    }

    boards.count = shelfRowTransforms.length;
    backs.count = shelfRowTransforms.length;
    boards.instanceMatrix.needsUpdate = true;
    backs.instanceMatrix.needsUpdate = true;
    boards.computeBoundingSphere();
    backs.computeBoundingSphere();
  }, []);

  return (
    <>
      <instancedMesh
        ref={backMeshRef}
        args={[undefined, undefined, shelfRowTransforms.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#362417" roughness={0.86} />
      </instancedMesh>

      <instancedMesh
        ref={boardMeshRef}
        args={[undefined, undefined, shelfRowTransforms.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6a4328" roughness={0.78} />
      </instancedMesh>

      {sectionCases.map((sectionCase) => (
        <RigidBody
          colliders="cuboid"
          key={sectionCase.sectionCode}
          type="fixed"
          position={sectionCase.position}
          rotation={[0, sectionCase.rotationY, 0]}
        >
          <mesh
            castShadow
            receiveShadow
            scale={[
              sectionCase.width + 0.18,
              sectionCase.height + 0.25,
              0.32,
            ]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#4d301d"
              roughness={0.82}
            />
          </mesh>
        </RigidBody>
      ))}
    </>
  );
}
