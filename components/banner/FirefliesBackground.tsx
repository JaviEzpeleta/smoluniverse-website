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
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const range = 200;
    const maxSpeed = 0.3; // Maximum speed for the particles

    for (let i = 0; i < particleCount; i++) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * range;
      positions[index + 1] = (Math.random() - 0.5) * range;
      positions[index + 2] = (Math.random() - 0.5) * range;

      // Initialize with random velocities
      velocities[index] = (Math.random() - 0.5) * maxSpeed;
      velocities[index + 1] = (Math.random() - 0.5) * maxSpeed;
      velocities[index + 2] = (Math.random() - 0.5) * maxSpeed;
    }

    // Create BufferGeometry and assign positions
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Create a material that makes the particles glow like fireflies
    const material = new THREE.PointsMaterial({
      color: 0xffcf75, // Warm yellow color
      size: 3, // Slightly larger size
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      map: createFireflyTexture(),
      depthWrite: false,
    });

    // Create a circular, glowing texture for the particles
    function createFireflyTexture() {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext("2d");
      if (!context) return null;

      // Create radial gradient
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 207, 117, 1)"); // Core: warm yellow
      gradient.addColorStop(0.3, "rgba(255, 207, 117, 0.5)"); // Mid: fading yellow
      gradient.addColorStop(1, "rgba(255, 207, 117, 0)"); // Edge: transparent

      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);

      return new THREE.CanvasTexture(canvas);
    }

    // Create the Points object (our fireflies)
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    let frameId: number;
    const animate = () => {
      // Update particle positions based on their velocities
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;

        // Randomly change velocities slightly each frame
        velocities[index] += (Math.random() - 0.5) * 0.01;
        velocities[index + 1] += (Math.random() - 0.5) * 0.01;
        velocities[index + 2] += (Math.random() - 0.5) * 0.01;

        // Limit maximum speed
        velocities[index] = Math.max(
          Math.min(velocities[index], maxSpeed),
          -maxSpeed
        );
        velocities[index + 1] = Math.max(
          Math.min(velocities[index + 1], maxSpeed),
          -maxSpeed
        );
        velocities[index + 2] = Math.max(
          Math.min(velocities[index + 2], maxSpeed),
          -maxSpeed
        );

        positions[index] += velocities[index];
        positions[index + 1] += velocities[index + 1];
        positions[index + 2] += velocities[index + 2];

        // Wrap around boundaries with some padding
        const padding = 10;
        if (Math.abs(positions[index]) > range / 2 + padding) {
          positions[index] =
            -Math.sign(positions[index]) * (range / 2 + padding);
        }
        if (Math.abs(positions[index + 1]) > range / 2 + padding) {
          positions[index + 1] =
            -Math.sign(positions[index + 1]) * (range / 2 + padding);
        }
        if (Math.abs(positions[index + 2]) > range / 2 + padding) {
          positions[index + 2] =
            -Math.sign(positions[index + 2]) * (range / 2 + padding);
        }
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
