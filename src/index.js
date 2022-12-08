import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Text from './Text'
import Effects from './Effects'
import Sparks from './Sparks'
import Particles from './Particles'
import { Controls, useControl, withControls } from 'react-three-gui';
import './styles.css'

const MyCanvas = withControls(Canvas);

function Number({ hover, mouse }) {
  const ref = useRef()
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.mouse.x * 2, 0.1)
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.mouse.y / 2, 0.1)
      ref.current.rotation.y = 0.8
    }
  })
  const isParticleOn = useControl('particle', { type: 'boolean', value: false })
  const isSparkOn = useControl('spark', { type: 'boolean', value: false })
  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text
          size={10}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}>
          4
        </Text>
      </group>
      {isParticleOn ?
        <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
      : null}
      {isSparkOn ?
        <Sparks count={20} mouse={mouse} colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']} />
      : null}
    </Suspense>
  )
}

function App() {
  const [hovered, hover] = useState(false)
  const mouse = useRef([0, 0])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])

  return (
    <Controls.Provider>
      <div
        style={{
          width: "100vw",
          height: "100vh"
        }}
        onClick={() => setIsClicked(true)}
      >
        <MyCanvas
          linear
          dpr={[1, 2]}
          camera={{ fov: 100, position: [0, 0, 30] }}
          onCreated={({ gl }) => {
            // gl.toneMapping = THREE.Uncharted2ToneMapping
            gl.setClearColor(new THREE.Color('#020207'))
          }}>
          <fog attach="fog" args={['white', 50, 190]} />
          <pointLight distance={100} intensity={4} color="white" />
          <Number mouse={mouse} hover={hover} />
          <Effects />
        </MyCanvas>
      </div>
      <Controls
        title="시각 효과 토글"
        width={300}
      />
    </Controls.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
