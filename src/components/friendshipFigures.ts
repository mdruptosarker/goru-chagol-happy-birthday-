import * as THREE from 'three';
import { SceneId } from '../types';

export interface FriendshipDuo {
  group: THREE.Group;
  update: (elapsed: number, delta: number, currentScene: SceneId) => void;
  dispose: () => void;
}

/**
 * Creates two stylized, minimalist friendship figures representing
 * the user and Bushra in a graceful, non-romantic, storybook aesthetic.
 */
export function createFriendshipFigures(): FriendshipDuo {
  const group = new THREE.Group();
  group.name = 'FriendshipDuo';

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#FFE8D6',
    roughness: 0.5,
    metalness: 0.05,
  });

  // Bushra's styling (Soft Electric Lavender & Rose)
  const bushraCoatMat = new THREE.MeshStandardMaterial({
    color: '#6B46C1', // Royal lavender
    roughness: 0.4,
    metalness: 0.1,
  });
  const bushraScarfMat = new THREE.MeshStandardMaterial({
    color: '#FFB6D9', // Soft celebratory pink
    roughness: 0.35,
  });

  // Best Friend / User's styling (Deep Indigo & Champagne Gold)
  const friendCoatMat = new THREE.MeshStandardMaterial({
    color: '#312E81', // Deep indigo
    roughness: 0.4,
    metalness: 0.1,
  });
  const friendScarfMat = new THREE.MeshStandardMaterial({
    color: '#F5D58A', // Champagne gold
    roughness: 0.35,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: '#F5D58A',
    metalness: 0.8,
    roughness: 0.2,
  });

  // Helper to build one stylized character
  function buildFigure(isBushra: boolean) {
    const fig = new THREE.Group();

    // Body / Coat (Cone/Cylinder tapered coat)
    const coatGeo = new THREE.CylinderGeometry(0.12, 0.22, 0.55, 18);
    const coat = new THREE.Mesh(coatGeo, isBushra ? bushraCoatMat : friendCoatMat);
    coat.position.y = 0.38;
    coat.castShadow = true;
    fig.add(coat);

    // Scarf / Collar
    const scarfGeo = new THREE.TorusGeometry(0.13, 0.04, 12, 24);
    const scarf = new THREE.Mesh(scarfGeo, isBushra ? bushraScarfMat : friendScarfMat);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 0.65;
    fig.add(scarf);

    // Head
    const headGeo = new THREE.SphereGeometry(0.13, 20, 20);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 0.82;
    head.castShadow = true;
    fig.add(head);

    // Hair / Beanie
    const hairGeo = new THREE.SphereGeometry(0.14, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const hairMat = new THREE.MeshStandardMaterial({
      color: isBushra ? '#2D1B4E' : '#1E1B38',
      roughness: 0.8,
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.85;
    fig.add(hair);

    // Head accessory: Bushra has a delicate golden 15th birthday star circlet
    if (isBushra) {
      const circletGeo = new THREE.TorusGeometry(0.145, 0.015, 8, 24);
      const circlet = new THREE.Mesh(circletGeo, goldAccentMat);
      circlet.rotation.x = Math.PI / 2;
      circlet.position.y = 0.93;
      fig.add(circlet);

      const tinyStarGeo = new THREE.OctahedronGeometry(0.035);
      const tinyStar = new THREE.Mesh(tinyStarGeo, goldAccentMat);
      tinyStar.position.set(0, 0.98, 0.12);
      fig.add(tinyStar);
    }

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12);
    armGeo.translate(0, -0.15, 0);

    const leftArm = new THREE.Mesh(armGeo, isBushra ? bushraCoatMat : friendCoatMat);
    leftArm.position.set(-0.16, 0.62, 0);
    fig.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, isBushra ? bushraCoatMat : friendCoatMat);
    rightArm.position.set(0.16, 0.62, 0);
    fig.add(rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.3, 12);
    legGeo.translate(0, -0.15, 0);

    const leftLeg = new THREE.Mesh(legGeo, isBushra ? bushraCoatMat : friendCoatMat);
    leftLeg.position.set(-0.08, 0.12, 0);
    fig.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, isBushra ? bushraCoatMat : friendCoatMat);
    rightLeg.position.set(0.08, 0.12, 0);
    fig.add(rightLeg);

    return { fig, head, leftArm, rightArm, leftLeg, rightLeg };
  }

  const friend = buildFigure(false); // User
  const bushra = buildFigure(true);  // Bushra

  // Base platform for sitting/standing
  const benchGeo = new THREE.BoxGeometry(1.2, 0.08, 0.45);
  const benchMat = new THREE.MeshStandardMaterial({
    color: '#251947',
    roughness: 0.4,
    metalness: 0.3,
  });
  const bench = new THREE.Mesh(benchGeo, benchMat);
  bench.position.set(0, -0.04, 0);
  bench.receiveShadow = true;
  group.add(bench);

  // Floating friendship starlight between them
  const friendshipStarGeo = new THREE.OctahedronGeometry(0.06);
  const friendshipStarMat = new THREE.MeshBasicMaterial({ color: '#F5D58A' });
  const friendshipStar = new THREE.Mesh(friendshipStarGeo, friendshipStarMat);
  friendshipStar.position.set(0, 0.65, 0.18);
  group.add(friendshipStar);

  // Position characters side by side
  friend.fig.position.set(-0.32, 0, 0);
  bushra.fig.position.set(0.32, 0, 0);

  group.add(friend.fig);
  group.add(bushra.fig);

  // Targets for smooth scene transitions
  const targetGroupPos = new THREE.Vector3();
  const targetGroupRot = new THREE.Euler();
  let targetGroupScale = 1.0;

  function update(elapsed: number, delta: number, currentScene: SceneId) {
    // Gentle idling breathing & head gestures
    const breathe = Math.sin(elapsed * 2.0) * 0.015;
    friend.fig.position.y = breathe;
    bushra.fig.position.y = Math.sin(elapsed * 2.0 + 0.4) * 0.015;

    // Friendship star pulse
    friendshipStar.rotation.y = elapsed * 1.5;
    friendshipStar.rotation.x = elapsed * 0.8;
    friendshipStar.position.y = 0.65 + Math.sin(elapsed * 3.0) * 0.04;

    // Choreograph gentle character interactions based on scene
    if (currentScene === 'opening') {
      // Sitting quietly on celestial ledge, looking at the stars together
      targetGroupPos.set(0, -0.85, 1.2);
      targetGroupRot.set(0, 0, 0);
      targetGroupScale = 1.0;
      bench.visible = true;

      // Slight head turns toward each other and toward sky
      friend.head.rotation.y = THREE.MathUtils.damp(friend.head.rotation.y, Math.sin(elapsed * 0.6) * 0.25 + 0.15, 3, delta);
      bushra.head.rotation.y = THREE.MathUtils.damp(bushra.head.rotation.y, -Math.sin(elapsed * 0.6) * 0.25 - 0.15, 3, delta);
      friend.head.rotation.x = -0.15 + Math.sin(elapsed * 0.4) * 0.08;
      bushra.head.rotation.x = -0.18 + Math.sin(elapsed * 0.4 + 0.5) * 0.08;

      // Arms resting casually on bench
      friend.leftArm.rotation.x = 0.4;
      friend.rightArm.rotation.x = 0.35;
      bushra.leftArm.rotation.x = 0.35;
      bushra.rightArm.rotation.x = 0.4;

      // Sitting legs
      friend.leftLeg.rotation.x = 1.35;
      friend.rightLeg.rotation.x = 1.35;
      bushra.leftLeg.rotation.x = 1.35;
      bushra.rightLeg.rotation.x = 1.35;

    } else if (currentScene === 'birthday') {
      // Standing on the left side of the cake, clapping / excited for 15th milestone
      targetGroupPos.set(-2.0, -0.5, 0.4);
      targetGroupRot.set(0, 0.45, 0);
      targetGroupScale = 1.1;
      bench.visible = false;

      // Straight standing legs
      friend.leftLeg.rotation.x = 0;
      friend.rightLeg.rotation.x = 0;
      bushra.leftLeg.rotation.x = 0;
      bushra.rightLeg.rotation.x = 0;

      // Looking toward the cake
      friend.head.rotation.y = 0.3;
      friend.head.rotation.x = -0.05;
      bushra.head.rotation.y = 0.2;
      bushra.head.rotation.x = 0.05;

      // Gentle celebratory arm gestures
      friend.leftArm.rotation.x = -0.6 + Math.sin(elapsed * 4.0) * 0.15;
      friend.rightArm.rotation.x = -0.6 + Math.sin(elapsed * 4.0) * 0.15;
      bushra.leftArm.rotation.x = -0.8 + Math.cos(elapsed * 4.0) * 0.2;
      bushra.rightArm.rotation.x = -0.8 + Math.cos(elapsed * 4.0) * 0.2;

    } else if (currentScene === 'memories') {
      // Sitting quietly together, looking at the photo constellation
      targetGroupPos.set(0, -1.1, 1.8);
      targetGroupRot.set(0, 0, 0);
      targetGroupScale = 0.9;
      bench.visible = true;

      // Sitting legs
      friend.leftLeg.rotation.x = 1.35;
      friend.rightLeg.rotation.x = 1.35;
      bushra.leftLeg.rotation.x = 1.35;
      bushra.rightLeg.rotation.x = 1.35;

      // Looking up at photo gallery
      friend.head.rotation.x = -0.35 + Math.sin(elapsed * 0.8) * 0.08;
      bushra.head.rotation.x = -0.35 + Math.cos(elapsed * 0.8) * 0.08;
      friend.head.rotation.y = 0.1;
      bushra.head.rotation.y = -0.1;

      // Bushra points gently toward memories
      bushra.rightArm.rotation.x = -1.2 + Math.sin(elapsed * 1.5) * 0.1;
      bushra.rightArm.rotation.z = -0.2;
      friend.rightArm.rotation.x = 0.3;

    } else if (currentScene === 'timeline') {
      // Walking side-by-side gently through the chapters
      targetGroupPos.set(0, -0.9, 1.5);
      targetGroupRot.set(0, Math.sin(elapsed * 0.3) * 0.15, 0);
      targetGroupScale = 1.0;
      bench.visible = false;

      // Subtle synchronized walking cycle
      const walkCycle = Math.sin(elapsed * 3.5);
      friend.leftLeg.rotation.x = walkCycle * 0.35;
      friend.rightLeg.rotation.x = -walkCycle * 0.35;
      bushra.leftLeg.rotation.x = -walkCycle * 0.35;
      bushra.rightLeg.rotation.x = walkCycle * 0.35;

      friend.leftArm.rotation.x = -walkCycle * 0.25;
      friend.rightArm.rotation.x = walkCycle * 0.25;
      bushra.leftArm.rotation.x = walkCycle * 0.25;
      bushra.rightArm.rotation.x = -walkCycle * 0.25;

      // Looking forward together
      friend.head.rotation.set(-0.05, 0.05, 0);
      bushra.head.rotation.set(-0.05, -0.05, 0);

    } else if (currentScene === 'letter') {
      // Sitting quietly in contemplation, listening to the letter
      targetGroupPos.set(1.4, -0.6, 0.5);
      targetGroupRot.set(0, -0.5, 0);
      targetGroupScale = 0.95;
      bench.visible = true;

      // Sitting legs
      friend.leftLeg.rotation.x = 1.35;
      friend.rightLeg.rotation.x = 1.35;
      bushra.leftLeg.rotation.x = 1.35;
      bushra.rightLeg.rotation.x = 1.35;

      // Attentive, gentle tilt
      friend.head.rotation.y = 0.25;
      bushra.head.rotation.y = -0.3;
      friend.head.rotation.x = 0.1;
      bushra.head.rotation.x = 0.12;

      // Hands folded respectfully
      friend.leftArm.rotation.x = 0.5;
      friend.rightArm.rotation.x = 0.5;
      bushra.leftArm.rotation.x = 0.5;
      bushra.rightArm.rotation.x = 0.5;

    } else if (currentScene === 'promise') {
      // Standing beside the glass heart platform, looking at the glowing heart
      targetGroupPos.set(-1.4, -0.4, 0.6);
      targetGroupRot.set(0, 0.6, 0);
      targetGroupScale = 1.05;
      bench.visible = false;

      // Standing legs
      friend.leftLeg.rotation.x = 0;
      friend.rightLeg.rotation.x = 0;
      bushra.leftLeg.rotation.x = 0;
      bushra.rightLeg.rotation.x = 0;

      // Looking at the glass heart
      friend.head.rotation.set(-0.25, 0.4, 0);
      bushra.head.rotation.set(-0.25, 0.35, 0);

      // Reaching out toward the friendship star / heart
      friend.rightArm.rotation.x = -1.1 + Math.sin(elapsed * 2.0) * 0.05;
      bushra.leftArm.rotation.x = -1.1 + Math.sin(elapsed * 2.0) * 0.05;

    } else if (currentScene === 'celebration') {
      // Center stage celebration, waving happily together under the fireworks
      targetGroupPos.set(0, -0.65, 1.4);
      targetGroupRot.set(0, 0, 0);
      targetGroupScale = 1.15;
      bench.visible = false;

      // Standing
      friend.leftLeg.rotation.x = 0;
      friend.rightLeg.rotation.x = 0;
      bushra.leftLeg.rotation.x = 0;
      bushra.rightLeg.rotation.x = 0;

      // Happy waving arms
      friend.leftArm.rotation.x = -1.5 + Math.sin(elapsed * 5.0) * 0.25;
      friend.leftArm.rotation.z = -0.35;
      bushra.rightArm.rotation.x = -1.5 + Math.cos(elapsed * 5.0) * 0.25;
      bushra.rightArm.rotation.z = 0.35;

      // Facing forward with slight happy nod
      friend.head.rotation.y = Math.sin(elapsed * 2.0) * 0.15;
      bushra.head.rotation.y = -Math.sin(elapsed * 2.0) * 0.15;
    }

    // Smoothly damp group position and rotation
    group.position.x = THREE.MathUtils.damp(group.position.x, targetGroupPos.x, 3.0, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, targetGroupPos.y, 3.0, delta);
    group.position.z = THREE.MathUtils.damp(group.position.z, targetGroupPos.z, 3.0, delta);

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetGroupRot.x, 3.0, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetGroupRot.y, 3.0, delta);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, targetGroupRot.z, 3.0, delta);

    const curScale = group.scale.x;
    const nextScale = THREE.MathUtils.damp(curScale, targetGroupScale, 3.0, delta);
    group.scale.set(nextScale, nextScale, nextScale);
  }

  function dispose() {
    skinMat.dispose();
    bushraCoatMat.dispose();
    bushraScarfMat.dispose();
    friendCoatMat.dispose();
    friendScarfMat.dispose();
    goldAccentMat.dispose();
    benchGeo.dispose();
    benchMat.dispose();
    friendshipStarGeo.dispose();
    friendshipStarMat.dispose();
  }

  return { group, update, dispose };
}
