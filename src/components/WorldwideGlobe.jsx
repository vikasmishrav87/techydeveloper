import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GLOBAL_HUBS, CONTACT_INFO } from '../data/agencyData';
import { Globe, Shield, Radio, Activity, Send, MessageCircle, ExternalLink, Zap, ArrowRight } from 'lucide-react';

export default function WorldwideGlobe({ onSelectHub }) {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeHub, setActiveHub] = useState(GLOBAL_HUBS[5]); // Default to Mumbai NOC

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Inner Core Sphere
    const sphereGeo = new THREE.SphereGeometry(70, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x0A1128,
      emissive: 0x040814,
      shininess: 35,
      transparent: true,
      opacity: 0.95,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeMesh);

    // Outer Wireframe Grid Rings
    const wireframeGeo = new THREE.SphereGeometry(70.8, 28, 28);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // Starfield Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600;
      starPositions[i + 1] = (Math.random() - 0.5) * 600;
      starPositions[i + 2] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Coordinate conversion helper (lat/lon to 3D point)
    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Add Hub Markers & Glowing Rings
    const hubMarkers = [];
    GLOBAL_HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, 71.5);

      // Core point
      const pinGeo = new THREE.SphereGeometry(1.8, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      // Pulsing Outer Ring
      const ringGeo = new THREE.RingGeometry(2.2, 3.4, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      hubMarkers.push({ pin: pinMesh, ring: ringMesh, hub });
    });

    // Draw Bezier Curved Connection Arcs between Hubs
    const curveConnections = [
      [0, 1], // SFO to NYC
      [1, 2], // NYC to London
      [2, 3], // London to Zurich
      [3, 4], // Zurich to Dubai
      [4, 5], // Dubai to Mumbai
      [5, 6], // Mumbai to Singapore
      [6, 7], // Singapore to Tokyo
      [7, 8], // Tokyo to Sydney
      [0, 5], // SFO to Mumbai
    ];

    curveConnections.forEach(([fromIdx, toIdx]) => {
      const fromHub = GLOBAL_HUBS[fromIdx];
      const toHub = GLOBAL_HUBS[toIdx];
      if (!fromHub || !toHub) return;

      const v1 = latLonToVector3(fromHub.lat, fromHub.lon, 71.5);
      const v2 = latLonToVector3(toHub.lat, toHub.lon, 71.5);

      // Control point elevated above globe surface
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      mid.normalize().multiplyScalar(71.5 + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(36);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        linewidth: 1.5,
      });
      const curveMesh = new THREE.Line(curveGeo, curveMat);
      globeGroup.add(curveMesh);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(120, 100, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.2);
    dirLight2.position.set(-120, -100, -100);
    scene.add(dirLight2);

    // Interactive Drag to Rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const domEl = renderer.domElement;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (!isDragging) {
        globeGroup.rotation.y += 0.0022;
      }

      // Pulsate rings
      hubMarkers.forEach((item, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        item.ring.scale.set(scale, scale, scale);
      });

      // Slowly rotate starfield
      starField.rotation.y = elapsedTime * 0.0006;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <section id="worldwide" className="relative py-28 bg-[#EEF2FF] text-slate-900 overflow-hidden border-t border-b border-indigo-100/90">
      
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 bg-light-grid opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-widest mb-4 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
            Global Engineering Network • 40+ Countries
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-slate-950 mb-6">
            Serving Brands & Enterprises <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 font-normal">Worldwide</span>
          </h2>
          <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed">
            From Silicon Valley to Zurich, Tokyo to Mumbai — our specialized engineering squads and digital marketing growth engines operate 24/7 across every time zone with zero latency compromise.
          </p>
        </div>

        {/* 3D Globe & Interactive Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Overlaid Global Metrics & Hub Selection */}
          <div className="lg:col-span-5 space-y-6 reveal-on-scroll">
            
            {/* Mission Critical Stat Card */}
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-sky-700 tracking-wider font-semibold">Infrastructure Telemetry</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  100% OPERATIONAL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-950">40+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Countries Served</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-700">99.999%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Zero-Breach SLA</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-indigo-700">150+</div>
                  <div className="text-xs text-slate-500 mt-0.5">Deployments</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-950">24/7</div>
                  <div className="text-xs text-slate-500 mt-0.5">Follow-The-Sun NOC</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-normal leading-relaxed border-t border-slate-100 pt-3">
                Decentralized nodes ensure zero single-point-of-failure. Engineering squads deployed across North America, Europe, Middle East, and APAC.
              </p>
            </div>

            {/* Active Hub Telemetry Card */}
            <div className="bg-white/95 border border-indigo-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <h4 className="text-sm font-semibold text-slate-950 tracking-wide">Regional Node Telemetry</h4>
                </div>
                <span className="text-xs font-mono text-slate-500">Select Hub</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-semibold text-slate-950">{activeHub.name}</h5>
                    <p className="text-xs text-indigo-700 font-mono mt-0.5">{activeHub.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-sky-100 border border-sky-200 text-sky-800 text-xs font-mono font-bold">
                      {activeHub.ping}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">{activeHub.clients} Active Projects</p>
                  </div>
                </div>
              </div>

              {/* Quick Hub Selector Pills */}
              <div className="flex flex-wrap gap-1.5">
                {GLOBAL_HUBS.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => setActiveHub(hub)}
                    className={"px-2.5 py-1 rounded-lg text-xs font-mono transition-all " + (
                      activeHub.id === hub.id
                        ? "bg-slate-950 text-white font-semibold shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                    )}
                  >
                    {hub.name.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Action Link to Worldwide Page */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (location.pathname === '/worldwide') {
                    const el = document.getElementById('nodes-directory');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  } else {
                    navigate('/worldwide');
                    setTimeout(() => {
                      const el = document.getElementById('nodes-directory');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 200);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-all shadow-md shadow-sky-600/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Full Global Node Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: 3D Interactive WebGL Rotating Globe Canvas */}
          <div className="lg:col-span-7 relative reveal-on-scroll">
            <div className="relative w-full h-[460px] sm:h-[560px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center">
              
              {/* 3D WebGL Mount */}
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* Floating Interaction Helper */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-mono backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  Interactive 3D Orbit: Drag with mouse to rotate
                </div>
              </div>

              {/* Top Right Live Sync Badge */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-right backdrop-blur-md">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Synchronized Nodes</div>
                  <div className="text-xs font-mono text-sky-400 font-semibold">9 Global Hubs • 40+ PoPs</div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
