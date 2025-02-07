import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const FirefliesBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create scene and set background to black
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 100;

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    // Create fireflies particles
    const particleCount = 200; // You can change this number if you want more or fewer fireflies
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const range = 200; // This defines the space range for initial positions

    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;
      // Set random starting positions
      positions[index] = (Math.random() - 0.5) * range;
      positions[index + 1] = (Math.random() - 0.5) * range;
      positions[index + 2] = (Math.random() - 0.5) * range;

      // Set random small velocities
      velocities[index] = (Math.random() - 0.5) * 0.2;
      velocities[index + 1] = (Math.random() - 0.5) * 0.2;
      velocities[index + 2] = (Math.random() - 0.5) * 0.2;
    }

    // Create BufferGeometry and assign positions
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create a material that makes the particles glow a bit
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create the Points object (our fireflies)
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let frameId: number;
    const animate = () => {
      // Update particle positions based on their velocities
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];

        // If a particle goes out of bounds, wrap it around to the other side
        if (positions[index] > range / 2) positions[index] = -range / 2;
        else if (positions[index] < -range / 2) positions[index] = range / 2;

        if (positions[index + 1] > range / 2) positions[index + 1] = -range / 2;
        else if (positions[index + 1] < -range / 2)
          positions[index + 1] = range / 2;

        if (positions[index + 2] > range / 2) positions[index + 2] = -range / 2;
        else if (positions[index + 2] < -range / 2)
          positions[index + 2] = range / 2;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle window resize events
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default FirefliesBackground;
