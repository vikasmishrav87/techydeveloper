import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { Globe2, MessageCircle, ArrowRight, Zap, Radio, Activity, Cpu, Server, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import TiltCard from './TiltCard';

function Interactive3DGlobeCanvas({ activeCity, onSelectHub }) {
  const mountRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let renderer, scene, camera, animId;

    try {
      const width = currentMount.clientWidth || 400;
      const height = currentMount.clientHeight || 400;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 24;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      currentMount.appendChild(renderer.domElement);

      // 3D Wireframe Earth Sphere - Bold Neo-Brutalist Ink lines
      const sphereGeo = new THREE.SphereGeometry(8, 28, 28);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x141414,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      const earth = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(earth);

      // Inner Cream Core
      const coreGeo = new THREE.SphereGeometry(7.7, 24, 24);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xFAF7EE,
        transparent: true,
        opacity: 0.95,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      // Hub Coordinates on 3D Sphere (Lat, Long converted to Vector3)
      const hubCoords = [
        { name: 'Mumbai', lat: 19.076, lon: 72.877, color: 0xFF4D00 },
        { name: 'San Francisco', lat: 37.7749, lon: -122.4194, color: 0xFFC72E },
        { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0x141414 },
        { name: 'London', lat: 51.5074, lon: -0.1278, color: 0xFF4D00 },
        { name: 'Zurich', lat: 47.3769, lon: 8.5417, color: 0x25D366 },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, color: 0xFFC72E },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198, color: 0xFF4D00 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0x141414 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093, color: 0x25D366 },
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
        const markerGeo = new THREE.SphereGeometry(0.38, 12, 12);
        const markerMat = new THREE.MeshBasicMaterial({ color: hub.color });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.copy(pos);
        markersGroup.add(marker);

        // Outer Pulsing Ring
        const ringGeo = new THREE.RingGeometry(0.48, 0.72, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: hub.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
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
          color: 0xFF4D00,
          transparent: true,
          opacity: 0.45,
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
        if (!currentMount || !renderer) return;
        const newW = currentMount.clientWidth;
        const newH = currentMount.clientHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      window.addEventListener('resize', onResize);

      // Animation Loop
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
        if (animId) cancelAnimationFrame(animId);
        if (currentMount && renderer && renderer.domElement && currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization fallback in 3D Globe:', err);
      setWebGlSupported(false);
    }
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing relative flex items-center justify-center overflow-hidden bg-[#FAF7EE] rounded-2xl"
      title="Click and drag to rotate the 3D Worldwide Mesh Globe"
    >
      <div className="absolute top-3 left-3 sticker-pill px-3 py-1 bg-[#141414] text-[#FAF7EE] text-[10px] font-mono shadow-[2px_2px_0_0_#FF4D00] flex items-center gap-1.5 z-10">
        <Radio className="size-3 animate-pulse text-[#25D366]" />
        <span>3D ROTATING MESH • DRAG TO EXPLORE</span>
      </div>

      {!webGlSupported && (
        <div className="text-center text-[#141414]/70 font-mono text-xs">
          <Globe2 className="size-16 mx-auto mb-2 text-[#FF4D00] animate-spin" />
          <p>Global Distributed Telemetry Mesh Active</p>
        </div>
      )}
    </div>
  );
}

export default function WorldwideGlobe() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  return (
    <section id="worldwide" className="relative py-12 sm:py-20 bg-[#FAF7EE] text-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="sticker-pill px-3.5 py-1 bg-[#FFC72E] text-[#141414] text-xs font-black uppercase shadow-[3px_3px_0_0_#141414]">
                <Zap className="size-3.5 inline mr-1 fill-[#FF4D00] text-[#FF4D00]" />
                DISTRIBUTED DEPLOYMENT MESH
              </span>
              <span className="sticker-pill px-3.5 py-1 bg-[#25D366] text-[#141414] text-xs font-black uppercase shadow-[3px_3px_0_0_#141414]">
                99.999% SLA UPTIME
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#141414]">
              WORLDWIDE 3D NETWORK
            </h1>
          </div>
          <p className="max-w-md text-sm sm:text-base font-medium text-[#141414]/80">
            1,000+ senior engineers operating across key global financial and tech hubs with sub-20ms latency and 24/7 follow-the-sun execution.
          </p>
        </div>

        {/* Global Telemetry Summary Bar - Neo-Brutalist Cards */}
        <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] p-4 shadow-[4px_4px_0_0_#141414]">
            <span className="text-[10px] font-mono font-bold text-[#141414]/60 block uppercase">Primary Engineering HQ</span>
            <span className="font-display text-lg sm:text-xl font-black text-[#FF4D00]">Mumbai NOC (8ms)</span>
          </div>
          <div className="rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] p-4 shadow-[4px_4px_0_0_#141414]">
            <span className="text-[10px] font-mono font-bold text-[#141414]/60 block uppercase">Total Senior Engineers</span>
            <span className="font-display text-lg sm:text-xl font-black text-[#141414]">1,000+ Specialists</span>
          </div>
          <div className="rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] p-4 shadow-[4px_4px_0_0_#141414]">
            <span className="text-[10px] font-mono font-bold text-[#141414]/60 block uppercase">Global Hubs Connected</span>
            <span className="font-display text-lg sm:text-xl font-black text-[#FF4D00]">9 Key Tech Nodes</span>
          </div>
          <div className="rounded-2xl border-2 border-[#141414] bg-[#F4EFE6] p-4 shadow-[4px_4px_0_0_#141414]">
            <span className="text-[10px] font-mono font-bold text-[#141414]/60 block uppercase">Security SLA</span>
            <span className="font-display text-lg sm:text-xl font-black text-[#25D366]">Zero Breach Record</span>
          </div>
        </div>

        {/* 3D Globe Interactive Canvas Card - Neo-Brutalist Style */}
        <div className="mb-12 rounded-3xl border-2 border-[#141414] bg-[#F4EFE6] p-4 sm:p-6 shadow-[8px_8px_0_0_#141414] overflow-hidden">
          <div className="mb-4 flex items-center justify-between border-b-2 border-[#141414]/15 pb-3">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF4D00] border border-[#141414]"></span>
              <span className="size-3 rounded-full bg-[#FFC72E] border border-[#141414]"></span>
              <span className="size-3 rounded-full bg-[#25D366] border border-[#141414]"></span>
              <span className="font-display text-xs sm:text-sm font-black uppercase text-[#141414] ml-2">
                REAL-TIME GLOBAL TOPOLOGY MESH
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#141414]/70">
              GLOBAL NOC STATUS: OPERATIONAL
            </span>
          </div>
          <Interactive3DGlobeCanvas activeCity={selectedCity} onSelectHub={setSelectedCity} />
        </div>

        {/* Hubs Grid with Neo-Brutalist 3D TiltCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GLOBAL_HUBS.map((hub) => {
            const cityName = hub.name ? hub.name.split(',')[0].trim() : (hub.city || 'Global Hub');
            const countryName = hub.name ? hub.name.split(',')[1]?.trim() : '';
            const specialtyRole = hub.role || hub.specialty || 'Engineering & Infrastructure';
            const latencyPing = hub.ping || hub.latency || '< 20ms';
            const clientCount = hub.clients || hub.activeSquads || '20+';

            return (
              <TiltCard
                key={hub.id}
                className="brutal-card rounded-3xl border-2 border-[#141414] bg-[#FAF7EE] p-6 sm:p-8 shadow-[6px_6px_0_0_#141414] flex flex-col justify-between hover:border-[#FF4D00] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-display text-xl sm:text-2xl font-black uppercase text-[#141414] block">
                        {cityName}
                      </span>
                      {countryName && (
                        <span className="text-[11px] font-mono font-bold text-[#141414]/60 uppercase flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-[#FF4D00]" />
                          {countryName}
                        </span>
                      )}
                    </div>
                    <span className="sticker-pill px-3 py-1 bg-[#25D366] text-[#141414] text-[10px] font-black uppercase shadow-[2px_2px_0_0_#141414]">
                      {hub.status || 'Active'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold uppercase text-[#FF4D00] mb-4">
                    {specialtyRole}
                  </p>

                  <div className="space-y-2 border-t-2 border-[#141414]/10 pt-4 text-xs font-mono font-bold text-[#141414]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#141414]/60">NETWORK LATENCY:</span>
                      <span className="text-[#141414] font-black flex items-center gap-1">
                        <span className="size-2 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
                        {latencyPing}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#141414]/60">ACTIVE SQUADS:</span>
                      <span className="text-[#141414] font-black">{clientCount} SQUADS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#141414]/60">COVERAGE:</span>
                      <span className="text-[#141414]">24/7 Follow-the-Sun</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#141414]/10">
                  <a
                    href={`https://wa.me/918369804739?text=${encodeURIComponent(`Hi Vikas, I want to route our project through your ${cityName} engineering hub.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticker-pill w-full py-3 bg-[#141414] hover:bg-[#FF4D00] text-[#FAF7EE] shadow-[3px_3px_0_0_#141414] flex items-center justify-center gap-2 font-black text-xs uppercase cursor-pointer transition-all"
                  >
                    <MessageCircle className="size-3.5" />
                    <span>CONNECT VIA {cityName.toUpperCase()}</span>
                  </a>
                </div>

              </TiltCard>
            );
          })}
        </div>

        {/* Bottom Squad Deployment CTA */}
        <div className="mt-14 sm:mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="sticker-pill px-8 py-4 sm:px-10 sm:py-5 text-sm sm:text-base bg-[#FF4D00] hover:bg-[#FFC72E] hover:text-[#141414] text-[#FAF7EE] shadow-[5px_5px_0_0_#141414] cursor-pointer flex items-center justify-center gap-2 font-black uppercase"
          >
            <Zap className="size-4" />
            <span>DISPATCH GLOBAL SQUAD TO YOUR PROJECT</span>
            <ArrowRight className="size-4" />
          </Link>
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker-pill px-6 py-4 text-sm bg-[#25D366] text-[#141414] shadow-[4px_4px_0_0_#141414] cursor-pointer flex items-center justify-center gap-2 font-black uppercase"
          >
            <MessageCircle className="size-4" />
            <span>WHATSAPP (+91 8369804739)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
