import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { Globe2, MessageCircle, ArrowRight, ShieldCheck, Zap, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

function Interactive3DGlobeCanvas({ activeCity, onSelectHub }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 3D Wireframe Earth Sphere
    const sphereGeo = new THREE.SphereGeometry(8, 28, 28);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xFF4D00,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const earth = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(earth);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(7.7, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x141414,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Hub Coordinates on 3D Sphere (Lat, Long converted to Vector3)
    const hubCoords = [
      { name: 'Mumbai', lat: 19.076, lon: 72.877, color: 0xFFC72E },
      { name: 'San Francisco', lat: 37.7749, lon: -122.4194, color: 0xFF4D00 },
      { name: 'London', lat: 51.5074, lon: -0.1278, color: 0x25D366 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0xFFC72E },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0xFF4D00 },
      { name: 'Zurich', lat: 47.3769, lon: 8.5417, color: 0x25D366 },
    ];

    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const markersGroup = new THREE.Group();

    hubCoords.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, 8.2);
      const markerGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      markersGroup.add(marker);

      // Outer Pulsing Ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.65, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      markersGroup.add(ring);
    });

    earth.add(markersGroup);

    // Connecting Arcs (Spline Curve) between Mumbai and other hubs
    const mumbaiPos = latLonToVector3(19.076, 72.877, 8.2);
    hubCoords.slice(1).forEach((hub) => {
      const destPos = latLonToVector3(hub.lat, hub.lon, 8.2);
      const midPoint = new THREE.Vector3().addVectors(mumbaiPos, destPos).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(10.5); // Arc height

      const curve = new THREE.QuadraticBezierCurve3(mumbaiPos, midPoint, destPos);
      const points = curve.getPoints(30);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0xFFC72E,
        transparent: true,
        opacity: 0.35,
      });
      const curveLine = new THREE.Line(curveGeo, curveMat);
      earth.add(curveLine);
    });

    // Drag interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      earth.rotation.y += deltaX * 0.008;
      earth.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    currentMount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const onResize = () => {
      if (!currentMount) return;
      const newW = currentMount.clientWidth;
      const newH = currentMount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        earth.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      currentMount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      title="Click and drag to rotate the 3D Worldwide Mesh Globe"
    >
      <div className="absolute top-2 left-2 px-3 py-1 rounded-full bg-[#FAF7EE]/10 border border-[#FAF7EE]/20 text-[10px] font-mono text-[#FFC72E] flex items-center gap-1.5 backdrop-blur-md">
        <Radio className="size-3 animate-pulse text-[#25D366]" />
        <span>3D ROTATING MESH • DRAG TO EXPLORE</span>
      </div>
    </div>
  );
}

export default function WorldwideGlobe() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  return (
    <section id="worldwide" className="relative py-16 sm:py-28 bg-[#141414] text-[#FAF7EE] border-b-2 border-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <p className="font-display text-xs sm:text-sm font-black tracking-[0.2em] text-[#FF4D00] uppercase flex items-center gap-2">
              <Zap className="size-4 text-[#FFC72E]" />
              <span>3D DISTRIBUTED DEPLOYMENT MESH</span>
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#FAF7EE]">
              WORLDWIDE HUBS & NODES
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#FAF7EE]/70">
            Global senior engineers operating across key financial and tech hubs with sub-20ms latency and 24/7 coverage.
          </p>
        </div>

        {/* 3D Globe Interactive Canvas Card */}
        <div className="mb-12 rounded-3xl border-2 border-[#FAF7EE]/20 bg-[#FAF7EE]/5 p-4 sm:p-6 backdrop-blur-md shadow-[6px_6px_0_0_#FF4D00] overflow-hidden">
          <Interactive3DGlobeCanvas activeCity={selectedCity} onSelectHub={setSelectedCity} />
        </div>

        {/* Hubs Grid with 3D TiltCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_HUBS.map((hub) => (
            <TiltCard
              key={hub.id}
              className="rounded-3xl border-2 border-[#FAF7EE]/20 bg-[#FAF7EE]/5 p-6 sm:p-8 backdrop-blur-md shadow-[5px_5px_0_0_#FF4D00] transition-all hover:border-[#FFC72E]"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-display text-xl font-black uppercase text-[#FFC72E]">
                  {hub.city}
                </span>
                <span className="rounded-full bg-[#25D366] text-[#141414] px-2.5 py-0.5 font-display text-[10px] font-black uppercase">
                  {hub.status}
                </span>
              </div>

              <p className="text-xs font-bold uppercase text-[#FAF7EE]/70 mb-4">
                {hub.specialty}
              </p>

              <div className="space-y-2 border-t border-[#FAF7EE]/15 pt-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">LATENCY:</span>
                  <span className="text-[#25D366] font-bold">{hub.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">TIMEZONE:</span>
                  <span className="text-[#FAF7EE] font-bold">{hub.timezone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#FAF7EE]/50">ACTIVE SQUADS:</span>
                  <span className="text-[#FF4D00] font-bold">{hub.activeSquads}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#FAF7EE]/15">
                <a
                  href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to route a project through your ${hub.city} hub.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#FAF7EE] hover:bg-[#FF4D00] text-[#141414] hover:text-[#FAF7EE] font-display text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="size-3.5" />
                  <span>CONNECT VIA {hub.city.toUpperCase()}</span>
                </a>
              </div>

            </TiltCard>
          ))}
        </div>

      </div>
    </section>
  );
}
