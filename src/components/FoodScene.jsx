import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/burger-layered.glb";
const TARGET_SIZE = 1.8;
const LAYER_SPREAD = 0.85; // Deep exploded effect; does not scale the bun or other meshes.

function LayeredBurger({ scrollProgressRef }) {
  const rootRef = useRef();
  const { scene } = useGLTF(MODEL_URL);

  const { model, parts, fitScale } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDimension;

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    clone.position.sub(center);
    wrapper.scale.setScalar(scale);
    wrapper.updateMatrixWorld(true);

    const meshes = [];
    const majorMeshes = [];

    clone.traverse((object) => {
      if (!object.isMesh || !object.geometry) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (object.material) {
        object.material = Array.isArray(object.material)
          ? object.material.map((material) => material.clone())
          : object.material.clone();
      }

      const vertexCount = object.geometry.attributes?.position?.count ?? 0;
      const worldBounds = new THREE.Box3().setFromObject(object);
      const worldSize = worldBounds.getSize(new THREE.Vector3());
      const worldCenter = worldBounds.getCenter(new THREE.Vector3());
      const largestDimension = Math.max(worldSize.x, worldSize.y, worldSize.z);

      const part = {
        object,
        originalPosition: object.position.clone(),
        originalRotation: object.rotation.clone(),
        centerY: worldCenter.y,
        vertexCount,
        largestDimension,
      };
      meshes.push(part);

      // These are the large ingredient meshes in this asset. Small sesame
      // seeds and garnish meshes will be attached to the nearest ingredient band.
      if (vertexCount > 1000 && largestDimension > maxDimension * 0.25) {
        majorMeshes.push(part);
      }
    });

    majorMeshes.sort((a, b) => a.centerY - b.centerY);

    // If the model contains several large ingredient meshes, use their center
    // heights as layer anchors. Attach smaller details to the nearest anchor.
    // This avoids animating every sesame seed as a separate ingredient.
    const anchors = majorMeshes.length >= 3 ? majorMeshes : meshes.filter(
      (part) => part.vertexCount > 1000
    ).sort((a, b) => a.centerY - b.centerY);

    const uniqueAnchors = [];
    anchors.forEach((anchor) => {
      const last = uniqueAnchors[uniqueAnchors.length - 1];
      if (!last || Math.abs(anchor.centerY - last.centerY) > maxDimension * 0.035) {
        uniqueAnchors.push(anchor);
      }
    });

    meshes.forEach((part) => {
      let nearest = 0;
      let distance = Infinity;
      uniqueAnchors.forEach((anchor, index) => {
        const d = Math.abs(part.centerY - anchor.centerY);
        if (d < distance) {
          distance = d;
          nearest = index;
        }
      });
      part.layerIndex = nearest;
    });

    return { model: wrapper, parts: meshes, fitScale: scale };
  }, [scene]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const raw = scrollProgressRef?.current?.value;
    const controlled = typeof raw === "number";
    const progress = controlled ? THREE.MathUtils.clamp(raw, 0, 1) : 0;

    // Keep the burger front-facing instead of turning it sideways.
    if (controlled) {
      root.rotation.set(0, 0, 0);
      root.position.y = 0;
    } else {
      root.rotation.y += delta * 0.025;
      root.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.01;
    }

    const maxLayer = Math.max(1, ...parts.map((part) => part.layerIndex));
    parts.forEach((part) => {
      const normalized = maxLayer > 0 ? part.layerIndex / maxLayer : 0.5;
      const centered = normalized - 0.5;

      // Move all meshes belonging to the same ingredient band together.
      const offset = (centered * LAYER_SPREAD * 2 * progress) / fitScale;
      part.object.position.y = part.originalPosition.y + offset;

      const twist = Math.sin(progress * Math.PI) * (normalized < 0.5 ? -1 : 1);
      part.object.rotation.x = part.originalRotation.x + twist * 0.035;
      part.object.rotation.z = part.originalRotation.z + twist * 0.025;
    });
  });

  return (
    <group ref={rootRef}>
      <primitive object={model} />
    </group>
  );
}

export default function FoodScene({ scrollProgressRef }) {
  return <LayeredBurger scrollProgressRef={scrollProgressRef} />;
}

useGLTF.preload(MODEL_URL);
